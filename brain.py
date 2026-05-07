import os
import re
import time
import feedparser
import requests
import pytz

from groq import Groq
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

# ── Environment ───────────────────────────────────────────────────────────────

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

missing_env = []

if not SUPABASE_URL:
    missing_env.append("SUPABASE_URL")

if not SUPABASE_SERVICE_KEY:
    missing_env.append("SUPABASE_SERVICE_KEY")

if not GROQ_API_KEY:
    missing_env.append("GROQ_API_KEY")

if missing_env:
    raise RuntimeError(f"Missing environment variables: {', '.join(missing_env)}")


# ── Clients ──────────────────────────────────────────────────────────────────

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
groq_client = Groq(api_key=GROQ_API_KEY)


# ── Config ───────────────────────────────────────────────────────────────────

GEORGIA_TZ = pytz.timezone("Asia/Tbilisi")

SOURCES = {
    "OpenAI": "https://openai.com/news/rss.xml",
    "DeepMind": "https://deepmind.google/blog/rss.xml",
    "HuggingFace": "https://huggingface.co/blog/feed.xml",
    "ImportAI": "https://importai.substack.com/feed",
    "Anthropic": "https://www.anthropic.com/news",
}


# ── Helpers ──────────────────────────────────────────────────────────────────

def clean_text(value):
    if not value:
        return ""

    value = BeautifulSoup(value, "html.parser").get_text(" ")
    value = re.sub(r"\s+", " ", value)
    return value.strip()


def clamp_score(score):
    try:
        score = float(score)
    except Exception:
        return 8.5

    if score < 1:
        return 1.0

    if score > 10:
        return 10.0

    return round(score, 1)


def parse_ai_response(result_text):
    try:
        score_match = re.search(r"SCORE:\s*([0-9]+(?:\.[0-9]+)?)", result_text)
        georgian_match = re.search(
            r"GEORGIAN:\s*(.*?)(?=\n\s*ENGLISH:)",
            result_text,
            re.DOTALL,
        )
        english_match = re.search(
            r"ENGLISH:\s*(.*)$",
            result_text,
            re.DOTALL,
        )

        if not score_match or not georgian_match or not english_match:
            raise ValueError("AI response format was not correct.")

        score = clamp_score(score_match.group(1))
        georgian_content = georgian_match.group(1).strip()
        english_content = english_match.group(1).strip()

        return georgian_content, english_content, score

    except Exception as error:
        print(f"⚠️ Could not parse AI response. Error: {error}")
        print("⚠️ Raw AI response:")
        print(result_text)

        return result_text.strip(), result_text.strip(), 8.5


# ── News Gathering ────────────────────────────────────────────────────────────

def fetch_anthropic_news():
    print("🔎 Fetching Anthropic news...")

    try:
        response = requests.get(
            SOURCES["Anthropic"],
            timeout=15,
            headers={
                "User-Agent": "Mozilla/5.0 SulertiaMediaBot/1.0",
            },
        )
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")
        news_items = []

        for tag in soup.find_all(["h1", "h2", "h3"]):
            title = clean_text(tag.get_text(" "))

            if len(title) < 15:
                continue

            lowered = title.lower()

            blocked_words = [
                "skip",
                "content",
                "menu",
                "logo",
                "navigation",
                "search",
                "sign in",
                "subscribe",
                "privacy",
                "terms",
                "careers",
            ]

            if any(word in lowered for word in blocked_words):
                continue

            news_items.append(
                {
                    "title": title,
                    "source": "Anthropic",
                }
            )

        unique_items = []
        seen_titles = set()

        for item in news_items:
            key = item["title"].lower()

            if key not in seen_titles:
                seen_titles.add(key)
                unique_items.append(item)

        return unique_items[:3]

    except Exception as error:
        print(f"⚠️ Anthropic scrape error: {error}")
        return []


def fetch_rss_news(source_name, url):
    print(f"🔎 Fetching {source_name} RSS...")

    try:
        feed = feedparser.parse(url)
        items = []

        for entry in feed.entries[:5]:
            title = clean_text(getattr(entry, "title", ""))

            if not title:
                continue

            items.append(
                {
                    "title": title,
                    "source": source_name,
                }
            )

        return items[:3]

    except Exception as error:
        print(f"⚠️ Feed error ({source_name}): {error}")
        return []


def gather_exactly_7():
    print("🧠 Gathering AI news...")

    temp_pool = {}

    for source_name, url in SOURCES.items():
        if source_name == "Anthropic":
            temp_pool[source_name] = fetch_anthropic_news()
        else:
            temp_pool[source_name] = fetch_rss_news(source_name, url)

    collected = []

    # First, take one from each source for diversity.
    for source_name in temp_pool.keys():
        if temp_pool[source_name]:
            collected.append(temp_pool[source_name].pop(0))

    # Then fill remaining slots.
    remaining = []

    for items in temp_pool.values():
        remaining.extend(items)

    seen_titles = {item["title"].lower() for item in collected}

    for item in remaining:
        if len(collected) >= 7:
            break

        key = item["title"].lower()

        if key in seen_titles:
            continue

        seen_titles.add(key)
        collected.append(item)

    print(f"✅ Found {len(collected)} news items.")

    for index, item in enumerate(collected, start=1):
        print(f"{index}. [{item['source']}] {item['title']}")

    return collected[:7]


# ── Text Generation ───────────────────────────────────────────────────────────

def generate_digest_and_score(digest_list):
    context = "\n".join(
        [f"- {item['source']}: {item['title']}" for item in digest_list]
    )

    system_prompt = (
        "You are a professional AI news editor for Sulertia Media. "
        "You write clear, accurate, short, and natural summaries. "
        "For Georgian, do not use literal translation. Use fluent Georgian. "
        "For English, use clean modern news language. "
        "You must follow the requested output format exactly."
    )

    user_prompt = (
        f"Analyze these AI news items:\n{context}\n\n"
        "Task:\n"
        "1. Create a 7-item numbered list in natural Georgian.\n"
        "2. Create the same 7-item numbered list in clean English.\n"
        "3. Assign one overall Importance Score from 1.0 to 10.0.\n\n"
        "Rules:\n"
        "- Keep every point concise.\n"
        "- Do not invent company announcements that are not implied by the titles.\n"
        "- Do not mention sources unless useful.\n"
        "- Georgian must sound natural, not translated word-for-word.\n"
        "- English must have the same meaning as Georgian.\n\n"
        "Format exactly like this:\n"
        "SCORE: [number]\n"
        "GEORGIAN:\n"
        "1. [Georgian sentence]\n"
        "2. [Georgian sentence]\n"
        "3. [Georgian sentence]\n"
        "4. [Georgian sentence]\n"
        "5. [Georgian sentence]\n"
        "6. [Georgian sentence]\n"
        "7. [Georgian sentence]\n\n"
        "ENGLISH:\n"
        "1. [English sentence]\n"
        "2. [English sentence]\n"
        "3. [English sentence]\n"
        "4. [English sentence]\n"
        "5. [English sentence]\n"
        "6. [English sentence]\n"
        "7. [English sentence]"
    )

    print("✍️ Generating Georgian and English digest...")

    response = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": user_prompt,
            },
        ],
        temperature=0.45,
    )

    result_text = response.choices[0].message.content.strip()

    georgian_content, english_content, score = parse_ai_response(result_text)

    return georgian_content, english_content, score


# ── Supabase Update ───────────────────────────────────────────────────────────

def update_current_post(content, content_en, score):
    now = datetime.now(GEORGIA_TZ)

    next_post_at = (now + timedelta(days=1)).replace(
        hour=7,
        minute=0,
        second=0,
        microsecond=0,
    )

    print("🔄 Updating Supabase...")

    # Archive old current posts.
    supabase.table("posts").update(
        {
            "is_current": False,
        }
    ).eq("is_current", True).execute()

    # Insert new post with both Georgian and English fields.
    result = supabase.table("posts").insert(
        {
            "title": "Daily AI Report: 7 მთავარი მოვლენა",
            "title_en": "Daily AI Report: 7 Key Updates",
            "content": content,
            "content_en": content_en,
            "image_url": None,
            "importance_score": score,
            "category": "ხელოვნური ინტელექტი",
            "category_en": "Artificial Intelligence",
            "is_current": True,
            "next_post_at": next_post_at.isoformat(),
        }
    ).execute()

    print(f"✅ New post inserted. Score: {score}")
    return result


# ── Runner ───────────────────────────────────────────────────────────────────

def run_brain_once():
    print("🚀 Sulertia Media Brain started.")

    digest_list = gather_exactly_7()

    if len(digest_list) < 7:
        print(f"⚠️ Could not collect 7 news items. Found: {len(digest_list)}")
        return

    content, content_en, score = generate_digest_and_score(digest_list)

    print("🇬🇪 Georgian content:")
    print(content)

    print("\n🇬🇧 English content:")
    print(content_en)

    update_current_post(
        content=content,
        content_en=content_en,
        score=score,
    )


def run_brain_loop():
    print("🚀 Sulertia Media Brain loop active.")
    last_post_date = None

    while True:
        now = datetime.now(GEORGIA_TZ)
        today = now.date()

        if now.hour == 7 and now.minute < 5 and last_post_date != today:
            try:
                run_brain_once()
                last_post_date = today

            except Exception as error:
                print(f"❌ Brain error: {error}")

            time.sleep(600)

        time.sleep(30)


if __name__ == "__main__":
    # GitHub Actions should run one post and stop.
    # Local/server loop can be enabled with RUN_LOOP=true.
    if os.getenv("RUN_LOOP", "false").lower() == "true":
        run_brain_loop()
    else:
        run_brain_once()
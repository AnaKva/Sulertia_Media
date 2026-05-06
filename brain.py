import os
import time
import uuid
from urllib.parse import quote_plus
from datetime import datetime, timedelta

import feedparser
import pytz
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from google import genai
from google.genai import types as genai_types
from groq import Groq
from supabase import create_client


load_dotenv()

# ── Config ───────────────────────────────────────────────────────────────────

GEORGIA_TZ = pytz.timezone("Asia/Tbilisi")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

DEFAULT_IMAGE = "https://sulertia.media/default-ai-style.jpg"

SOURCES = {
    "OpenAI": "https://openai.com/news/rss.xml",
    "DeepMind": "https://deepmind.google/blog/rss.xml",
    "HuggingFace": "https://huggingface.co/blog/feed.xml",
    "ImportAI": "https://importai.substack.com/feed",
    "Anthropic": "https://www.anthropic.com/news",
}


# ── Safety checks ─────────────────────────────────────────────────────────────

required_env = {
    "SUPABASE_URL": SUPABASE_URL,
    "SUPABASE_SERVICE_KEY": SUPABASE_SERVICE_KEY,
    "GROQ_API_KEY": GROQ_API_KEY,
}

missing = [key for key, value in required_env.items() if not value]

if missing:
    raise RuntimeError(f"Missing environment variables: {', '.join(missing)}")


# ── Clients ──────────────────────────────────────────────────────────────────

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
groq_client = Groq(api_key=GROQ_API_KEY)

gemini_client = None
if GEMINI_API_KEY:
    gemini_client = genai.Client(api_key=GEMINI_API_KEY)
else:
    print("⚠️ GEMINI_API_KEY missing. Gemini image generation will be skipped.")


# ── News gathering ────────────────────────────────────────────────────────────

def fetch_anthropic_news():
    """
    Anthropic does not use the same RSS style here, so this scrapes their news page.
    This may break if Anthropic changes their website HTML.
    """
    try:
        r = requests.get(
            SOURCES["Anthropic"],
            timeout=15,
            headers={"User-Agent": "SulertiaMedia/1.0"},
        )
        r.raise_for_status()

        soup = BeautifulSoup(r.text, "html.parser")

        news_items = []

        for tag in soup.find_all(["h2", "h3"]):
            title = tag.get_text(separator=" ").strip()

            if len(title) < 15:
                continue

            if any(
                word in title.lower()
                for word in [
                    "skip",
                    "content",
                    "menu",
                    "logo",
                    "navigation",
                    "search",
                    "sign in",
                    "subscribe",
                ]
            ):
                continue

            news_items.append({"title": title, "source": "Anthropic"})

        return news_items[:3]

    except Exception as e:
        print(f"⚠️ Anthropic scrape error: {e}")
        return []


def gather_exactly_7():
    """
    Collects exactly 7 news items from multiple AI-related sources.
    It first tries to take one from each source for diversity, then fills the rest.
    """
    temp_pool = {}

    for name, url in SOURCES.items():
        if name == "Anthropic":
            temp_pool[name] = fetch_anthropic_news()
            continue

        try:
            feed = feedparser.parse(url)

            temp_pool[name] = [
                {"title": entry.title, "source": name}
                for entry in feed.entries[:4]
                if hasattr(entry, "title") and len(entry.title.strip()) > 8
            ]

        except Exception as e:
            print(f"⚠️ Feed error ({name}): {e}")
            temp_pool[name] = []

    collected = []

    for name in list(temp_pool.keys()):
        if temp_pool[name]:
            collected.append(temp_pool[name].pop(0))

    all_remaining = [item for items in temp_pool.values() for item in items]

    while len(collected) < 7 and all_remaining:
        collected.append(all_remaining.pop(0))

    return collected[:7]


# ── Text generation ───────────────────────────────────────────────────────────

def generate_digest_and_score(digest_list):
    context = "\n".join(
        [f"- {item['source']}: {item['title']}" for item in digest_list]
    )

    system_prompt = (
        "შენ ხარ პროფესიონალი ქართველი რედაქტორი და ტექნოლოგიური ჟურნალისტი. "
        "წერ ბუნებრივ, გამართულ, მოკლე და სუფთა ქართულად. "
        "არ გამოიყენო ზედმეტად რთული სიტყვები. ტექსტი უნდა ჟღერდეს როგორც კარგი ქართული მედიის დაიჯესტი."
    )

    user_prompt = (
        f"Analyze these 7 AI news items:\n{context}\n\n"
        "Task:\n"
        "1. Create a 7-item numbered list in natural Georgian.\n"
        "2. Each item should be one clear sentence.\n"
        "3. Avoid literal translation. Make it sound natural.\n"
        "4. Assign one overall Importance Score from 1.0 to 10.0.\n\n"
        "Format exactly like this:\n"
        "SCORE: [number]\n"
        "LIST:\n"
        "1. [sentence]\n"
        "2. [sentence]\n"
        "3. [sentence]\n"
        "4. [sentence]\n"
        "5. [sentence]\n"
        "6. [sentence]\n"
        "7. [sentence]"
    )

    response = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.55,
    )

    result_text = response.choices[0].message.content.strip()

    try:
        score_text = result_text.split("SCORE:")[1].split("\n")[0].strip()
        score = float(score_text)

        content = result_text.split("LIST:")[1].strip()

    except Exception:
        print("⚠️ Could not parse AI response format. Using fallback score.")
        score = 8.5
        content = result_text

    return content, score


# ── Image generation ──────────────────────────────────────────────────────────

def build_image_prompt(main_topic):
    return (
        f"Create a premium editorial hero image for an AI news website article about: {main_topic}. "
        "Style: futuristic, cyber-minimalist, dark navy background, subtle orange accents, cinematic lighting, "
        "clean composition, high-tech atmosphere, abstract technology visuals, no text, no watermark, no logos, "
        "16:9 aspect ratio."
    )


def get_public_url(bucket_name, file_name):
    result = supabase.storage.from_(bucket_name).get_public_url(file_name)

    if isinstance(result, str):
        return result

    if isinstance(result, dict):
        return (
            result.get("publicUrl")
            or result.get("publicURL")
            or result.get("public_url")
            or result.get("data", {}).get("publicUrl")
            or result.get("data", {}).get("publicURL")
            or result.get("data", {}).get("public_url")
        )

    return None


def upload_image_to_supabase(image_bytes, ext="png", content_type="image/png"):
    file_name = f"news_{int(time.time())}_{uuid.uuid4().hex[:8]}.{ext}"

    supabase.storage.from_("images").upload(
        file_name,
        image_bytes,
        {
            "content-type": content_type,
            "upsert": "true",
        },
    )

    public_url = get_public_url("images", file_name)

    if not public_url:
        print("⚠️ Could not get public URL from Supabase Storage.")
        return DEFAULT_IMAGE

    return public_url


def generate_visual_gemini(main_topic):
    """
    Primary image generation.
    Uses Gemini/Imagen if GEMINI_API_KEY is available.
    """
    if not gemini_client:
        return None

    print(f"🎨 Gemini image generation: {main_topic}")

    image_prompt = build_image_prompt(main_topic)

    try:
        response = gemini_client.models.generate_images(
            model="imagen-3.0-generate-002",
            prompt=image_prompt,
            config=genai_types.GenerateImagesConfig(
                number_of_images=1,
                aspect_ratio="16:9",
                output_mime_type="image/png",
            ),
        )

        if not response.generated_images:
            raise RuntimeError("Gemini returned no generated images.")

        image_bytes = response.generated_images[0].image.image_bytes

        if not image_bytes:
            raise RuntimeError("Gemini returned empty image bytes.")

        return upload_image_to_supabase(
            image_bytes=image_bytes,
            ext="png",
            content_type="image/png",
        )

    except Exception as e:
        print(f"⚠️ Gemini image error: {e}")
        return None


def generate_visual_pollinations(main_topic):
    """
    Free fallback image generation using Pollinations.
    """
    print(f"🎨 Pollinations fallback: {main_topic}")

    image_prompt = build_image_prompt(main_topic)
    encoded_prompt = quote_plus(image_prompt)

    image_url = (
        f"https://image.pollinations.ai/prompt/{encoded_prompt}"
        f"?width=1024&height=576&nologo=true&model=flux"
    )

    try:
        response = requests.get(
            image_url,
            timeout=60,
            headers={"User-Agent": "SulertiaMedia/1.0"},
        )
        response.raise_for_status()

        content_type = response.headers.get("content-type", "image/png").lower()

        if "jpeg" in content_type or "jpg" in content_type:
            ext = "jpg"
            final_content_type = "image/jpeg"
        elif "webp" in content_type:
            ext = "webp"
            final_content_type = "image/webp"
        else:
            ext = "png"
            final_content_type = "image/png"

        return upload_image_to_supabase(
            image_bytes=response.content,
            ext=ext,
            content_type=final_content_type,
        )

    except Exception as e:
        print(f"⚠️ Pollinations error: {e}")
        return None


def generate_visual(main_topic):
    """
    Image pipeline:
    1. Gemini/Imagen if available
    2. Pollinations fallback
    3. Default image fallback
    """
    gemini_url = generate_visual_gemini(main_topic)

    if gemini_url:
        return gemini_url

    pollinations_url = generate_visual_pollinations(main_topic)

    if pollinations_url:
        return pollinations_url

    print("⚠️ All image generation failed. Using default image.")
    return DEFAULT_IMAGE


# ── Supabase update ───────────────────────────────────────────────────────────

def update_current_post(content, score, image_url):
    now = datetime.now(GEORGIA_TZ)

    next_post_at = (now + timedelta(days=1)).replace(
        hour=7,
        minute=0,
        second=0,
        microsecond=0,
    )

    print("🔄 Updating Supabase...")

    supabase.table("posts").update(
        {"is_current": False}
    ).eq("is_current", True).execute()

    supabase.table("posts").insert(
        {
            "title": "Daily AI Report: 7 მთავარი მოვლენა",
            "content": content,
            "image_url": image_url,
            "importance_score": score,
            "category": "Artificial Intelligence",
            "is_current": True,
            "next_post_at": next_post_at.isoformat(),
        }
    ).execute()

    print(f"✅ New post inserted. Score: {score}")


# ── Main runner ───────────────────────────────────────────────────────────────

def run_brain_once():
    print("🚀 Sulertia Media brain started.")

    digest_list = gather_exactly_7()

    if len(digest_list) < 7:
        print(f"⚠️ Could not collect 7 news items. Found: {len(digest_list)}")
        return

    print("🧠 Generating Georgian digest...")
    content, score = generate_digest_and_score(digest_list)

    main_topic = f"{digest_list[0]['title']} / {digest_list[1]['title']}"

    print("🖼️ Generating hero image...")
    image_url = generate_visual(main_topic)

    update_current_post(
        content=content,
        score=score,
        image_url=image_url,
    )

    print("🎉 Sulertia Media update complete.")


if __name__ == "__main__":
    run_brain_once()
import os
import time
import feedparser
import requests
import pytz
from groq import Groq
from google import genai                        # NEW SDK: pip install google-genai
from google.genai import types as genai_types
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

# ── Clients ──────────────────────────────────────────────────────────────────
# NEW SDK automatically reads GEMINI_API_KEY from the environment.
# If you want to pass it explicitly: genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
gemini_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

supabase    = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_SERVICE_KEY"))
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

GEORGIA_TZ    = pytz.timezone('Asia/Tbilisi')
DEFAULT_IMAGE = "https://your-site.com/default-ai-style.jpg"

SOURCES = {
    "OpenAI":      "https://openai.com/news/rss.xml",
    "DeepMind":    "https://deepmind.google/blog/rss.xml",
    "HuggingFace": "https://huggingface.co/blog/feed.xml",
    "ImportAI":    "https://importai.substack.com/feed",
    "Anthropic":   "https://www.anthropic.com/news",
}


# ── News gathering ────────────────────────────────────────────────────────────

def fetch_anthropic_news():
    """Anthropic-ის სკრაპინგი გაფილტვრით"""
    try:
        r = requests.get(SOURCES["Anthropic"], timeout=10)
        r.raise_for_status()
        soup = BeautifulSoup(r.text, 'html.parser')

        news_items = []
        for tag in soup.find_all(['h2', 'h3']):
            title = tag.get_text(separator=" ").strip()
            if len(title) < 15:
                continue
            if any(word in title.lower() for word in [
                "skip", "content", "menu", "logo", "navigation",
                "search", "sign in", "subscribe"
            ]):
                continue
            news_items.append({"title": title, "source": "Anthropic"})

        return news_items[:3]
    except Exception as e:
        print(f"⚠️ Anthropic scrape error: {e}")
        return []


def gather_exactly_7():
    """აგროვებს ზუსტად 7 სიახლეს 5 წყაროდან"""
    temp_pool = {}

    for name, url in SOURCES.items():
        if name == "Anthropic":
            temp_pool[name] = fetch_anthropic_news()
        else:
            try:
                feed = feedparser.parse(url)
                temp_pool[name] = [
                    {"title": e.title, "source": name}
                    for e in feed.entries[:3]
                    if hasattr(e, "title")
                ]
            except Exception as e:
                print(f"⚠️ Feed error ({name}): {e}")
                temp_pool[name] = []

    # One from each source first (diversity)
    collected = []
    for name in list(temp_pool.keys()):
        if temp_pool[name]:
            collected.append(temp_pool[name].pop(0))

    # Fill remaining slots up to 7
    all_remaining = [item for items in temp_pool.values() for item in items]
    while len(collected) < 7 and all_remaining:
        collected.append(all_remaining.pop(0))

    return collected[:7]


# ── Text generation ───────────────────────────────────────────────────────────

def generate_digest_text(digest_list):
    """ქმნის 7-პუნქტიან დაიჯესტს გაუმჯობესებული ქართულით"""
    context = "\n".join([f"- {d['source']}: {d['title']}" for d in digest_list])

    prompt = (
        "Step 1: Summarize each AI news item into one clear English sentence.\n"
        "Step 2: Translate these summaries into natural, minimalist, and professional Georgian.\n"
        "Step 3: Ensure the Georgian version doesn't sound like a literal translation. Use Insider tone.\n\n"
        f"News Items:\n{context}\n\n"
        f"Final Output Format:\n"
        + "\n".join([f"{i+1}. [Georgian Sentence]" for i in range(len(digest_list))])
    )

    system_prompt = (
        "შენ ხარ პროფესიონალი რედაქტორი, რომელიც ფილტრავს ნაგავ ინფორმაციას. "
        "ამასთანავე შენ ხარ ქართული ენისა და ლიტერატურის მცოდნე ფილოლოგი, "
        "რომელიც წინადადებებს ალაგებს გამართული გრამატიკით."
    )

    response = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user",   "content": prompt}
        ],
        temperature=0.6,
    )
    return response.choices[0].message.content.strip()

# ── Score generation ──────────────────────────────────────────────────────────

def generate_digest_and_score(digest_list):
    context = "\n".join([f"- {d['source']}: {d['title']}" for d in digest_list])
    
    prompt = (
        f"Analyze these 7 AI news items:\n{context}\n\n"
        "Task:\n"
        "1. Create a 7-item numbered list in natural Georgian.\n"
        "2. Assign an overall 'Importance Score' (from 1.0 to 10.0) based on how impactful these news are.\n\n"
        "Format your response exactly like this:\n"
        "SCORE: [number]\n"
        "LIST:\n1. [sentence]\n...etc"
    )

    response = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.6,
    )
    res_text = response.choices[0].message.content.strip()
    
    # ქულის ამოღება ტექსტიდან
    try:
        score = float(res_text.split("SCORE:")[1].split("\n")[0].strip())
        content = res_text.split("LIST:")[1].strip()
    except:
        score = 8.5 # Fallback, თუ AI-მ ფორმატი დაარღვია
        content = res_text
        
    return content, score

# ── Image generation ──────────────────────────────────────────────────────────

# def generate_visual(main_topic):
#     """
#     სურათის გენერაცია Gemini-ს Nano Banana-ით (gemini-2.5-flash-image).

#     TWO OPTIONS — uncomment the one you want:
#       Option A: Nano Banana (gemini-2.5-flash-image) — fast, uses generate_content
#       Option B: Imagen 3   (imagen-3.0-generate-002) — higher fidelity, uses generate_images

#     Both use the new `google-genai` SDK (pip install google-genai).
#     The old `google-generativeai` package is deprecated and does NOT have Client().
#     """
#     print(f"🎨 ვიზუალის გენერაცია თემაზე: {main_topic}")

#     image_prompt = (
#         f"Cyber-minimalist abstract digital art, concept: {main_topic}, "
#         "dark theme, cinematic lighting, high-tech, 16:9 aspect ratio"
#     )

#     try:
#         # ── Option A: Nano Banana (gemini-2.5-flash-image) ──────────────────
#         # Fast image generation/editing model. Returns inline image bytes.
#         response = gemini_client.models.generate_content(
#             model="gemini-2.5-flash-image",
#             contents=image_prompt,
#             config=genai_types.GenerateContentConfig(
#                 response_modalities=["IMAGE"],
#                 image_config=genai_types.ImageConfig(aspect_ratio="16:9"),
#             ),
#         )
#         # Extract the inline image bytes from the first IMAGE part
#         image_bytes = None
#         for part in response.parts:
#             if part.inline_data is not None:
#                 image_bytes = part.inline_data.data
#                 break

#         # ── Option B: Imagen 3 (higher fidelity) — swap comment blocks ──────
#         # response = gemini_client.models.generate_images(
#         #     model="imagen-3.0-generate-002",
#         #     prompt=image_prompt,
#         #     config=genai_types.GenerateImagesConfig(
#         #         number_of_images=1,
#         #         aspect_ratio="16:9",
#         #         output_mime_type="image/png",
#         #     ),
#         # )
#         # image_bytes = response.generated_images[0].image.image_bytes

#         if not image_bytes:
#             print("⚠️ Visual: მოდელმა სურათი ვერ დაბრუნა, ვიყენებთ default-ს.")
#             return DEFAULT_IMAGE

#         file_name = f"news_{int(time.time())}.png"
#         supabase.storage.from_("images").upload(
#             file_name,
#             image_bytes,
#             {"content-type": "image/png"},
#         )
#         return supabase.storage.from_("images").get_public_url(file_name)

#     except Exception as e:
#         print(f"⚠️ Visual Error: {e}")
#         return DEFAULT_IMAGE

def generate_visual(main_topic):
    """
    სატესტო რეჟიმი: Pollinations.ai
    არ სჭირდება API Key, არ აქვს ლიმიტი.
    """
    print(f"🎨 სატესტო გენერაცია: {main_topic}")
    
    # ვქმნით პრომტს და ვასუფთავებთ სიმბოლოებისგან
    clean_prompt = f"cyber-minimalist-digital-art-about-{main_topic.replace(' ', '-')}"
    image_url = f"https://image.pollinations.ai/prompt/{clean_prompt}?width=1024&height=576&nologo=true&model=flux"
    
    # იმისთვის რომ საიტზე ლინკი ყოველთვის მუშაობდეს, ჯობია გადმოვწეროთ და Supabase-ში ავტვირთოთ
    try:
        img_data = requests.get(image_url).content
        file_name = f"test_{int(time.time())}.png"
        
        supabase.storage.from_("images").upload(
            file_name, 
            img_data, 
            {"content-type": "image/png"}
        )
        return supabase.storage.from_("images").get_public_url(file_name)
    except Exception as e:
        print(f"⚠️ Storage Error: {e}")
        return image_url # თუ ვერ აიტვირთა, პირდაპირ Pollinations-ის ლინკი დააბრუნოს


# ── Main loop ─────────────────────────────────────────────────────────────────

def run_brain():
    print("🚀 Sulertia Media: Gemini + Groq System Active.")
    last_post_date = None

    while True:
        now = datetime.now(GEORGIA_TZ)
        today = now.date()

        if now.hour == 7 and now.minute < 5 and last_post_date != today: 
            print("⏰ ვიწყებ მუშაობას...")
            digest_list = gather_exactly_7()

            if len(digest_list) == 7:
                # ვიღებთ დინამიურ ტექსტს და ქულას
                content, dynamic_score = generate_digest_and_score(digest_list)
                image_url = generate_visual(digest_list[0]['title'])

                # პოსტის დაგეგმვა ხვალინდელი 07:00-ისთვის
                next_p = (now + timedelta(days=1)).replace(hour=7, minute=0, second=0, microsecond=0)

                try:
                    print("🔄 ბაზის განახლება...")
                    # ძველი პოსტების არქივაცია
                    supabase.table("posts").update({"is_current": False}).eq("is_current", True).execute()
                    
                    # ახალი პოსტის ჩაწერა
                    supabase.table("posts").insert({
                        "title": "Daily AI Report: 7 მთავარი მოვლენა",
                        "content": content,
                        "image_url": image_url,
                        "importance_score": dynamic_score, # ახლა უკვე დინამიურია!
                        "category": "Artificial Intelligence",
                        "is_current": True,
                        "next_post_at": next_p.isoformat()
                    }).execute()
                    
                    print(f"✅ პოსტი დაიდო! ქულა: {dynamic_score}")
                    last_post_date = today
                except Exception as e:
                    print(f"❌ Supabase Error: {e}")
            else:
                print(f"⚠️ ვერ შეგროვდა 7 ნიუსი (ნაპოვნია: {len(digest_list)})")
            
            time.sleep(600) 
        time.sleep(30)


if __name__ == "__main__":
    run_brain()
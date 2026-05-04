import "./globals.css";
import { supabase } from '@/lib/supabaseClient';
import { splitAtWordCount } from '@/lib/splitAtWordCount';
import { AdEditorial } from '@/components/AdBanner';


export default async function Page() {
  // 1. მონაცემების ავტომატური წამოღება Supabase-იდან
  // ვიღებთ პოსტს, რომელსაც აქვს is_current: true. 
  // თუ ასეთი არ მოიძებნა, fallback-ის სახით ვიღებთ უახლეს პოსტს.
  let { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('is_current', true)
    .maybeSingle();

  if (!post) {
    const { data: latestPost } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    post = latestPost;
  }

  // 2. თუ ბაზა ცარიელია, ვაჩვენებთ "Offline" სტატუსს
  if (error || !post) {
    return (
      <main className="min-h-screen bg-[#E8E4D9] flex items-center justify-center font-lora">
        <div className="text-center">
          <span className="w-3 h-3 bg-red-500 rounded-full inline-block animate-ping mb-4" />
          <p className="opacity-50 tracking-[3px] uppercase text-[10px]">
            Waiting for AI Agent to select a post...
          </p>
        </div>
      </main>
    );
  }

  // 3. ტექსტის გაყოფა word count-ის მიხედვით
  const { before, after } = splitAtWordCount(post.content || '', 200);

  // 4. თარიღის დინამიური ფორმატირება
  const formattedDate = post.created_at 
    ? new Date(post.created_at).toLocaleDateString('en-US', { 
        month: 'long', day: 'numeric', year: 'numeric' 
      })
    : "April 29, 2026";

  return (
    <main className="min-h-screen bg-[#E8E4D9] flex flex-col font-lora">
      {/* HEADER */}
      <header className="sticky top-0 left-0 right-0 z-50 flex justify-center bg-[#E8E4D9]/95 backdrop-blur-sm border-b border-black/5">
        <div className="w-full max-w-5xl flex justify-between items-center px-8 py-5">
          <div className="font-playfair font-bold text-lg tracking-tight text-[#1a1f3c]">
            SULERTIA
            <span className="text-[9px] font-lora font-normal tracking-[3px] uppercase opacity-40 ml-1 align-super">
              MEDIA
            </span>
          </div>
          <nav className="flex items-center gap-8 text-[9px] tracking-[2px] uppercase text-[#1a1f3c] opacity-60">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              AI Scanning
            </div>
            <button>History Vault</button>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <div className="flex justify-center px-4">
        <article className="max-w-3xl w-full border-l-[3px] border-[#C4521A] relative overflow-hidden shadow-sm">
          {post.image_url && (
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-[520px] object-cover opacity-90"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1f3c] via-[#1a1f3c]/60 to-transparent flex flex-col justify-end px-10 pb-8">
            <div className="flex items-center gap-3 mb-5">
              <span className="bg-[#FAECE7] text-[#993C1D] text-[9px] tracking-[2px] uppercase px-2 py-1 font-bold">
                {post.category || 'Science & Technology'}
              </span>
              <span className="text-[9px] text-white/45 uppercase tracking-widest">
                {formattedDate} · AI Score: {post.importance_score || '9.4'}
              </span>
            </div>

            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-[#F5F0E8] leading-[1.1] mb-6">
              {post.title}
            </h1>
          </div>
        </article>
      </div>

      {/* ARTICLE BODY */}
      <div className="flex justify-center px-4">
        <div className="max-w-3xl w-full bg-[#1a1f3c] border-l-[3px] border-[#C4521A] px-10 py-12">
          <p className="text-[9px] tracking-[3px] uppercase text-[#E8A87C] opacity-60 mb-3">
            Full Story
          </p>
          <div className="border-t border-[#E8A87C]/20 mb-8" />
          
          <div className="text-base text-[#F5F0E8]/80 leading-[1.9] space-y-6">
            <p className="first-letter:text-4xl first-letter:font-bold first-letter:mr-2 first-letter:float-left">
              {before.trim()}
            </p>

            {after && (
              <>
                <div className="py-6"><AdEditorial /></div>
                <p>{after.trim()}</p>
              </>
            )}
          </div>

          <div className="border-t border-[#E8A87C]/15 mt-12 pt-6 flex justify-between items-center text-[9px] uppercase tracking-[2px] text-white/20">
            <span>Verified via Sulertia Protocol</span>
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="mt-16 mb-10 flex items-center justify-center gap-4">
        <div className="w-16 h-px bg-[#C4521A] opacity-30" />
        <span className="text-[9px] tracking-[3px] uppercase text-[#1a1f3c] opacity-25">
          Analysing Breaking Stories
        </span>
        <div className="w-16 h-px bg-[#C4521A] opacity-30" />
      </footer>
    </main>
  );
}

const checkConnection = async () => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .limit(1);

  if (error) {
    console.error("❌ კავშირის შეცდომა:", error.message);
  } else {
    console.log("✅ კავშირი წარმატებულია! მონაცემები:", data);
  }
};
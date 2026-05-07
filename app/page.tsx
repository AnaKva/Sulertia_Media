<<<<<<< HEAD
import Link from "next/link";
import DelayedRobot from "@/components/DelayedRobot";
=======
import WalkingRobot from "@/components/WalkingRobot";
import SiteHeader from "@/components/SiteHeader";
>>>>>>> b6d1d4854f11613c1384ad3720a8f44f67b0daa3
import { supabase } from "@/lib/supabaseClient";
import { AdEditorial } from "@/components/AdBanner";
import TypewriterStory from "@/components/TypewriterStory";
import { getDailyImage } from "@/lib/getDailyImage";
import { getLang, t } from "@/lib/i18n";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ lang?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const lang = getLang(resolvedSearchParams?.lang);
  const text = t[lang];

  let { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("is_current", true)
    .maybeSingle();

  if (!post) {
    const { data: latestPost } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    post = latestPost;
  }

  if (error || !post) {
    return (
      <>
        <SiteHeader lang={lang} />

        <main className="offline-page">
          <div className="offline-box">
            <span className="offline-dot" />
            <p>{text.waiting}</p>
          </div>
        </main>
      </>
    );
  }

  const postTitle =
    lang === "en" ? post.title_en || post.title : post.title;

  const postContent =
    lang === "en" ? post.content_en || post.content : post.content;

  const postCategory =
    lang === "en"
      ? post.category_en || post.category || text.categoryFallback
      : post.category || text.categoryFallback;

  const formattedDate = new Date().toLocaleDateString(
    lang === "ka" ? "ka-GE" : "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  const storyItems =
    (postContent || "")
      .match(/\d+\.\s[\s\S]*?(?=(?:\s+\d+\.\s)|$)/g)
      ?.map((item: string) => item.replace(/^\d+\.\s*/, "").trim()) || [];

  return (
    <>
      <SiteHeader lang={lang} />

      <main className="page">
        <section className="content-shell">
          <article className="article-card">
            <div className="hero">
              <img src={getDailyImage()} alt={postTitle} />

              <div className="hero-overlay" />

              <div className="hero-content">
                <div className="meta-row">
                  <span className="category">{postCategory}</span>

                  <span className="date-score">
                    {formattedDate} · {text.score}:{" "}
                    {post.importance_score || "8.5"}
                  </span>
                </div>

                <h1>{postTitle}</h1>
              </div>
            </div>

            <div className="article-body">
              <div className="story-text">
                {storyItems.length > 0 ? (
                  <TypewriterStory items={storyItems} />
                ) : (
                  <p>{postContent}</p>
                )}
              </div>

              <div className="ad-wrap">
                <AdEditorial />
              </div>

<<<<<<< HEAD
      <DelayedRobot />
    </main>
=======
              <footer>
                <div className="article-footer">
                  <span>{text.verified}</span>
                  <span>{formattedDate}</span>
                </div>
              </footer>
            </div>
          </article>
        </section>

        <WalkingRobot />
      </main>
    </>
>>>>>>> b6d1d4854f11613c1384ad3720a8f44f67b0daa3
  );
}
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import FacebookShareButton from "@/components/FacebookShareButton";
import { supabase } from "@/lib/supabaseClient";
import { getDailyImageForDate } from "@/lib/getDailyImage";
import { getLang, t } from "@/lib/i18n";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ lang?: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const lang = getLang(resolvedSearchParams?.lang);

  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!post) {
    return {
      title: "Post Not Found | Sulertia Media",
      description: "This Sulertia Media archive post could not be found.",
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const postTitle = lang === "en" ? post.title_en || post.title : post.title;

  const postContent =
    lang === "en" ? post.content_en || post.content : post.content;

  const image = `https://sulertia.media${getDailyImageForDate(
    post.created_at
  )}`;

  const description =
    typeof postContent === "string"
      ? postContent.replace(/\n/g, " ").slice(0, 155)
      : "Archived AI report from Sulertia Media.";

  return {
    title: `${postTitle} | Sulertia Media`,
    description,
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${postTitle} | Sulertia Media`,
      description,
      type: "article",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: postTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${postTitle} | Sulertia Media`,
      description,
      images: [image],
    },
  };
}

export default async function HistoryDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ lang?: string }>;
}) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const lang = getLang(resolvedSearchParams?.lang);
  const text = t[lang];

  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !post) {
    notFound();
  }

  const postTitle = lang === "en" ? post.title_en || post.title : post.title;

  const postContent =
    lang === "en" ? post.content_en || post.content : post.content;

  const postCategory =
    lang === "en"
      ? post.category_en || post.category || text.categoryFallback
      : post.category || text.categoryFallback;

  const formattedDate = post.created_at
    ? new Date(post.created_at).toLocaleDateString(
        lang === "ka" ? "ka-GE" : "en-US",
        {
          month: "short",
          day: "numeric",
          year: "numeric",
        }
      )
    : "Unknown date";

  const image = getDailyImageForDate(post.created_at);

  const storyItems =
    (postContent || "")
      .match(/\d+\.\s[\s\S]*?(?=(?:\s+\d+\.\s)|$)/g)
      ?.map((item: string) => item.trim()) || [];

  return (
    <>
      <SiteHeader lang={lang} />

      <main className="page">
        <section className="content-shell">
          <article className="article-card">
            <div className="hero">
              <img src={image} alt={postTitle} />

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

          <div className="hero-facebook-share">
            <FacebookShareButton
              url={`https://sulertia.media/history/${post.id}?lang=${lang}`}
              label={
                lang === "ka"
                  ? "Facebook-ზე გაზიარება"
                  : "Share on Facebook"
              }
            />
          </div>
              </div>
            </div>

            <div className="article-body">
              <div className="story-text numbered-story">
                {storyItems.length > 0 ? (
                  storyItems.map((item: string, index: number) => {
                    const cleanText = item.replace(/^\d+\.\s*/, "").trim();

                    return (
                      <div className="numbered-row" key={index}>
                        <span className="numbered-index">{index + 1}.</span>
                        <span className="numbered-content">{cleanText}</span>
                      </div>
                    );
                  })
                ) : (
                  <p>{postContent}</p>
                )}
              </div>

              <div className="share-row">
                <FacebookShareButton
                  url={`https://sulertia.media/history/${post.id}?lang=${lang}`}
                  label={
                    lang === "ka"
                      ? "Facebook-ზე გაზიარება"
                      : "Share on Facebook"
                  }
                />
              </div>

              <div className="history-detail-actions">
                <Link href={`/history?lang=${lang}`}>{text.backToHistory}</Link>
              </div>

              <footer>
                <div className="article-footer">
                  <span>{text.archived}</span>
                  <span>{formattedDate}</span>
                </div>
              </footer>
            </div>
          </article>
        </section>
      </main>
    </>
  );
}
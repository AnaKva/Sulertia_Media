import WalkingRobot from "@/components/WalkingRobot";
import { supabase } from "@/lib/supabaseClient";
import { AdEditorial } from "@/components/AdBanner";

export default async function Page() {
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
      <main className="offline-page">
        <div className="offline-box">
          <span className="offline-dot" />
          <p>Waiting for AI Agent to select a post...</p>
        </div>
      </main>
    );
  }

  const formattedDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const storyItems =
    (post.content || "")
      .match(/\d+\.\s[\s\S]*?(?=(?:\s+\d+\.\s)|$)/g)
      ?.map((item: string) => item.trim()) || [];

  return (
    <main className="page">
      <header className="top-header">
        <div className="top-header-inner">
          <div className="logo">
            SULERTIA
            <span>MEDIA</span>
          </div>

          <nav className="nav">
            <div className="scan-status">
              <span />
              AI Scanning
            </div>
            <button>History Vault</button>
          </nav>
        </div>
      </header>

      <section className="content-shell">
        <article className="article-card">
          <div className="hero">
            {post.image_url && <img src={post.image_url} alt={post.title} />}

            <div className="hero-overlay" />

            <div className="hero-content">
              <div className="meta-row">
                <span className="category">
                  {post.category || "Artificial Intelligence"}
                </span>

                <span className="date-score">
                  {formattedDate} · AI Score: {post.importance_score || "8.5"}
                </span>
              </div>

              <h1>{post.title}</h1>
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
                <p>{post.content}</p>
              )}
            </div>

            <div className="ad-wrap">
              <AdEditorial />
            </div>

            <footer>
              <div className="article-footer">
                <span>Verified via Sulertia Protocol</span>
                <span>{formattedDate}</span>
              </div>
            </footer>

          </div>
        </article>
      </section>
      <WalkingRobot />
    </main>
  );
}
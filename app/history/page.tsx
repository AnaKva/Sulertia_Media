import Link from "next/link";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabaseClient";
import HistorySearch from "@/components/HistorySearch";
import LanguageSwitch from "@/components/LanguageSwitch";
import { getLang, t } from "@/lib/i18n";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "History Vault | Sulertia Media",
  description: "Browse and search previous Sulertia Media daily AI reports.",
  robots: {
    index: true,
    follow: true,
  },
};

export default async function HistoryPage({
  searchParams,
}: {
  searchParams?: Promise<{ lang?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const lang = getLang(resolvedSearchParams?.lang);
  const text = t[lang];

  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return (
      <main className="history-page">
        <header className="top-header">
          <div className="top-header-inner">
            <Link href={`/?lang=${lang}`} className="logo-link">
              <div className="logo">
                SULERTIA
                <span>MEDIA</span>
              </div>
            </Link>

            <nav className="nav">
              <Link href={`/?lang=${lang}`} className="nav-link">
                {text.aiScanning}
              </Link>

              <Link href={`/history?lang=${lang}`} className="nav-link">
                {text.historyVault}
              </Link>

              <LanguageSwitch lang={lang} />
            </nav>
          </div>
        </header>

        <section className="history-shell">
          <h1>{text.historyTitle}</h1>
          <p className="history-error">Could not load archived posts.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="history-page">
      <header className="top-header">
        <div className="top-header-inner">
          <Link href={`/?lang=${lang}`} className="logo-link">
            <div className="logo">
              SULERTIA
              <span>MEDIA</span>
            </div>
          </Link>

          <nav className="nav">
            <Link href={`/?lang=${lang}`} className="nav-link">
              {text.aiScanning}
            </Link>

            <Link href={`/history?lang=${lang}`} className="nav-link">
              {text.historyVault}
            </Link>

            <LanguageSwitch lang={lang} />
          </nav>
        </div>
      </header>

      <section className="history-shell">
        <div className="history-heading">
          <p>Archived Intelligence</p>
          <h1>{text.historyTitle}</h1>
          <span>{text.historySubtitle}</span>
        </div>

        <HistorySearch posts={posts || []} lang={lang} />
      </section>
    </main>
  );
}
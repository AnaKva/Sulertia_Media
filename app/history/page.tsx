import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import HistorySearch from "@/components/HistorySearch";
import { supabase } from "@/lib/supabaseClient";
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

  return (
    <>
      <SiteHeader lang={lang} />

      <main className="history-page">
        <section className="history-shell">
          <div className="history-heading">
            <p>Archived Intelligence</p>
            <h1>{text.historyTitle}</h1>
            <span>{text.historySubtitle}</span>
          </div>

          {error ? (
            <p className="history-error">Could not load archived posts.</p>
          ) : (
            <HistorySearch posts={posts || []} lang={lang} />
          )}
        </section>
      </main>
    </>
  );
}
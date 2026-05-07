import WalkingRobot from "@/components/WalkingRobot";
import SiteHeader from "@/components/SiteHeader";
import { getLang, t } from "@/lib/i18n";

export default async function AboutPage({
  searchParams,
}: {
  searchParams?: Promise<{ lang?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const lang = getLang(resolvedSearchParams?.lang);
  const text = t[lang];
  const content = text.aboutPage;

  return (
    <>
      <SiteHeader lang={lang} />

      <main className="page">
        <section className="content-shell">
          <article className="about-card">
            <div className="about-banner">
              <div className="about-banner-label">{content.founded}</div>
              <h1 className="about-title">{content.title}</h1>
              <p className="about-subtitle">{content.subtitle}</p>
              <div className="about-banner-line" />
            </div>

            <section className="about-section">
              <span className="about-section-tag">{content.missionTag}</span>
              <p className="about-body">{content.mission}</p>
            </section>

            <div className="about-divider" />

            <section className="about-section">
              <span className="about-section-tag">{content.howTag}</span>

              <div className="about-steps">
                {content.steps.map((step) => (
                  <div className="about-step" key={step.n}>
                    <span className="about-step-n">{step.n}</span>

                    <div>
                      <h2 className="about-step-title">{step.title}</h2>
                      <p className="about-step-body">{step.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="about-divider" />

            <section className="about-section">
              <span className="about-section-tag">{content.statsTag}</span>

              <div className="about-stats">
                {content.stats.map((stat) => (
                  <div className="about-stat" key={stat.label}>
                    <div className="about-stat-value">{stat.value}</div>
                    <div className="about-stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </section>

            <div className="about-divider" />

            <section className="about-section">
              <span className="about-section-tag">{content.teamTag}</span>
              <p className="about-body">{content.team}</p>
            </section>

            <footer className="about-footer-row">
              <span>{content.footer}</span>
              <span>sulertia.media</span>
            </footer>
          </article>
        </section>

        <WalkingRobot />
      </main>
    </>
  );
}
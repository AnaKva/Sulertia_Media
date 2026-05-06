import Link from "next/link";
import WalkingRobot from "@/components/WalkingRobot";
import LanguageSwitch from "@/components/LanguageSwitch";
import { getLang, t } from "@/lib/i18n";

export default async function AboutPage({
  searchParams,
}: {
  searchParams?: Promise<{ lang?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const lang = getLang(resolvedSearchParams?.lang);
  const text = t[lang];

  const content = {
    ka: {
      founded: "დაარსდა 2026 წელს",
      title: "სულერთია მედიის შესახებ",
      subtitle:
        "Sulertia Media არ არის მორიგი საინფორმაციო პლატფორმა. ეს არის ექსპერიმენტი მინიმალისტურ მედიასა და ხელოვნურ ინტელექტში.",
      missionTag: "ჩვენი მისია",
      mission:
        "დღეს ინტერნეტი გადატვირთულია უაზრო ინფორმაციით, სადაც მნიშვნელოვანი ამბები წამებში იკარგება მათ ნაკადში. ჩვენი გადაწყვეტილება რადიკალურია: ერთი საიტი — ერთი პოსტი.",
      howTag: "როგორ მუშაობს",
      statsTag: "რიცხვებში",
      teamTag: "გუნდი",
      team:
        "ჩვენ ვართ სტუდენტების ჯგუფი, რომლებსაც გვჯერა, რომ ინფორმაციულ ეპოქაში მთავარი პრობლემა არა ინფორმაციის ნაკლებობა, არამედ მისი ზედმეტობაა. ჩვენი გუნდი აერთიანებს კრეატიულ ხედვასა და ტექნოლოგიურ ინტერესებს, რათა შევქმნათ ციფრული გამოცდილება, რომელიც მომხმარებელს გაუთავებელი სქროლვისგან დაიცავს.",
      home: "მთავარი",
      footer: "დამოწმებულია სულერთია პროტოკოლით",
      steps: [
        {
          n: "01",
          title: "ფილტრავს",
          body: "AI აგენტი ათასობით ამბიდან ირჩევს მხოლოდ ყველაზე მნიშვნელოვანს.",
        },
        {
          n: "02",
          title: "აფასებს",
          body: "ვირჩევთ მხოლოდ ყველაზე აქტუალურ პოსტს. როგორც კი AI აგენტი აღმოაჩენს უფრო მაღალი პრიორიტეტის ინფორმაციას, ძველი პოსტი ადგილს ახალს უთმობს შემდეგ დღესვე.",
        },
        {
          n: "03",
          title: "აკონცენტრირებს",
          body: "ჩვენ ვაიძულებთ მომხმარებელს, კონცენტრირდეს მხოლოდ იმაზე, რაც მოცემულ მომენტში მართლაც ღირებულია.",
        },
        {
          n: "04",
          title: "აქვეყნებს",
          body: "ყოველ დილას 7:00 საათზე ბრიფინგი გამოქვეყნდება — ერთი სიახლე, არაფერი მეტი.",
        },
      ],
      stats: [
        { value: "7:00", label: "გამოქვეყნების დრო" },
        { value: "7", label: "პუნქტი ბრიფინგში" },
        { value: "1", label: "სიახლე დღეში" },
        { value: "100%", label: "AI კურირებული" },
      ],
    },
    en: {
      founded: "Founded in 2026",
      title: "About Sulertia Media",
      subtitle:
        "Sulertia Media is not another ordinary news platform. It is an experiment in minimalist media and artificial intelligence.",
      missionTag: "Our Mission",
      mission:
        "Today, the internet is overloaded with meaningless information, where important stories disappear in seconds. Our solution is radical: one site — one post.",
      howTag: "How It Works",
      statsTag: "In Numbers",
      teamTag: "Team",
      team:
        "We are a group of students who believe that in the information age, the main problem is not the lack of information, but too much of it. Our team combines creative vision and technological curiosity to create a digital experience that protects users from endless scrolling.",
      home: "Home",
      footer: "Verified via Sulertia Protocol",
      steps: [
        {
          n: "01",
          title: "Filters",
          body: "The AI agent scans many stories and selects only the most important ones.",
        },
        {
          n: "02",
          title: "Evaluates",
          body: "We choose only the most relevant post. When the AI agent finds higher-priority information, the old post gives way to the new one the next day.",
        },
        {
          n: "03",
          title: "Focuses",
          body: "We make the user focus only on what is truly valuable in the current moment.",
        },
        {
          n: "04",
          title: "Publishes",
          body: "Every morning at 7:00, a briefing is published — one story, nothing more.",
        },
      ],
      stats: [
        { value: "7:00", label: "Publishing time" },
        { value: "7", label: "Briefing points" },
        { value: "1", label: "Story per day" },
        { value: "100%", label: "AI curated" },
      ],
    },
  }[lang];

  return (
    <main className="page">
      <header className="top-header">
        <div className="top-header-inner">
          <Link href={`/?lang=${lang}`} className="logo-link">
            <div className="logo">
              SULERTIA
              <span>MEDIA</span>
            </div>
          </Link>

          <nav className="nav">
            <div className="scan-status">
              <span />
              {text.aiScanning}
            </div>

            <Link href={`/?lang=${lang}`} className="nav-link">
              {content.home}
            </Link>

            <Link href={`/history?lang=${lang}`} className="nav-link">
              {text.historyVault}
            </Link>

            <LanguageSwitch lang={lang} />
          </nav>
        </div>
      </header>

      <section className="content-shell">
        <div className="about-card">
          <div className="about-banner">
            <div className="about-banner-label">{content.founded}</div>
            <h1 className="about-title">{content.title}</h1>
            <p className="about-subtitle">{content.subtitle}</p>
            <div className="about-banner-line" />
          </div>

          <div className="about-section">
            <span className="about-section-tag">{content.missionTag}</span>
            <p className="about-body">{content.mission}</p>
          </div>

          <div className="about-divider" />

          <div className="about-section">
            <span className="about-section-tag">{content.howTag}</span>
            <div className="about-steps">
              {content.steps.map((s) => (
                <div className="about-step" key={s.n}>
                  <span className="about-step-n">{s.n}</span>
                  <div>
                    <div className="about-step-title">{s.title}</div>
                    <div className="about-step-body">{s.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="about-divider" />

          <div className="about-section">
            <span className="about-section-tag">{content.statsTag}</span>
            <div className="about-stats">
              {content.stats.map((s) => (
                <div className="about-stat" key={s.label}>
                  <div className="about-stat-value">{s.value}</div>
                  <div className="about-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="about-divider" />

          <div className="about-section">
            <span className="about-section-tag">{content.teamTag}</span>
            <p className="about-body">{content.team}</p>
          </div>

          <div className="about-footer-row">
            <span>{content.footer}</span>
            <span>sulertia.media</span>
          </div>
        </div>
      </section>

      <WalkingRobot />
    </main>
  );
}
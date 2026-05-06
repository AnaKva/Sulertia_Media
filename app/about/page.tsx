import WalkingRobot from "@/components/WalkingRobot";

export default function AboutPage() {
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
              AI სკანირება
            </div>
            <a href="/" className="nav-link">მთავარი</a>
          </nav>
        </div>
      </header>

      <section className="content-shell">
        <div className="about-card">

          {/* ── Top banner ── */}
          <div className="about-banner">
            <div className="about-banner-label">დაარსდა 2026 წელს</div>
            <h1 className="about-title">სულერთია მედიის შესახებ</h1>
            <p className="about-subtitle">
              Sulertia Media არ არის მორიგი საინფორმაციო პლატფორმა. ეს არის ექსპერიმენტი მინიმალისტურ მედიასა და ხელოვნურ ინტელექტში.

            </p>
            <div className="about-banner-line" />
          </div>

          {/* ── Mission ── */}
          <div className="about-section">
            <span className="about-section-tag">ჩვენი მისია</span>
            <p className="about-body">
              დღეს ინტერნეტი გადატვირთულია უაზრო ინფორმაციით, სადაც მნიშვნელოვანი ამბები წამებში
იკარგება მათ ნაკადში. ჩვენი გადაწყვეტილება რადიკალურია: ერთი საიტი — ერთი პოსტი.
            </p>
          </div>

          <div className="about-divider" />

          {/* ── How it works ── */}
          <div className="about-section">
            <span className="about-section-tag">როგორ მუშაობს</span>
            <div className="about-steps">
              {[
                { n: "01", title: "ფილტრავს", body: "AI აგენტი ათასობით ამბიდან ირჩევს მხოლოდ ყველაზე მნიშვნელოვანს." },
                { n: "02", title: "აფასებს", body: "ვირჩევთ მხოლოდ ყველაზე აქტუალური პოსტია. როგორც კი AI აგენტი აღმოაჩენს უფრო მაღალი პრიორიტეტის ინფორმაციას, ძველი პოსტი ადგილს ახალს უთმობს შემდეგ დღესვე." },
                { n: "03", title: "აკონცენტრირებს", body: " ჩვენ ვაიძულებთ მომხმარებელს, კონცენტრირდეს მხოლოდ იმაზე, რაც მოცემულ მომენტში მართლაც ღირებულია." },
                { n: "04", title: "აქვეყნებს", body: "ყოველ დილას 7:00 საათზე ბრიფინგი გამოქვეყნდება — ერთი სიახლე, არაფერი მეტი." },
              ].map((s) => (
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

          {/* ── Stats ── */}
          <div className="about-section">
            <span className="about-section-tag">რიცხვებში</span>
            <div className="about-stats">
              {[
                { value: "7:00", label: "გამოქვეყნების დრო" },
                { value: "7", label: "პუნქტი ბრიფინგში" },
                { value: "1", label: "სიახლე დღეში" },
                { value: "100%", label: "AI კურირებული" },
              ].map((s) => (
                <div className="about-stat" key={s.label}>
                  <div className="about-stat-value">{s.value}</div>
                  <div className="about-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="about-divider" />

          {/* ── Team ── */}
          <div className="about-section">
            <span className="about-section-tag">გუნდი</span>
            <p className="about-body">
             ჩვენ ვართ სტუდენტების ჯგუფი, რომლებსაც გვჯერა, რომ ინფორმაციულ ეპოქაში მთავარი პრობლემა
არა ინფორმაციის ნაკლებობა, არამედ მისი ზედმეტობაა. ჩვენი გუნდი აერთიანებს კრეატიულ ხედვასა
და ტექნოლოგიურ ინტერესებს, რათა შევქმნათ ციფრული გამოცდილება, რომელიც მომხმარებელს
გაუთავებელი სქროლვისგან დაიცავს.
            </p>
          </div>

          {/* ── Footer ── */}
          <div className="about-footer-row">
            <span>დამოწმებულია სულერთია პროტოკოლით</span>
            <span>sulertia.media</span>
          </div>

        </div>
      </section>

      <WalkingRobot />
    </main>
  );
}
export type Lang = "ka" | "en";

export function getLang(value?: string | null): Lang {
  return value === "en" ? "en" : "ka";
}

export const t = {
  ka: {
    home: "მთავარი",
    about: "შესახებ",
    aiScanning: "AI სკანირება",
    historyVault: "ისტორია",
    verified: "დადასტურებულია Sulertia Protocol-ით",
    archived: "დაარქივებულია Sulertia Protocol-ით",
    waiting: "ველოდებით AI აგენტის მიერ პოსტის არჩევას...",
    categoryFallback: "ხელოვნური ინტელექტი",
    score: "AI ქულა",
    historyTitle: "ისტორიის საცავი",
    historySubtitle: "Sulertia Media-ს წინა ყოველდღიური AI ანგარიშები.",
    searchPlaceholder: "მოძებნე ანგარიშები, თემები, თარიღები...",
    noReports: "ანგარიშები ვერ მოიძებნა",
    backToHistory: "← ისტორიაში დაბრუნება",
    current: "მიმდინარე",
    results: "შედეგი",

    aboutPage: {
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
  },

  en: {
    home: "Home",
    about: "About",
    aiScanning: "AI Scanning",
    historyVault: "History Vault",
    verified: "Verified via Sulertia Protocol",
    archived: "Archived via Sulertia Protocol",
    waiting: "Waiting for AI Agent to select a post...",
    categoryFallback: "Artificial Intelligence",
    score: "AI Score",
    historyTitle: "History Vault",
    historySubtitle: "Previous Sulertia Media daily AI reports.",
    searchPlaceholder: "Search reports, topics, dates...",
    noReports: "No reports found",
    backToHistory: "← Back to History Vault",
    current: "Current",
    results: "results",

    aboutPage: {
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
  },
};
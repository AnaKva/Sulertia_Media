export type Lang = "ka" | "en";

export function getLang(value?: string | null): Lang {
  return value === "en" ? "en" : "ka";
}

export const t = {
  ka: {
    aiScanning: "AI სკანირება",
    historyVault: "არქივი",
    verified: "დადასტურებულია Sulertia Protocol-ით",
    archived: "დაარქივებულია Sulertia Protocol-ით",
    waiting: "ველოდებით AI აგენტის მიერ პოსტის არჩევას...",
    categoryFallback: "ხელოვნური ინტელექტი",
    score: "AI ქულა",
    historyTitle: "არქივი",
    historySubtitle: "Sulertia Media-ს წინა ყოველდღიური AI ანგარიშები.",
    searchPlaceholder: "მოძებნე ანგარიშები, თემები, თარიღები...",
    noReports: "ანგარიშები ვერ მოიძებნა",
    backToHistory: "← არქივში დაბრუნება",
    current: "მიმდინარე",
    results: "შედეგი",
  },
  en: {
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
  },
};
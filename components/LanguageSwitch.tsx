import Link from "next/link";
import type { Lang } from "@/lib/i18n";

export default function LanguageSwitch({ lang }: { lang: Lang }) {
  return (
    <div className="language-switch">
      <Link
        href="?lang=ka"
        className={lang === "ka" ? "language-active" : ""}
      >
        KA
      </Link>

      <span>/</span>

      <Link
        href="?lang=en"
        className={lang === "en" ? "language-active" : ""}
      >
        EN
      </Link>
    </div>
  );
}
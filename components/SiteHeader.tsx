import Link from "next/link";
import LanguageSwitch from "@/components/LanguageSwitch";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";

type SiteHeaderProps = {
  lang: Lang;
};

export default function SiteHeader({ lang }: SiteHeaderProps) {
  const text = t[lang];

  return (
    <header className="top-header">
      <div className="top-header-inner">
        <Link href={`/?lang=${lang}`} className="logo-link" aria-label="Sulertia Media home">
          <div className="logo">
            SULERTIA
            <span>MEDIA</span>
          </div>
        </Link>

        <nav className="nav" aria-label="Main navigation">
          <Link href={`/?lang=${lang}`} className="nav-link">
            {text.home}
          </Link>

          <Link href={`/about?lang=${lang}`} className="nav-link">
            {text.about}
          </Link>

          <Link href={`/history?lang=${lang}`} className="nav-link">
            {text.historyVault}
          </Link>

          <LanguageSwitch lang={lang} />
        </nav>
      </div>
    </header>
  );
}
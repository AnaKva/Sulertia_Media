"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getDailyImageForDate } from "@/lib/getDailyImage";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";

type HistoryPost = {
  id: string;
  title: string;
  title_en?: string | null;
  content: string | null;
  content_en?: string | null;
  category: string | null;
  category_en?: string | null;
  created_at: string | null;
  importance_score: number | null;
  is_current: boolean | null;
};

const MONTHS = {
  en: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  ka: [
    "იან.",
    "თებ.",
    "მარ.",
    "აპრ.",
    "მაი.",
    "ივნ.",
    "ივლ.",
    "აგვ.",
    "სექ.",
    "ოქტ.",
    "ნოე.",
    "დეკ.",
  ],
};

function formatPostDate(dateValue: string | null, lang: Lang) {
  if (!dateValue) return "Unknown date";

  const dateOnly = dateValue.slice(0, 10);
  const [year, month, day] = dateOnly.split("-");

  if (!year || !month || !day) return "Unknown date";

  const monthIndex = Number(month) - 1;
  const dayNumber = Number(day);

  if (Number.isNaN(monthIndex) || Number.isNaN(dayNumber)) {
    return "Unknown date";
  }

  if (lang === "ka") {
    return `${dayNumber} ${MONTHS.ka[monthIndex]} ${year}`;
  }

  return `${MONTHS.en[monthIndex]} ${dayNumber}, ${year}`;
}

export default function HistorySearch({
  posts,
  lang,
}: {
  posts: HistoryPost[];
  lang: Lang;
}) {
  const [query, setQuery] = useState("");
  const text = t[lang];

  const filteredPosts = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) {
      return posts;
    }

    return posts.filter((post) => {
      const title = lang === "en" ? post.title_en || post.title : post.title;

      const content =
        lang === "en" ? post.content_en || post.content : post.content;

      const category =
        lang === "en" ? post.category_en || post.category : post.category;

      const formattedDate = formatPostDate(post.created_at, lang);

      const searchableText = [
        title,
        content,
        category,
        formattedDate,
        post.importance_score?.toString(),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(search);
    });
  }, [posts, query, lang]);

  return (
    <>
      <div className="history-search-wrap">
        <input
          className="history-search-input"
          type="search"
          placeholder={text.searchPlaceholder}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        <p className="history-search-count">
          {filteredPosts.length} {text.results}
        </p>
      </div>

      <div className="history-list">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => {
            const postTitle =
              lang === "en" ? post.title_en || post.title : post.title;

            const postContent =
              lang === "en" ? post.content_en || post.content : post.content;

            const postCategory =
              lang === "en"
                ? post.category_en || post.category || text.categoryFallback
                : post.category || text.categoryFallback;

            const formattedDate = formatPostDate(post.created_at, lang);

            const preview =
              typeof postContent === "string"
                ? postContent.replace(/\n/g, " ").slice(0, 180)
                : "";

            const thumbnail = getDailyImageForDate(post.created_at);

            return (
              <Link
                href={`/history/${post.id}?lang=${lang}`}
                className="history-card-link"
                key={post.id}
              >
                <article className="history-card history-card-with-thumb">
                  <div className="history-thumb">
                    <img src={thumbnail} alt={postTitle} />
                  </div>

                  <div className="history-card-content">
                    <div className="history-card-top">
                      <span>{postCategory}</span>
                      <span>{formattedDate}</span>
                    </div>

                    <h2>{postTitle}</h2>

                    <p>{preview}...</p>

                    <div className="history-card-bottom">
                      <span>
                        {text.score}: {post.importance_score || "8.5"}
                      </span>

                      {post.is_current && <strong>{text.current}</strong>}
                    </div>
                  </div>
                </article>
              </Link>
            );
          })
        ) : (
          <p className="history-empty">
            {text.noReports} “{query}”.
          </p>
        )}
      </div>
    </>
  );
}
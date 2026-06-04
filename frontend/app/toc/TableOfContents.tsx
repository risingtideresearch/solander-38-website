"use client";

import { BiCollapseAlt, BiExpandAlt } from "react-icons/bi";
import styles from "./toc.module.scss";
import React, { createContext, useLayoutEffect, useState } from "react";
import { URLS } from "../components/Navigation/Navigation";

interface TOCArticle {
  relatedModels: string[];
  _id: string;
  slug: string;
  title: string;
}

interface TOCSystem {
  slug: string;
  name: string;
  articles?: TOCArticle[];
}

export const TOCContext = createContext<{
  system: TOCSystem;
  article: TOCArticle | null;
}>({
  system: { slug: "overview", name: "" },
  article: null,
});

export default function TableOfContents({
  children,
  systems,
  defaultSystem = "",
  defaultArticle = null,
  hide = false,
  showArticles = true,
}: {
  children?: React.ReactNode;
  systems: TOCSystem[];
  defaultSystem?: string;
  defaultArticle?: TOCArticle | null;
  hide?: boolean;
  showArticles?: boolean;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [system, setSystem] = useState(
    systems.find((system) => system.slug == defaultSystem) || systems[0],
  );
  const [article, setArticle] = useState<TOCArticle | null>(defaultArticle);

  useLayoutEffect(() => {
    setCollapsed(window.innerWidth < 800);
    setMounted(true);
  }, []);

  return (
    <TOCContext.Provider value={{ system, article }}>
      <nav
        aria-label="Table of contents"
        className={`${styles.toc__container} pane ${styles.outline} ${collapsed ? styles.collapsed : ""}`}
        data-mounted={mounted}
      >
        <button
          className={styles.toc__collapse_button}
          onClick={() => setCollapsed((prev) => !prev)}
          aria-expanded={!collapsed}
          aria-label={
            collapsed
              ? "Expand table of contents"
              : "Collapse table of contents"
          }
        >
          {collapsed ? (
            <>
              <span className={styles.toc__label}>
                {system.name}
                {article ? (
                  <span style={{ textTransform: "none" }}>
                    <br />
                    / {article?.title}
                  </span>
                ) : (
                  ""
                )}
              </span>
              <BiExpandAlt size={16} />
            </>
          ) : (
            <BiCollapseAlt size={16} />
          )}
        </button>
        {!collapsed ? (
          <div
            className={`toc ${styles.toc}`}
            style={{ display: hide ? "none" : "" }}
          >
            <ol>
              {systems.map((s, i) => (
                <li key={s.slug} data-selected={s.slug == system.slug}>
                  <button
                    onClick={() => {
                      setSystem(s);
                      setArticle(null);
                    }}
                    aria-pressed={s.slug == system.slug}
                  >
                    <span>{i+ 1}.</span> {s.name}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        ) : null}

        {showArticles && !collapsed ? (
          <div className={`${styles.toc} ${styles.toc__stories}`}>
            <h6>Stories</h6>
            <ol>
              {systems.map((s, i) =>
                s.slug == system.slug ? (
                  <React.Fragment key={s.slug}>
                    {s.articles?.map((a, j) => (
                      <li
                        key={a._id}
                        data-selected={a.slug == article?.slug}
                      >
                        <div className={styles.toc__story_row}>
                          <button
                            onClick={() => setArticle(a)}
                            aria-pressed={a.slug == article?.slug}
                          >
                            <span>
                              {i + 1}&mdash;{String.fromCharCode(j + 65)}
                            </span>
                            <span>{a.title}</span>
                          </button>
                          <div>
                            {article?.slug == a.slug ? (
                              <a
                                href={`${URLS.STORIES}/${a.slug}`}
                                aria-label={`Read ${a.title}`}
                              >
                                Read
                              </a>
                            ) : null}
                          </div>
                        </div>
                      </li>
                    ))}
                  </React.Fragment>
                ) : null,
              )}
            </ol>
          </div>
        ) : null}
      </nav>
      {children}
    </TOCContext.Provider>
  );
}

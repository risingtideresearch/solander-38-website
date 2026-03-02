"use client";

import { BiCollapseAlt, BiExpandAlt } from "react-icons/bi";
import styles from "./toc.module.scss";
import { createContext, useEffect, useState } from "react";

interface TOCArticle {
  _id: string;
  slug: string;
  title: string;
}

export const TOCContext = createContext<{
  system: any;
  article: TOCArticle | null;
}>({
  system: { slug: "overview", relatedArticles: [] },
  article: null,
});

export default function TableOfContents({
  children,
  systems,
  defaultSystem = "",
  defaultArticle = null,
  hide = false,
  showArticles = true,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [system, setSystem] = useState(
    systems.find((system) => system.slug == defaultSystem) || systems[0],
  );
  const [article, setArticle] = useState<TOCArticle | null>(defaultArticle);

  useEffect(() => {
    if (window.innerWidth < 800 && !collapsed) {
      setCollapsed(true);
    }
  }, []);

  useEffect(() => {
    if (window.innerWidth < 800 && !collapsed && article) {
      setCollapsed(true);
    }
  }, [article, system, collapsed]);
  return (
    <TOCContext.Provider value={{ system, article }}>
      <div
        className={`${styles.toc__container} pane ${styles.outline} ${collapsed ? styles.collapsed : ""}`}
      >
        <button
          className={styles.toc__collapse_button}
          onClick={() => setCollapsed((prev) => !prev)}
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Expand table of contents" : "Collapse table of contents"}
        >
          {collapsed ? (
            <>
              <h6>
                {system.name}
                {article ? (
                  <span style={{ textTransform: "none" }}>
                    {" "}
                    / {article?.title}
                  </span>
                ) : (
                  ""
                )}
              </h6>
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
              {systems.map((s) => {
                return (
                  <li key={s.slug}>
                    <h6
                      onClick={() => {
                        setSystem(s);
                        setArticle(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSystem(s);
                          setArticle(null);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      style={{
                        fontWeight:
                          !article && s.slug == system.slug ? 600 : "",
                      }}
                    >
                      {s.name}
                    </h6>
                    {showArticles && (
                      <ol
                        style={{ height: s.slug == system.slug ? "auto" : 0 }}
                      >
                        {s.articles?.map((a: TOCArticle) => (
                          <li key={a._id}>
                            <span
                              onClick={() => setArticle(a)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  setArticle(a);
                                }
                              }}
                              role="button"
                              tabIndex={0}
                              style={{
                                fontWeight: a.slug == article?.slug ? 600 : "",
                              }}
                            >
                              {a.title}
                            </span>
                          </li>
                        ))}
                      </ol>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        ) : (
          <></>
        )}
      </div>
      {children}
    </TOCContext.Provider>
  );
}

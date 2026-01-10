"use client";

import { BiCollapseAlt, BiExpandAlt } from "react-icons/bi";
import styles from "./toc.module.scss";
import { createContext, useEffect, useState } from "react";

export const TOCContext = createContext({
  section: { slug: "overview", relatedArticles: [] },
  article: null,
});

export default function TableOfContents({
  children,
  sections,
  defaultSection = "",
  defaultArticle = null,
  hide = false,
  showArticles = true,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [section, setSection] = useState(
    sections.find((section) => section.slug == defaultSection) || sections[0],
  );
  const [article, setArticle] = useState(defaultArticle);

  useEffect(() => {
    if (window.innerWidth < 800 && !collapsed) {
      setCollapsed(true);
    }
  }, []);

  useEffect(() => {
    if (window.innerWidth < 800 && !collapsed && article) {
      setCollapsed(true);
    }
  }, [article, section]);
  return (
    <TOCContext.Provider value={{ section, article }}>
      <div
        className={`${styles.toc__container} pane ${styles.outline} ${collapsed ? styles.collapsed : ""}`}
      >
        <button
          className={styles.toc__collapse_button}
          onClick={() => setCollapsed((prev) => !prev)}
        >
          {collapsed ? (
            <>
              <h6>
                {section.name}
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
              {sections.map((s) => {
                return (
                  <li key={s.slug}>
                    <h6
                      onClick={() => {
                        setSection(s);
                        setArticle(null);
                      }}
                      role="button"
                      style={{
                        fontWeight:
                          !article && s.slug == section.slug ? 600 : "",
                      }}
                    >
                      {s.name}
                    </h6>
                    {showArticles && (
                      <ol
                        style={{ height: s.slug == section.slug ? "auto" : 0 }}
                      >
                        {s.articles?.map((a) => (
                          <li key={a._id}>
                            <span
                              onClick={() => setArticle(a)}
                              role="button"
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

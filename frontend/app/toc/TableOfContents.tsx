"use client";

import { BiCollapseAlt } from "react-icons/bi";
import styles from "./toc.module.scss";
import { createContext, useState } from "react";

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
  outline = false,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [section, setSection] = useState(
    sections.find((section) => section.slug == defaultSection) || sections[0],
  );
  const [article, setArticle] = useState(defaultArticle);
  return (
    <TOCContext.Provider value={{ section, article }}>
      <div
        className={styles.toc__container}
      >
        {/* <button
          style={{
            position: "absolute",
            zIndex: 1,
            right: 1,
            top: 1,
            backdropFilter: "none",
          }}
          onClick={() => setCollapsed((prev) => !prev)}
        >
          <BiCollapseAlt size={16} />
        </button> */}
        <div
          className={`toc ${styles.toc} ${outline ? `${styles.outline} pane` : ""}`}
          style={{ display: hide ? "none" : "" }}
        >
          <ol>
            {sections.map((s) => {
              return (
                <li key={s.slug}>
                  <h6
                    className="link"
                    onClick={() => {
                      setSection(s);
                      setArticle(null);
                    }}
                    role="button"
                    style={{
                      fontWeight:
                        !article && s.slug == section.slug ? 600 : 400,
                    }}
                  >
                    {s.name}
                  </h6>
                  {showArticles && (
                    <ol style={{ height: s.slug == section.slug ? "auto" : 0 }}>
                      {s.articles?.map((a) => (
                        <li onClick={() => setArticle(a)} key={a._id}>
                          <span
                            className="link"
                            style={{
                              fontWeight: a.slug == article?.slug ? 600 : 400,
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
      </div>
      {children}
    </TOCContext.Provider>
  );
}

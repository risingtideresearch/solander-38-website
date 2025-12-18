"use client";

import styles from "./toc.module.scss";
import { createContext, useState } from "react";
import RelatedStories from "../drawings/RelatedStories";

export const TOCContext = createContext({
  mode: "system",
  section: { slug: "overview", relatedArticles: [] },
  article: null,
  material: "Alum 5052",
  resetSection: () => {},
});

export default function TableOfContents({
  children,
  sections,
  modes = ["system"],
  defaultSection = "",
  defaultArticle = null,
  materials = [],
  hide = false,
  showArticleLink = false,
  showArticles = true,
  outline = false,
}) {
  const [mode, setMode] = useState("system");
  const [section, setSection] = useState(
    sections.find((section) => section.slug == defaultSection) || sections[0],
  );
  const [article, setArticle] = useState(defaultArticle);
  const [material, setMaterial] = useState("Alum 5052");

  function resetSection() {
    setSection(sections[0]);
  }

  return (
    <TOCContext.Provider
      value={{ mode, section, article, material, resetSection }}
    >
      <div className={styles.toc__container}>
        {/* <button style={{ position: 'absolute', zIndex: 1, right: 1, top: 1, backdropFilter: 'none'}}>
          <BiCollapseAlt size={16} />
        </button> */}
        <div
          className={`toc ${styles.toc} ${outline ? `${styles.outline} pane` : ""}`}
          style={{ display: hide ? "none" : "" }}
        >
          {mode == "system" ? (
            <ol>
              {sections.map((s) => {
                return (
                  <li style={{ cursor: "pointer" }} key={s.slug}>
                    <h6
                      onClick={() => {
                        setSection(s);
                        setArticle(null);
                      }}
                      style={{
                        fontWeight:
                          !article && s.slug == section.slug ? 600 : 400,
                      }}
                    >
                      {s.name}
                    </h6>
                    {showArticles && (
                      <ol
                        style={{ height: s.slug == section.slug ? "auto" : 0 }}
                      >
                        {s.articles?.map((a) => (
                          <li
                            onClick={() => setArticle(a)}
                            style={{ cursor: "pointer" }}
                            key={a._id}
                          >
                            <span
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
          ) : mode == "material" ? (
            <ol>
              {materials.map((mat) => {
                return (
                  <li key={mat} onClick={() => setMaterial(mat)}>
                    <h6
                      style={{
                        margin: "0.5rem",
                        fontWeight: mat == material ? 600 : 400,
                      }}
                    >
                      {mat}
                    </h6>
                  </li>
                );
              })}
            </ol>
          ) : (
            <></>
          )}
        </div>
        {showArticleLink && mode == "system" && (
          <RelatedStories
            stories={article ? [article] : section.articles || []}
          />
        )}
      </div>
      {children}
    </TOCContext.Provider>
  );
}

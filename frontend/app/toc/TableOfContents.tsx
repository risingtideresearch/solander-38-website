"use client";

import { LiaLongArrowAltRightSolid } from "react-icons/lia";
import styles from "./toc.module.scss";
import { createContext, useState } from "react";
import { BiCollapseAlt } from "react-icons/bi";

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
          className={`toc ${styles.toc} ${outline ? `${styles.outline} pane` : ''}`}
          style={{ display: hide ? "none" : "" }}
        >
          {/* <h2 className="uppercase-mono">Table of Contents</h2> */}
          {/* <div
            style={{
              display: "grid",
              gridTemplateColumns: modes.length == 1 ? "1fr" : "1fr 1fr",
              borderBottom: "1px solid",
              margin: "0 -0.5rem",
            }}
          >
            {modes.map((type, i) => (
              <h6
                onClick={() => {
                  setMode(type);
                  setSection(sections[0]);
                }}
                key={type}
                style={{
                  cursor: "pointer",
                  fontWeight: 400,
                  margin: 0,
                  padding: "0.5rem",
                  borderRight: i < modes.length - 1 ? "1px solid" : "",
                }}
              >
                {type == "system" ? "system" : type}
              </h6>
            ))}
          </div> */}
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
        {showArticleLink &&
        mode == "system" &&
        (article ? [article] : section.articles || []).length > 0 ? (
          <div
            className="pane"
            style={{
              marginTop: "0.75rem",
              border: "1px solid",
              width: "16.5rem",
            }}
          >
            <h6 style={{ padding: "0.5rem" }}>Stories</h6>
            <div style={{ borderTop: "1px solid" }}>
              {(article ? [article] : section.articles || []).map((a) => (
                <div
                  key={a._id}
                  style={{
                    padding: "0 0.5rem",
                    margin: "0.5rem 0",
                    lineHeight: "1.2em",
                  }}
                >
                  <a
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                    }}
                    href={`/stories/${a.slug}`}
                  >
                    {a.title}
                    <LiaLongArrowAltRightSolid size={18} />
                  </a>
                  {/* <p style={{ margin: 0, fontSize: "0.75rem" }}>{a.subtitle}</p> */}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
      {children}
    </TOCContext.Provider>
  );
}

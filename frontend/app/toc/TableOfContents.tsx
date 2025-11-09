"use client";

import styles from "./toc.module.scss";
import { createContext, useEffect, useState } from "react";

export const TOCContext = createContext({
  mode: "system",
  section: "overview",
  article: null,
  setSection: (val: string) => {},
});

export default function TableOfContents({
  children,
  sections,
  modes = ["system"],
  defaultSection = "",
  defaultArticle = null,
  materials = [],
  hide = false,
}) {
  const [mode, setMode] = useState("system");
  const [section, setSection] = useState(
    (sections.find((section) => section.slug == defaultSection) || sections[0])
      .slug
  );
  const [article, setArticle] = useState(defaultArticle);

  // useEffect(() => {
  //   if (article) {
  //     setArticle(null);
  //   }
  // }, [section]);

  return (
    <TOCContext.Provider value={{ mode, section, setSection, article }}>
      <div className={"pane toc " + styles.toc} style={{ display: hide ? 'none' : ''}}>
        {/* <h2 className="uppercase-mono">Table of Contents</h2> */}
        <div
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
                setSection(sections[0].slug);
              }}
              key={type}
              style={{
                cursor: "pointer",
                fontWeight: mode == type ? 800 : 400,
                margin: 0,
                padding: "0.5rem",
                borderRight: i < modes.length - 1 ? "1px solid" : "",
              }}
            >
              {type == "system" ? "system" : type}
            </h6>
          ))}
        </div>
        {mode == "system" ? (
          <ol>
            {sections.map((s) => {
              return (
                <li style={{ cursor: "pointer" }} key={s.slug}>
                  <h6
                    onClick={() => {
                      setSection(s.slug);
                      setArticle(null);
                    }}
                    style={{
                      fontWeight: !article && s.slug == section ? 600 : 400,
                    }}
                  >
                    {s.name}
                  </h6>
                  {/* {s.slug == section ? ( */}
                  <ol style={{ height: s.slug == section ? "auto" : 0 }}>
                    {s.articles?.map((a) => (
                      <li onClick={() => setArticle(a.slug)} key={a._id}>
                        <span
                          style={{
                            fontWeight: a.slug == article ? 600 : 400,
                          }}
                        >
                          {a.title}
                        </span>
                      </li>
                    ))}
                  </ol>
                  {/* ) : (
                    <></>
                  )} */}
                </li>
              );
            })}
          </ol>
        ) : mode == "material" ? (
          <ol>
            {materials.map((mat) => {
              return (
                <li key={mat} onClick={() => setSection(mat)}>
                  <h6 style={{ margin: "0.5rem" }}>{mat}</h6>
                </li>
              );
            })}
          </ol>
        ) : (
          <></>
        )}
      </div>
      {children}
    </TOCContext.Provider>
  );
}

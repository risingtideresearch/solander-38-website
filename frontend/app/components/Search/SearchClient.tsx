"use client";

import { BiSearch } from "react-icons/bi";
import styles from "./search.module.scss";
import { useEffect, useRef, useState } from "react";
import { searchDrawings } from "./util";

const colors = {
  article: "var(--accent)",
  drawing: "#6ee6ff",
};

export default function SearchClient({ drawings }) {
  const [active, setActive] = useState(false);
  const [value, setValue] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActive(false);
        setValue("");
        setResults([]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (active && inputRef.current) {
      inputRef.current.focus();
    }
  }, [active]);

  useEffect(() => {
    const searchDocuments = async () => {
      if (!value.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: value }),
        });

        const data = await response.json();
        const otherResults = searchDrawings(drawings, value);
        setResults((data.results || []).concat(otherResults));
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchDocuments, 200);
    return () => clearTimeout(timeoutId);
  }, [value]);

  const handleBlur = () => {
    if (!loading && results.length == 0) {
      setActive(false);
    }
  };

  const getURL = (doc) => {
    switch (doc._type) {
      case "article":
        return `/article/${doc.slug.current}`;
      case "drawing":
        return `/drawings/file/${doc.uuid}`;
    }

    return doc.slug ? doc.slug.current : doc._id;
  };

  return (
    <>
      {active && (
        <div className={"pane " + styles.search__input}>
          <input
            ref={inputRef}
            type="search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            // onBlur={handleBlur}
            placeholder="Search"
          />
          {!loading && value && results.length === 0 && (
            <div className={styles.search__no_results}>No results found</div>
          )}
          {(results.length > 0 || loading) && (
            <div className={styles.search__results}>
              {results.map((result: any) => (
                <div key={result._id} className={styles.search__result}>
                  <a
                    href={getURL(result)}
                    style={{
                      margin: "0.5rem 0",
                      display: "block",
                    }}
                  >
                    <p
                      style={{
                        display: "inline-flex",
                        gap: "1.5rem",
                        alignItems: "center",
                        margin: 0,
                      }}
                    >
                      <span>{result.title || result.filename}</span>

                      <span
                        style={{
                          fontSize: "0.75rem",
                          textTransform: "uppercase",
                          background: colors[result._type],
                          padding: "0.25rem",
                          lineHeight: "1.2em",
                          display: "inline",
                        }}
                      >
                        {result._type}
                      </span>
                    </p>
                    {/* <p style={{ fontSize: "0.75rem", margin: 0 }}>
                      {result.matchedSnippet || ""}
                    </p> */}
                  </a>
                </div>
              ))}
              {loading && (
                <div className={styles.search__loading}>Searching...</div>
              )}
            </div>
          )}
        </div>
      )}
      <button
        className={"pane " + styles.search__button}
        onClick={() => setActive((prev) => !prev)}
        aria-label="Search"
      >
        <BiSearch size={18} />
      </button>
    </>
  );
}

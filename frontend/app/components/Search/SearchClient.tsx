"use client";

import { BiSearch } from "react-icons/bi";
import styles from "./search.module.scss";
import { useEffect, useRef, useState } from "react";
import { searchDrawings } from "./util";
import { getPhotoURL } from "@/app/photos/util";

const colors = {
  article: "var(--accent)",
  drawing: "#6ee6ff",
};

export default function SearchClient({ drawings, type }) {
  const [active, setActive] = useState(false);
  const [value, setValue] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActive(false);
        setValue("");
        setResults([]);
        setSelectedIndex(-1);
      }

      // Keyboard navigation for results
      if (active && results.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : prev,
          );
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        } else if (e.key === "Enter" && selectedIndex >= 0) {
          e.preventDefault();
          const result = results[selectedIndex];
          window.location.href = getURL(result);
        }
      }

      // CMD/CTRL + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setActive(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [active, results, selectedIndex]);

  useEffect(() => {
    if (active && inputRef.current) {
      inputRef.current.focus();
    }
  }, [active]);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [results]);

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
        console.log(data);
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
  }, [value, drawings]);

  const handleClose = () => {
    setActive(false);
    setValue("");
    setResults([]);
    setSelectedIndex(-1);
  };

  const getURL = (doc) => {
    switch (doc._type) {
      case "article":
        return `/stories/${doc.slug.current}`;
      case "drawing":
        return `/drawings/file/${doc.uuid}`;
      case "sanity.imageAsset":
        return getPhotoURL(doc);
      default:
        return doc.slug ? doc.slug.current : doc._id;
    }
  };

  // Group results by type
  const groupedResults = results.reduce((acc, result) => {
    const type = result._type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(result);
    return acc;
  }, {});

  // Get flat index for keyboard navigation
  const getFlatIndex = (type, indexInGroup) => {
    let flatIndex = 0;
    const types = Object.keys(groupedResults).sort();

    for (const t of types) {
      if (t === type) {
        return flatIndex + indexInGroup;
      }
      flatIndex += groupedResults[t].length;
    }
    return flatIndex;
  };

  return (
    <>
      {active && (
        <>
          <div
            className={styles.search__backdrop}
            onClick={handleClose}
            aria-hidden="true"
          ></div>

          <div
            className={`${styles.search__input} ${type && styles[type]}`}
            role="search"
            aria-label="Site search"
          >
            <label htmlFor="search" className="sr-only">
              Search articles and drawings
            </label>
            <input
              id="search"
              ref={inputRef}
              type="search"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Search"
              aria-expanded={results.length > 0}
              aria-controls="search-results"
              aria-activedescendant={
                selectedIndex >= 0
                  ? `search-result-${selectedIndex}`
                  : undefined
              }
              autoComplete="off"
              aria-describedby="search-instructions"
            />

            <div id="search-instructions" className="sr-only">
              Use arrow keys to navigate results, Enter to select, Escape to
              close
            </div>

            {!loading && value && results.length === 0 && (
              <div
                className={styles.search__no_results}
                role="status"
                aria-live="polite"
              >
                <p style={{ textAlign: "center" }}>
                  No results found for &quot;{value}&quot;
                </p>
              </div>
            )}

            {(results.length > 0 || loading) && (
              <div
                id="search-results"
                ref={resultsRef}
                className={styles.search__results}
                role="listbox"
                aria-label="Search results"
              >
                {Object.keys(groupedResults)
                  .sort((a, b) => {
                    const order = ["article", "sanity.imageAsset"];
                    const aIndex = order.indexOf(a);
                    const bIndex = order.indexOf(b);

                    if (aIndex !== -1 && bIndex !== -1) {
                      return aIndex - bIndex;
                    }

                    if (aIndex !== -1) return -1;

                    if (bIndex !== -1) return 1;

                    return 0;
                  })
                  .map((resultType) => (
                    <div key={resultType}>
                      <h6
                        style={{
                          fontWeight: 600,
                        }}
                      >
                        {resultType == "sanity.imageAsset"
                          ? "Photo"
                          : resultType}
                        s
                      </h6>
                      {groupedResults[resultType].map(
                        (result: any, indexInGroup: number) => {
                          const flatIndex = getFlatIndex(
                            resultType,
                            indexInGroup,
                          );
                          return (
                            <div
                              key={result._id || result.uuid}
                              id={`search-result-${flatIndex}`}
                              className={`${styles.search__result} ${
                                selectedIndex === flatIndex
                                  ? styles.search__result_selected
                                  : ""
                              }`}
                              role="option"
                              aria-selected={selectedIndex === flatIndex}
                            >
                              <a
                                href={getURL(result)}
                                style={{
                                  margin: "0.5rem 0",
                                  display: "flex",
                                  gap: "1rem",
                                  alignItems: "center",
                                }}
                                tabIndex={-1}
                                onFocus={() => setSelectedIndex(flatIndex)}
                              >
                                <h6>{result.id}</h6>
                                <p style={{ margin: 0 }}>
                                  {result.title || result.clean_filename}
                                </p>
                              </a>
                            </div>
                          );
                        },
                      )}
                    </div>
                  ))}
                {loading && (
                  <div
                    className={styles.search__loading}
                    role="status"
                    aria-live="polite"
                  >
                    <p style={{ textAlign: "center" }}>Searching...</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      <button
        className={`pane ${styles.search__button} ${type ? styles[type] : ""}`}
        onClick={() => setActive((prev) => !prev)}
        aria-label={active ? "Close search" : "Open search"}
        aria-controls={active ? "search-results" : undefined}
        title="Search (⌘K)"
      >
        <BiSearch size={18} aria-hidden="true" />
      </button>
    </>
  );
}

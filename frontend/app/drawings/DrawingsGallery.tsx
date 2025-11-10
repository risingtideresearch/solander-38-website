import { useContext, useMemo, useEffect, useRef } from "react";
import { TOCContext } from "../toc/TableOfContents";
import { FocusedView } from "./FocusedView";
import { Drawing, DrawingGroup } from "./types";
import { SYSTEM_ORDER } from "../consts";
import { DrawingCard } from "./DrawingCard";
import styles from "./styles.module.scss";
import { DrawingsArticleDictionary } from "./util";
import RelatedArticles from "./RelatedArticles";

function filterDrawings(drawings, searchTerm, toc, drawingsArticleDictionary) {
  const lowerSearch = searchTerm.toLowerCase();
  return drawings.filter((d) => {
    const group = d.group?.toLowerCase() || "";

    if (lowerSearch.length > 0) {
      return (
        d.filename.toLowerCase().includes(lowerSearch) ||
        group.includes(lowerSearch) ||
        d.id.toLowerCase().includes(lowerSearch) ||
        d.extracted_text
          .replaceAll("/n", " ")
          .toLowerCase()
          .includes(lowerSearch)
      );
    }

    if (toc.article) {
      return (drawingsArticleDictionary[d.uuid] || []).find(
        (article) => article.slug == toc.article.slug,
      );
    }

    if (toc.section.slug) {
      return group.replace(" & ", "-").replaceAll(" ", "-") == toc.section.slug;
    }
    return true;
  });
}

function sortDrawingsByTime(drawings) {
  return [...drawings]
    .sort((a, b) => a.filename.localeCompare(b.filename))
    .sort((a, b) =>
      (b.date_info?.date || "2024-01-01").localeCompare(
        a.date_info?.date || "2024-01-01",
      ),
    );
}

function sortDrawingsByGroup(drawings: Array<Drawing>) {
  return [...drawings]
    .sort((a, b) => a.rel_path.localeCompare(b.rel_path))
    .sort((a, b) => {
      const aGroup = a.group.toLowerCase();
      const bGroup = b.group.toLowerCase();
      return SYSTEM_ORDER.indexOf(aGroup) - SYSTEM_ORDER.indexOf(bGroup);
    });
}

function getGroupKey(drawing: Drawing, mode): string {
  if (mode === "date") {
    return drawing.date_info?.date || "2024-01-01";
  }
  return drawing.group;
}

function getGroupLabel(drawing: Drawing, mode) {
  if (mode === "date") {
    if (drawing.date_info) {
      const date = new Date(drawing.date_info.date);
      return date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
    }
    return "Undated";
  }
  return drawing.group;
}

function groupDrawings(drawings: Drawing[], mode): DrawingGroup[] {
  const groups: DrawingGroup[] = [];

  drawings.forEach((drawing) => {
    const groupKey = getGroupKey(drawing, mode);

    let currentGroup = groups.find((g) => g.key === groupKey);

    if (!currentGroup) {
      currentGroup = {
        key: groupKey,
        label: getGroupLabel(drawing, mode),
        drawings: [],
      };
      groups.push(currentGroup);
    }

    currentGroup.drawings.push(drawing);
  });

  return groups;
}

interface DrawingsGalleryProps {
  drawings: {
    files: Array<Drawing>;
  };
  search: string;
  defaultUUID?: string | null;
  focusUUID: string | null;
  setFocusUUID: (uuid: string | null) => void;
  drawingsArticleDictionary: DrawingsArticleDictionary;
}

export default function DrawingsGallery({
  drawings,
  search,
  drawingsArticleDictionary,
  defaultUUID,
  focusUUID,
  setFocusUUID,
}: DrawingsGalleryProps) {
  const toc = useContext(TOCContext);
  const scrollPositionRef = useRef(0);
  const isPopStateRef = useRef(false);

  // useEffect(() => {
  //   if (search) {
  //     resetSearch()
  //   }
  // }, [toc.section, toc.article, toc.mode])

  const filteredAndSorted = useMemo(() => {
    const sourceData = drawings.files;

    const filtered = defaultUUID
      ? sourceData
      : filterDrawings(sourceData, search, toc, drawingsArticleDictionary);

    return toc.mode === "date"
      ? sortDrawingsByTime(filtered)
      : sortDrawingsByGroup(filtered);
  }, [drawings, toc.article, toc.section, toc.mode, search, defaultUUID]);

  const focusedDrawing: Drawing = useMemo(
    () => filteredAndSorted.find((d) => d.uuid === focusUUID),
    [filteredAndSorted, focusUUID],
  );

  const focusIndex = useMemo(
    () =>
      focusUUID ? filteredAndSorted.findIndex((d) => d.uuid === focusUUID) : -1,
    [filteredAndSorted, focusUUID],
  );

  const groupedDrawings: Array<DrawingGroup> = groupDrawings(
    filteredAndSorted,
    toc.mode,
  );

  const handlePrev = () => {
    if (focusIndex > 0) {
      const newUUID = filteredAndSorted[focusIndex - 1].uuid;
      setFocusUUID(newUUID);
      window.history.pushState(null, "", `/drawings/file/${newUUID}`);
    }
  };

  const handleNext = () => {
    if (focusIndex < filteredAndSorted.length - 1) {
      const newUUID = filteredAndSorted[focusIndex + 1].uuid;
      setFocusUUID(newUUID);
      window.history.pushState(null, "", `/drawings/file/${newUUID}`);
    }
  };

  const handleClick = (asset: Drawing) => {
    // Save scroll position before opening focused view
    scrollPositionRef.current = window.scrollY;

    setFocusUUID(asset.uuid);
    window.history.pushState(null, "", `/drawings/file/${asset.uuid}`);
  };

  const handleClose = () => {
    setFocusUUID(null);
    window.history.pushState(null, "", "/drawings");
  };

  useEffect(() => {
    if (focusUUID === null && scrollPositionRef.current > 0) {
      setTimeout(() => {
        window.scrollTo(0, scrollPositionRef.current);
      }, 0);
    }
  }, [focusUUID]);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      isPopStateRef.current = true;
      const path = window.location.pathname;

      if (path === "/drawings") {
        setFocusUUID(null);
      } else if (path.startsWith("/drawings/file/")) {
        const uuid = path.split("/drawings/file/")[1];
        const exists = filteredAndSorted.some((d) => d.uuid === uuid);
        if (exists) {
          // Save scroll position when navigating away via back button
          if (focusUUID === null) {
            scrollPositionRef.current = window.scrollY;
          }
          setFocusUUID(uuid);
        }
      }

      setTimeout(() => {
        isPopStateRef.current = false;
      }, 0);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [filteredAndSorted, focusUUID]);

  const visibleDrawings: Array<React.JSX.Element> = [];
  groupedDrawings.forEach((group) => {
    group.drawings.forEach((asset: Drawing) => {
      visibleDrawings.push(
        <DrawingCard
          key={asset.id}
          drawing={asset}
          onClick={() => handleClick(asset)}
        />,
      );
    });
  });

  return (
    <>
      {focusedDrawing ? (
        <>
          <div
            className="pane"
            style={{
              position: "fixed",
              top: "6rem",
              left: "0.5rem",
              width: "15rem",
              zIndex: 100,
            }}
          >
            <RelatedArticles
              uuid={focusedDrawing.uuid}
              drawingsArticleDictionary={drawingsArticleDictionary}
            />

            {/* <div style={{marginTop: '2rem'}}>
              <img
                src={focusedDrawing.rel_path}
                width={240}
                height={(240 * focusedDrawing.height) / focusedDrawing.width}
                loading="lazy"
                // alt={focusedDrawing.filename}
              />
              <p
                className={`${styles["focused-view__uuid-label"]} uppercase-mono`}
                style={{ fontSize: "0.5rem" }}
              >
                {focusedDrawing.uuid}
              </p>
            </div> */}
          </div>
          <main style={{ paddingLeft: "16.125rem", paddingRight: '3.5rem' }}>
            <FocusedView
              asset={focusedDrawing}
              index={focusIndex}
              all={filteredAndSorted}
              onPrev={handlePrev}
              onNext={handleNext}
              onClose={handleClose}
            />
          </main>
        </>
      ) : (
        <main
          style={{
            paddingLeft: "18rem",
            // marginTop: groupIndex === 0 ? 0 : "4rem",
            display: "grid",
            gridTemplateColumns: "1fr 4rem",
          }}
        >
          <div style={{ minHeight: "100vh" }}>
            {visibleDrawings.length > 0 ? (
              <div className={styles.gallery}>{visibleDrawings}</div>
            ) : (
              <div>No drawings</div>
            )}
          </div>
        </main>
      )}
    </>
  );
}

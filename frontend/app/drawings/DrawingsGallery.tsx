"use client";

import { useContext, useState, useMemo, useEffect, useRef } from "react";
import { TOCContext } from "../toc/TableOfContents";
import { FocusedView } from "./FocusedView";
import { Drawing, DrawingGroup } from "./types";
import { SYSTEM_ORDER } from "../consts";
import { DrawingCard } from "./DrawingCard";
import styles from "./styles.module.scss";
import { DrawingsArticleDictionary } from "./util";
import RelatedArticles from "./RelatedArticles";

function GroupHeader({ label, count }) {
  return (
    <div
      style={{
        position: "sticky",
        top: "3.25rem",
        zIndex: 10,
        marginBottom: "2rem",
        marginLeft: "0.5rem",
        height: "min-content",
        width: "11.5rem",
      }}
    >
      <div
        style={{
          margin: 0,
          border: "1px solid",
          display: "block",
          padding: "0.25rem 0.5rem",
        }}
      >
        <h5 style={{ margin: "0 0 0.5rem 0" }}>{label}</h5>
        <h6>
          {count} drawing{count > 1 ? "s" : ""}
        </h6>
      </div>
    </div>
  );
}

function filterDrawings(drawings, searchTerm, section) {
  if (!searchTerm) {
    return drawings;
  }
  const lowerSearch = searchTerm.toLowerCase();
  return drawings.filter((d) => {
    const group = d.group?.toLowerCase() || "";
    if (!section || section == group) {
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
      return true;
    }
    return false;
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
  search?: string;
  defaultUUID?: string;
  drawingsArticleDictionary: DrawingsArticleDictionary;
}

export default function DrawingsGallery({
  drawings,
  search = "",
  defaultUUID,
  drawingsArticleDictionary,
}: DrawingsGalleryProps) {
  const toc = useContext(TOCContext);
  const scrollPositionRef = useRef(0);
  const isPopStateRef = useRef(false);

  const filteredAndSorted = useMemo(() => {
    const sourceData = drawings.files;

    const filtered = filterDrawings(sourceData, search, null);

    return toc.mode === "date"
      ? sortDrawingsByTime(filtered)
      : sortDrawingsByGroup(filtered);
  }, [drawings, toc.mode, toc.section, search]);

  const [focusIndex, setFocusIndex] = useState(
    defaultUUID
      ? filteredAndSorted.findIndex((d) => d.uuid == defaultUUID)
      : -1,
  );

  const groupedDrawings: Array<DrawingGroup> = groupDrawings(
    filteredAndSorted,
    toc.mode,
  );

  const handlePrev = () => {
    if (focusIndex > 0) {
      const newIndex = focusIndex - 1;
      setFocusIndex(newIndex);
      window.history.pushState(
        null,
        "",
        `/drawings/file/${filteredAndSorted[newIndex].uuid}`,
      );
    }
  };

  const handleNext = () => {
    if (focusIndex < filteredAndSorted.length - 1) {
      const newIndex = focusIndex + 1;
      setFocusIndex(newIndex);
      window.history.pushState(
        null,
        "",
        `/drawings/file/${filteredAndSorted[newIndex].uuid}`,
      );
    }
  };

  const handleClick = (asset: Drawing) => {
    // Save scroll position before opening focused view
    scrollPositionRef.current = window.scrollY;

    const newIndex = filteredAndSorted.indexOf(asset);
    setFocusIndex(newIndex);
    window.history.pushState(null, "", `/drawings/file/${asset.uuid}`);
  };

  const handleClose = () => {
    setFocusIndex(-1);
    window.history.pushState(null, "", "/drawings");
  };

  useEffect(() => {
    if (focusIndex === -1 && scrollPositionRef.current > 0) {
      setTimeout(() => {
        window.scrollTo(0, scrollPositionRef.current);
      }, 0);
    } 
  }, [focusIndex]);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      isPopStateRef.current = true;
      const path = window.location.pathname;

      if (path === "/drawings") {
        setFocusIndex(-1);
      } else if (path.startsWith("/drawings/file/")) {
        const uuid = path.split("/drawings/file/")[1];
        const index = filteredAndSorted.findIndex((d) => d.uuid === uuid);
        if (index !== -1) {
          // Save scroll position when navigating away via back button
          if (focusIndex === -1) {
            scrollPositionRef.current = window.scrollY;
          }
          setFocusIndex(index);
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
  }, [filteredAndSorted, focusIndex]);

  return (
    <>
      {focusIndex > -1 ? (
        <>
          <RelatedArticles
            uuid={filteredAndSorted[focusIndex].uuid}
            drawingsArticleDictionary={drawingsArticleDictionary}
          />
          <FocusedView
            asset={filteredAndSorted[focusIndex]}
            index={focusIndex}
            all={filteredAndSorted}
            onPrev={handlePrev}
            onNext={handleNext}
            popover={false}
            onClose={handleClose}
          />
        </>
      ) : (
        <div>
          {groupedDrawings.map((group, groupIndex) => (
            <section
              style={{
                marginTop: groupIndex === 0 ? 0 : "4rem",
                display: "grid",
                gridTemplateColumns: "1fr 12rem ",
              }}
              key={group.label + groupIndex}
              id={group.label.toLowerCase().replaceAll(" ", "-")}
            >
              <div className={styles.gallery}>
                {group.drawings.map((asset: Drawing) => {
                  return (
                    <DrawingCard
                      key={asset.id}
                      drawing={asset}
                      onClick={() => handleClick(asset)}
                    />
                  );
                })}
              </div>

              <GroupHeader label={group.label} count={group.drawings.length} />
            </section>
          ))}
        </div>
      )}
    </>
  );
}

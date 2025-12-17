import { Drawing, DrawingGroup } from "./types";
import { SYSTEM_ORDER } from "../consts";
import { DrawingCard } from "./DrawingCard";
import styles from "./drawings-gallery.module.scss";
import { getSlugFromDrawingGroup } from "./util";

function filterDrawings(drawings, section) {
  return drawings.filter((d) => {
    const group = d.group?.toLowerCase() || "";

    if (section) {
      return getSlugFromDrawingGroup(group) == section;
    }
    return true;
  });
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

function groupDrawings(drawings: Drawing[], mode): DrawingGroup[] {
  const groups: DrawingGroup[] = [];

  drawings.forEach((drawing) => {
    const groupKey = getGroupKey(drawing, mode);

    let currentGroup = groups.find((g) => g.key === groupKey);

    if (!currentGroup) {
      currentGroup = {
        key: groupKey,
        label: drawing.group,
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
  section?: string | null;
}

export default async function DrawingsGallery({
  drawings,
  section,
}: DrawingsGalleryProps) {
  const filteredAndSorted = sortDrawingsByGroup(
    filterDrawings(drawings.files, section),
  );
  const groupedDrawings: Array<DrawingGroup> = groupDrawings(
    filteredAndSorted,
    "section",
  );

  const visibleDrawings: Array<React.JSX.Element> = [];
  groupedDrawings.forEach((group) => {
    group.drawings.forEach((asset: Drawing) => {
      visibleDrawings.push(<DrawingCard key={asset.id} drawing={asset} />);
    });
  });

  return (
    <main className={styles["gallery-container"]}>
      <div style={{ minHeight: "100vh" }}>
        {visibleDrawings.length > 0 ? (
          <div className={styles.gallery}>{visibleDrawings}</div>
        ) : (
          <div>No drawings</div>
        )}
      </div>
    </main>
  );
}

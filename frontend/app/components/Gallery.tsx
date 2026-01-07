import { ReactNode } from "react";
import styles from "./gallery.module.scss";

interface GalleryProps {
  children: ReactNode[];
  emptyMessage: string;
}

export default function Gallery({
  children = [],
  emptyMessage = "",
}: GalleryProps) {
  return (
    <div className={styles["gallery-container"]}>
      {children.length > 0 ? (
        <div className={styles.gallery}>{children}</div>
      ) : (
        <div className={styles.empty}>
          <h6>{emptyMessage}</h6>
        </div>
      )}
    </div>
  );
}

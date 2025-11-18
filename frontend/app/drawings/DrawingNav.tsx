import { LiaArrowLeftSolid, LiaArrowRightSolid } from "react-icons/lia";
import styles from "./../articles/page.module.scss";
import { useEffect } from "react";
import { formatDate } from "../utils";

export default function DrawingNav({ prev, next, onPrev, onNext, drawing }) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && prev) {
        onPrev();
      } else if (e.key === "ArrowRight" && next) {
        onNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [prev, next]);

  return (
    <div
      className={styles.page__metadata}
      style={{
        border: "1px solid",
        position: "static",
      }}
    >
      <div>
        <h6>ID</h6>
        <h6>{drawing.id}</h6>
      </div>
      <div>
        <h6>Date</h6>
        <h6>{drawing.date_info ? formatDate(drawing.date_info.date) : '<no date>'}</h6>
      </div>
      <div>
        <h6>System</h6>
        <h6>{drawing.group}</h6>
      </div>
      {next && (
        <div>
          <h6>Next</h6>
          <a onClick={(e) => {e.stopPropagation(); onNext(); }} style={{ textAlign: "left" }}>
            <LiaArrowRightSolid size={18} />
            <h6>{next.clean_filename}</h6>
          </a>
        </div>
      )}
      {prev && (
        <div>
          <h6>Prev</h6>

          <a onClick={(e) => {e.stopPropagation(); onPrev()}} style={{ textAlign: "left" }}>
            <LiaArrowLeftSolid size={18} />
            <h6>{prev.clean_filename}</h6>
          </a>
        </div>
      )}
    </div>
  );
}

"use client";

import { Drawing } from "./types";
import styles from "./drawings.module.scss";
import { formatDate } from "../utils";

interface IDrawingCard {
  drawing: Drawing;
  hideMetadata?: boolean;
}

export function DrawingCard({ drawing, hideMetadata }: IDrawingCard) {
  return (
    <a
      href={`/drawings/file/${drawing.uuid}`}
      className={
        styles["drawing-card"] 
      }
    >
      {!hideMetadata && (
        <h6>
          <span>{drawing.id}</span>
          <span>
            {" "}
            {drawing.date_info
              ? formatDate(drawing.date_info.date)
              : "<no date>"}
          </span>
          <span>{drawing.group}</span>
        </h6>
      )}
      <p className="font-sans" style={{margin: 0}}>{drawing.clean_filename}</p>
      <img
        src={drawing.rel_path}
        height={drawing.height}
        width={drawing.width}
        style={{ maxWidth: "100%", height: "auto" }}
      />
    </a>
  );
}

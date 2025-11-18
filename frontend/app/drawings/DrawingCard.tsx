"use client";

import { Drawing } from "./types";
import styles from "./styles.module.scss";
import { formatDate } from "../utils";

interface IDrawingCard {
  drawing: Drawing;
}

export function DrawingCard({ drawing }: IDrawingCard) {
  return (
    <a
      href={`/drawings/file/${drawing.uuid}`}
      className={styles["drawing-card"] + (drawing.height > drawing.width ? " drawing-card--portrait" : "")}
    >
      <h6>
        <span>{drawing.id}</span>
        <span> {drawing.date_info ? formatDate(drawing.date_info.date) : "<no date>"}</span>
        <span>{drawing.group}</span>
      </h6>
      <p>{drawing.clean_filename}</p>
      <img
        src={drawing.rel_path}
        height={drawing.height}
        width={drawing.width}
        style={{ maxWidth: "100%", height: "auto" }}
      />
    </a>
  );
}

"use client";

import { useState } from "react";
import { BiCollapseAlt, BiExpandAlt } from "react-icons/bi";
import styles from "./anatomy-pane.module.scss";

interface AnatomyPaneProps {
  children: React.ReactNode;
  title: string;
  defaultSize?: React.CSSProperties;
  expandedSize?: React.CSSProperties;
  url: string;
}

export default function AnatomyPane({
  children,
  title,
  defaultSize = {},
  expandedSize = {},
  url,
}: AnatomyPaneProps) {
  const [expand, setExpand] = useState(false);

  const paneContent = (
    <div
      className={`pane ${styles["anatomy-pane"]} ${
        expand ? styles["anatomy-pane--expanded"] : ""
      }`}
      style={expand ? expandedSize : defaultSize}
    >
      <h6>
        <a href={url}>{title}</a>
      </h6>

      {/* <button onClick={() => setExpand((prev) => !prev)}>
        {expand ? <BiCollapseAlt size={18} /> : <BiExpandAlt size={18} />}
      </button> */}
      <div style={expand ? { height: "100%" } : defaultSize}>{children}</div>
    </div>
  );

  return paneContent;
}

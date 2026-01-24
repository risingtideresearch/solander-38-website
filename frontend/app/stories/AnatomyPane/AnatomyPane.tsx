"use client";

import styles from "./anatomy-pane.module.scss";

interface AnatomyPaneProps {
  children: React.ReactNode;
  title?: string;
  defaultStyles?: React.CSSProperties;
  url?: string;
}

export default function AnatomyPane({
  children,
  title,
  defaultStyles = {},
  url,
}: AnatomyPaneProps) {
  return (
    <div
      className={`pane ${styles["anatomy-pane"]}`}
      style={{ ...defaultStyles, background: "none", backdropFilter: "none" }}
    >
      {title ? <h6>{url ? <a href={url}>{title}</a> : title}</h6> : <></>}
      {children}
    </div>
  );
}

"use client";

import styles from "./anatomy-pane.module.scss";

interface AnatomyPaneProps {
  children: React.ReactNode;
  title?: string;
  defaultStyles?: React.CSSProperties;
  url?: string;
  className?: string;
}

export default function AnatomyPane({
  children,
  title,
  defaultStyles = {},
  url,
  className,
}: AnatomyPaneProps) {
  return (
    <div
      className={`pane ${styles["anatomy-pane"]}${className ? ` ${className}` : ""}`}
      style={{ ...defaultStyles, background: "none", backdropFilter: "none" }}
    >
      {title ? <h6>{url ? <a href={url}>{title}</a> : title}</h6> : <></>}
      {children}
    </div>
  );
}

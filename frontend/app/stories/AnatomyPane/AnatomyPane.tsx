"use client";

import styles from "./anatomy-pane.module.scss";

interface AnatomyPaneProps {
  children: React.ReactNode;
  title: string;
  defaultSize?: React.CSSProperties;
  url: string;
}

export default function AnatomyPane({
  children,
  title,
  defaultSize = {},
  url,
}: AnatomyPaneProps) {

  const paneContent = (
    <div
      className={`pane ${styles["anatomy-pane"]}`}
      style={defaultSize}
    >
      <h6>
        <a href={url}>{title}</a>
      </h6>
      {children}
    </div>
  );

  return paneContent;
}

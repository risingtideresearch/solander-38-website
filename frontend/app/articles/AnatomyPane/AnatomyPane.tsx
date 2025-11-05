"use client";

import { useState } from "react";
import { BiCollapseAlt, BiExpandAlt } from "react-icons/bi";
import styles from "./anatomy-pane.module.scss";
import { Modal } from "../../components/Modal/Modal";

interface AnatomyPaneProps {
  children: React.ReactNode;
  title?: string;
  defaultSize?: React.CSSProperties;
  expandedSize?: React.CSSProperties;
  useModalForExpand?: boolean;
}

export default function AnatomyPane({
  children,
  title = "",
  defaultSize = {},
  expandedSize = {},
  useModalForExpand = false,
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
        {/* TODO routing */}
        {/* <a href={`/${title.toLowerCase()}`}>{title}</a> */}
        {title}
      </h6>

      <button onClick={() => setExpand((prev) => !prev)}>
        {expand ? <BiCollapseAlt size={18} /> : <BiExpandAlt size={18} />}
      </button>
      <div style={expand ? { height: "100%" } : defaultSize}>{children}</div>
    </div>
  );

  if (useModalForExpand && expand) {
    return (
      <>
        <div
          className={`pane ${styles["anatomy-pane"]}`}
          style={defaultSize}
        >
          <h6>{title}</h6>
          <button onClick={() => setExpand(true)}>
            <BiExpandAlt size={18} />
          </button>
          <div style={defaultSize}>{children}</div>
        </div>
        <Modal isOpen={expand} onClose={() => setExpand(false)} fullScreen={true}>
          {paneContent}
        </Modal>
      </>
    );
  }

  return paneContent;
}

"use client";

import { BiInfoCircle, BiX } from "react-icons/bi";
import styles from "./anatomy-controls.module.scss";
import { useState } from "react";

export default function Info({ lastUpdated }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className={styles.info}>
      {visible && (
        <div className={`pane  ${styles.info__content}`}>
          <h6
            style={{
              margin: 0,
              display: "inline-flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            Last updated
          </h6>

          <div style={{ marginTop: "0.5rem" }}>
            <h6>{lastUpdated}</h6>
          </div>
        </div>
      )}
      <button
        className={styles.info__button}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        <BiInfoCircle size={18} />
      </button>
    </div>
  );
}

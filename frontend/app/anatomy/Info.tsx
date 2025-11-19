"use client";

import { BiInfoCircle, BiX } from "react-icons/bi";
import styles from "./info.module.scss";

export default function Info({ visible, setVisible, lastUpdated }) {
  return (
    <>
      {visible && (
        <div className={`pane ${styles.info}`}>
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

          {/* <button
            onClick={() => setVisible(false)}
            style={{
              position: "absolute",
              right: "0",
              top: "0",
              backdropFilter: "none",
            }}
          >
            <BiX size={18} />
          </button> */}

          <div>
            <p>{lastUpdated}</p>
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
    </>
  );
}

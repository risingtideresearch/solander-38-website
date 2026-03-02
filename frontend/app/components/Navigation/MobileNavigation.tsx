"use client";
import { useState } from "react";
import styles from "./navigation.module.scss";
import { BiX } from "react-icons/bi";
import { MdOutlineMenu } from "react-icons/md";

export default function MobileNavigation({ children, active }) {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className={`${styles["nav"]} ${styles["mobile-nav"]}`}
      style={open ? { zIndex: 1001 } : {}}
    >
      <button onClick={() => setOpen((prev) => !prev)} aria-expanded={open} aria-label="Toggle navigation menu" style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center'}}>
        <MdOutlineMenu size={18} />
        <h6>{active != 'Solander 38' ? 'Solander 38 / ' : ''}{active}</h6>
      </button>
      {open ? (
        <div className={`pane ${styles["mobile-nav__menu"]}`}>
          {children}
          <button onClick={() => setOpen((prev) => !prev)} aria-label="Close navigation">
            <BiX size={18} />
          </button>
        </div>
      ) : (
        <></>
      )}
    </nav>
  );
}

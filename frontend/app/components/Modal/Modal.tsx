"use client";

import { useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";
import styles from "./modal.module.scss";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  fullScreen?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function Modal({
  isOpen,
  onClose,
  children,
  fullScreen = false,
  className = "",
  style = {},
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={`${styles["modal-overlay"]} ${className}`}
      onClick={onClose}
      style={style}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: fullScreen ? "100%" : "calc(100vw - 1rem)",
          height: fullScreen ? "100vh" : "auto",
          maxWidth: fullScreen ? "100%" : "32rem",
          maxHeight: fullScreen ? "100dvh" : "90dvh",
          overflow: "auto",
          border: '1px solid #000'
        }}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

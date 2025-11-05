"use client";

import { useEffect, ReactNode } from "react";
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
      console.log(e.key);
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

  return (
    <div
      className={`${styles["modal-overlay"]} ${className}`}
      onClick={onClose}
      style={{
        padding: fullScreen ? 0 : "1rem",
        ...style,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: fullScreen ? "100%" : "auto",
          height: fullScreen ? "100vh" : "auto",
          maxWidth: fullScreen ? "100%" : "90vw",
          maxHeight: fullScreen ? "100vh" : "90vh",
          overflow: "auto",
        }}
      >
        {children}
      </div>
    </div>
  );
}

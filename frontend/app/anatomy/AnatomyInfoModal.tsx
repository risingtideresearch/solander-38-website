"use client";

import { LiaRulerHorizontalSolid } from "react-icons/lia";
import { BiX } from "react-icons/bi";
import { MdOutlineFlip } from "react-icons/md";
import { BsArrowsVertical } from "react-icons/bs";
import { Modal } from "../components/Modal/Modal";
import { TransparencyIcon } from "./TransparencyIcon";
import styles from "./anatomy-info-modal.module.scss";

interface AnatomyInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  anatomyDescription?: string;
  lastUpdated?: Date | string;
}

export function AnatomyInfoModal({
  isOpen,
  onClose,
  anatomyDescription,
  lastUpdated,
}: AnatomyInfoModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={` ${styles["info-modal"]}`}>
        <div className={`pane ${styles["info-modal__header"]}`}>
          <h4>Anatomy</h4>
          <button
            aria-label="Close"
            onClick={onClose}
            className={styles["info-modal__close"]}
          >
            <BiX size={20} />
          </button>
        </div>
        <div className={`pane ${styles["info-modal__body"]}`}>
          {anatomyDescription
            ?.split("\n")
            .map((line, i) => <p key={i}>{line}</p>)}
          <p>
            View sections of model by system or associated story.
          </p>
          <p className={styles["mobile-message"]}>
            For the best experience, visit on a larger screen.
          </p>
          <div className={styles["info-modal__legend"]}>
            {[
              { icon: <LiaRulerHorizontalSolid size={18} />, label: "Toggle scale lines" },
              { icon: <h6 style={{ margin: 0 }}>FT</h6>, label: "Toggle units" },
              { icon: <TransparencyIcon on={true} />, label: "Toggle body transparency" },
              { icon: <MdOutlineFlip size={18} />, label: "Toggle clipping planes" },
              { icon: <BsArrowsVertical size={18} style={{ transform: 'rotate(-45deg)'}} />, label: "Rotate clipping plane axis" },
            ].map(({ icon, label }) => (
              <div key={label} className={styles["info-modal__legend-item"]}>
                <span className={styles["info-modal__legend-icon"]}>{icon}</span>
                <p>{label}</p>
              </div>
            ))}
          </div>
          <p style={{ marginTop: "1rem" }}>
            Clipping planes slice the model along an axis, allowing you to see inside. Use the slider to adjust the cut positions, and rotate to change the axis (stern to bow, port to starboard, or keel to deck).
          </p>
          {lastUpdated && (
            <p className={styles["info-modal__updated"]}>
              Model last updated {new Date(lastUpdated).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}

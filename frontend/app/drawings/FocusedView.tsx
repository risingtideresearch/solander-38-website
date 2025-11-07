"use client";
import { useEffect } from "react";
import {
  LiaArrowLeftSolid,
  LiaArrowRightSolid,
  LiaDownloadSolid,
} from "react-icons/lia";
import { cleanFilename } from "./util";
import styles from "./styles.module.scss";
import imageSetStyles from "./../components/image-set.module.scss";
import { BiCollapseAlt, BiLink } from "react-icons/bi";
import { Image } from "../components/Image";
import { Modal } from "../components/Modal/Modal";

function parseDateFromDescription(str: string | null | undefined): Date | null {
  if (!str) return null;

  const match = str.match(/date:\s*(\d{4}-\d{2}-\d{2})/);
  if (!match || !match[1]) return null;

  const dateValue = match[1];
  const [year, month, day] = dateValue.split("-").map(Number);

  const date = new Date(year, month - 1, day);

  if (isNaN(date.getTime())) return null;

  return date;
}

function getSanityImageDate(asset): string {
  let date: Date | null = null;

  if (asset._createdAt) {
    date = new Date(asset._createdAt);
  }

  const { exif } = asset.metadata;

  if (exif?.DateTimeOriginal) {
    date = new Date(exif.DateTimeOriginal);
  } else if (asset.description) {
    const parsedDate = parseDateFromDescription(asset.description);
    if (parsedDate) {
      date = parsedDate;
    }
  }

  return date ? date.toLocaleDateString() : "";
}

function getSanityImageId(asset): string {
  return "IM-" + asset._key.slice(0, 5).toUpperCase();
}

export function FocusedView({
  asset,
  onPrev,
  onNext,
  onClose,
  index,
  all,
  popover = false,
  title = "",
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && index > 0) {
        onPrev();
      } else if (e.key === "ArrowRight" && index < all.length - 1) {
        onNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onPrev, onNext, index, all.length]);

  if (!asset) {
    return <></>;
  }

  const total = all.length;
  const isSanityImage = asset._type == "image";

  const content = (
    <div
      className={`pane ${styles["focused-view"]} ${popover ? styles["focused-view--popover"] : ""}`}
    >
      <div>
        {popover ? (
          title ? (
            <div className={styles["focused-view__title-row"]}>
              <h6>{title}</h6>
              <button
                className={styles["collapse-button"]}
                onClick={onClose}
              >
                <BiCollapseAlt size={18} />
              </button>
            </div>
          ) : (
            <span></span>
          )
        ) : null}

        <div>
          <div className={styles["focused-view__grid"]}>
            <div className={styles["focused-header"]}>
              <div className={styles["focused-header__metadata"]}>
                {isSanityImage ? (
                  <h6>
                    <span>{getSanityImageId(asset)}</span>
                    <span>{getSanityImageDate(asset.asset)}</span>
                    <span>{asset.group}</span>
                  </h6>
                ) : (
                  <h6>
                    <span>{asset.id}</span>
                    <span>
                      {" "}
                      {asset.date_info ? asset.date_info.date : "<no date>"}
                    </span>
                    <span>{asset.group}</span>
                    <span>HJN</span>
                  </h6>
                )}
              </div>
            </div>
            <div className={styles["focused-view__nav-buttons"]}>
              <button
                className={`${styles["nav-button"]} ${styles["nav-button--left"]}`}
                onClick={onPrev}
                disabled={index === 0}
              >
                <LiaArrowLeftSolid size={14} /> {cleanFilename(all[index - 1])}
              </button>
              <button
                className={`${styles["nav-button"]} ${styles["nav-button--right"]}`}
                onClick={onNext}
                disabled={index === total - 1}
              >
                {cleanFilename(all[index + 1])} <LiaArrowRightSolid size={14} />
              </button>
            </div>
          </div>
          {isSanityImage ? (
            <>
              <div className={styles["focused-header__title"]}>
                <p>
                  {asset.asset?.title ||
                    asset.asset?.originalFilename ||
                    "<no title>"}
                </p>
              </div>
              <div
                className={`${styles["focused-view__body"]} ${imageSetStyles["image-set--photo"]}`}
              >
                <Image
                  key={(asset as any)._key}
                  src={asset}
                  alt={"todo: add alt text"}
                />
              </div>
            </>
          ) : (
            <>
              <div className={styles["focused-header__title"]}>
                <p>{cleanFilename(asset)}</p>
                <a href={`/drawings/file/${asset.uuid}`}>
                  <BiLink size={18} />
                </a>
                <a
                  download
                  href={encodeURIComponent(
                    asset.source_pdf_full_path.replace(
                      "../frontend/public/drawings",
                      "",
                    ),
                  )}
                >
                  <h6>PDF&nbsp;</h6>
                  <LiaDownloadSolid />
                </a>
              </div>
              <div className={styles["focused-view__body"]}>
                <div className={styles["focused-view__image-container"]}>
                  <img
                    className={styles["focused-image"]}
                    src={asset.rel_path}
                    height={asset.height}
                    width={asset.width}
                    loading="lazy"
                  />
                  <p className={`${styles["focused-view__uuid-label"]} uppercase-mono`}>
                    {asset.uuid}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  if (popover) {
    return (
      <Modal isOpen={true} onClose={onClose} fullScreen={true}>
        {content}
      </Modal>
    );
  }

  return content;
}

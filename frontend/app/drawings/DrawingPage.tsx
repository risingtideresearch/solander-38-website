import styles from "./drawings.module.scss";
import DrawingMetadata from "./DrawingMetadata";
import SubNav from "../components/Navigation/SubNav";
import { URLS } from "../components/Navigation/Navigation";
import Image from "next/image";

export function DrawingPage({ asset, next, prev, drawingsArticleDictionary }) {
  if (!asset) {
    return <></>;
  }

  return (
    <>
      <SubNav prev={prev} next={next} urlPrefix={`${URLS.DRAWINGS}/file`} />
      <div className={`section--two-col ${styles["drawing-page"]}`}>
        <div>
          <div style={{ position: "sticky", top: "3rem" }}>
            <DrawingMetadata
              drawing={asset}
              stories={drawingsArticleDictionary[asset.uuid]}
            />
          </div>
        </div>
        <div>
          <div className={styles["drawing-page__body"]}>
            <div
              className={styles["drawing-page__image-container"]}
              style={asset.width && asset.height ? { aspectRatio: `${asset.width} / ${asset.height}` } : undefined}
            >
              <Image
                src={asset.rel_path}
                height={asset.height}
                width={asset.width}
                priority
                alt={`${asset.clean_filename}`}
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

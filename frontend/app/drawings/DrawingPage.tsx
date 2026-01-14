import styles from "./drawings.module.scss";
import DrawingMetadata from "./DrawingMetadata";
import SubNav from "../components/Navigation/SubNav";
import { URLS } from "../components/Navigation/Navigation";

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
            <div className={styles["drawing-page__image-container"]}>
              <img
                className={styles["focused-image"]}
                src={asset.rel_path}
                height={asset.height}
                width={asset.width}
                loading="eager"
                alt={`${asset.clean_filename}`}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

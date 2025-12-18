import styles from "./../drawings/drawings.module.scss";
import { Image } from "../components/Image";
import PhotoMetadata from "./PhotoMetadata";
import SubNav from "../components/SubNav";
import { URLS } from "../components/Navigation";
import RelatedStories from "../drawings/RelatedStories";

export function PhotoPage({ asset, next, prev }) {
  if (!asset) {
    return <></>;
  }

  return (
    <>
      <SubNav prev={prev} next={next} urlPrefix={`${URLS.PHOTOS}/image`} />
      <div className={`section--two-col ${styles["drawing-page"]}`}>
        <div>
          <div style={{ position: "sticky", top: "3rem" }}>
            <PhotoMetadata asset={asset} />
            <div>
              <RelatedStories stories={asset.usedInArticles} />
            </div>
          </div>
        </div>
        <div>
          <div className={styles["drawing-page__body"]}>
            <div className={styles["drawing-page__image-container"]}>
              <Image
                loading="eager"
                src={{ asset: asset }}
                alt={
                  asset.altText ||
                  asset.description ||
                  asset.title ||
                  asset.originalFilename
                }
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

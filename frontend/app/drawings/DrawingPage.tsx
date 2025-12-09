import {
  LiaArrowLeftSolid,
  LiaArrowRightSolid,
  LiaDownloadSolid,
  LiaLinkSolid,
} from "react-icons/lia";
import styles from "./styles.module.scss";
import imageSetStyles from "./../components/image-set.module.scss";
import { Image } from "../components/Image";
import { formatDate } from "../utils";
import DrawingMetadata from "./DrawingMetadata";
import RelatedArticles from "./RelatedArticles";
import DrawingNav from "./DrawingNav";

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

  return date ? formatDate(date) : "";
}

function getSanityImageId(asset): string {
  return "IM-" + asset._key.slice(0, 5).toUpperCase();
}

export function DrawingPage({
  asset,
  next,
  prev,
  handleNext,
  handlePrev,
  drawingsArticleDictionary,
}) {
  if (!asset) {
    return <></>;
  }

  const isSanityImage = asset._type == "image";

  return (
    <>
      <DrawingNav
        prev={prev}
        next={next}
        handlePrev={handlePrev}
        handleNext={handleNext}
      />
      <div className={`section--two-col ${styles["drawing-page"]}`}>
        <div>
          <div style={{ position: "sticky", top: "3rem" }}>
            <DrawingMetadata drawing={asset} />
            <RelatedArticles
              uuid={asset.uuid}
              drawingsArticleDictionary={drawingsArticleDictionary}
            />
          </div>
        </div>
        <div>
          <div>
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
                  className={`${styles["drawing-page__body"]} ${imageSetStyles["image-set--photo"]}`}
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
                <div className={styles["drawing-page__body"]}>
                  <div className={styles["drawing-page__image-container"]}>
                    <img
                      className={styles["focused-image"]}
                      src={asset.rel_path}
                      height={asset.height}
                      width={asset.width}
                      loading="lazy"
                      alt={asset}
                    />
                    {/* <p
                      className={`${styles["drawing-page__uuid-label"]} uppercase-mono`}
                    >
                      {asset.uuid}
                    </p> */}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

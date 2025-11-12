import { LiaDownloadSolid, LiaLinkSolid } from "react-icons/lia";
import styles from "./styles.module.scss";
import imageSetStyles from "./../components/image-set.module.scss";
import { Image } from "../components/Image";
import { formatDate } from "../utils";

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

export function DrawingPage({ asset }) {
  if (!asset) {
    return <></>;
  }

  const isSanityImage = asset._type == "image";

  const content = (
    <div className={`pane ${styles["focused-view"]}`}>
      <div>
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
                  // <h6>
                  //   <span>{asset.id}</span>
                  //   <span>
                  //     {" "}
                  //     {asset.date_info ? asset.date_info.date : "<no date>"}
                  //   </span>
                  //   <span>{asset.group}</span>
                  //   <span>HJN</span> 
                  // </h6>
                  <></>
                )}
              </div>
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
                <p>{asset.clean_filename}</p>
                <a href={`/drawings/file/${asset.uuid}`}>
                  <LiaLinkSolid size={18} />
                </a>
                <a
                  download
                  href={
                    "/drawings/" +
                    encodeURIComponent(
                      asset.source_pdf_full_path.replace(
                        "../frontend/public/drawings",
                        "",
                      ),
                    )
                  }
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
                    alt={asset}
                  />
                  <p
                    className={`${styles["focused-view__uuid-label"]} uppercase-mono`}
                  >
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

  return content;
}

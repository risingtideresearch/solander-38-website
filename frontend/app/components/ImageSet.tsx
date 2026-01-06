import galleryStyles from "./../components/gallery.module.scss";
import { DrawingCard } from "../drawings/DrawingCard";
import { Image } from "../components/Image";
import { Drawing } from "../drawings/types";
import styles from "./image-set.module.scss";
import { SanityAsset } from "@sanity/image-url/lib/types/types";
import { URLS } from "./Navigation/Navigation";
import { getPhotoURL } from "../photos/util";

interface ImageSetProps {
  assets: unknown[];
  title?: string;
}

export default function ImageSet({ assets, title }: ImageSetProps) {
  return (
    <div className={`${styles["image-set"]}`}>
      {title && <h4>{title}</h4>}
      <div
        className={`${galleryStyles.gallery} ${galleryStyles.gallery__page} ${assets.length == 1 ? styles.single : ""}`}
      >
        {assets.map((asset, index) =>
          (asset as SanityAsset)._type === "image" ? (
            <div
              key={asset._key}
              className={`${styles.photo} ${
                asset.asset.metadata?.dimensions?.height /
                  asset.asset.metadata?.dimensions?.width >
                1.1
                  ? " image-set--portrait"
                  : ""
              }`}
            >
              <a href={getPhotoURL(asset.asset)}>
                <Image
                  key={(asset as any)._key}
                  src={asset}
                  alt={asset.altText || "todo: add alt text"}
                />
              </a>
            </div>
          ) : (
            <div
              key={(asset as any).id}
              className={
                asset.height / asset.width > 1.1 ? " image-set--portrait" : ""
              }
            >
              <DrawingCard drawing={asset as Drawing} hideMetadata={true} />
            </div>
          ),
        )}
      </div>
    </div>
  );
}

import drawingStyles from "./../drawings/styles.module.scss";
import { DrawingCard } from "../drawings/DrawingCard";
import { Image } from "../components/Image";
import { Drawing } from "../drawings/types";
import styles from "./image-set.module.scss";
import { SanityAsset } from "@sanity/image-url/lib/types/types";

interface ImageSetProps {
  assets: unknown[];
  title?: string;
}

export default function ImageSet({ assets, title }: ImageSetProps) {
  return (
    <div
      className={`${styles["image-set"]}`}
    >
      {title && <h4>{title}</h4>}
      <div
        className={`${drawingStyles.gallery} ${drawingStyles.gallery__page} ${assets.length == 1 ? styles.single : ""}`}
      >
        {assets.map((asset, index) =>
          (asset as SanityAsset)._type === "image" ? (
            <div key={asset._key} className={styles.photo}>
              <Image
                key={(asset as any)._key}
                src={asset}
                alt={asset.altText || "todo: add alt text"}
              />
            </div>
          ) : (
            <DrawingCard key={(asset as any).id} drawing={asset as Drawing} />
          ),
        )}
      </div>
    </div>
  );
}

import drawingStyles from "./../drawings/styles.module.scss";
import { DrawingCard } from "../drawings/DrawingCard";
import { Image } from "../components/Image";
import { Drawing } from "../drawings/types";
import styles from "./image-set.module.scss";

interface ImageSetProps {
  assets: unknown[];
  title?: string;
}

export default function ImageSet({ assets, title }: ImageSetProps) {
  return (
    <>
      <div>
        {title && <h3>{title}</h3>}
        <div
          className={drawingStyles.gallery}
        >
          {assets.map((asset, index) =>
            (asset as any)._type === "image" ? (
              <div key={asset._key} className={styles["image-set--photo"]}>
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
    </>
  );
}

import { formatDate } from "../utils";
import styles from "./../stories/article.module.scss";
import RelatedStories from "../drawings/RelatedStories";

export default function PhotoMetadata({ asset, stories }) {
  const system = asset.usedInArticles[0]?.section || {};
  return (
    <div className={`${styles.metadata}`}>
      <h6>Name</h6>
      <p className="font-sans">{asset.title || asset.originalFilename}</p>

      {asset.metadata.date ? (
        <>
          <h6>Date</h6>
          <h6>{formatDate(asset.metadata.date)}</h6>
        </>
      ) : (
        <></>
      )}
      <h6>System</h6>
      <h6>
        <a href={`/photos/${system.slug}`}>{system.name}</a>
      </h6>
      {asset.description ? (
        <>
          <h6>Desc</h6>
          <p className="font-sans">{asset.description}</p>
        </>
      ) : (
        <></>
      )}
      <RelatedStories stories={stories} />
    </div>
  );
}

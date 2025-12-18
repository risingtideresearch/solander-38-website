import { formatDate } from "../utils";
import styles from "./../stories/article.module.scss";

export default function PhotoMetadata({ asset }) {
  const system = asset.usedInArticles[0]?.section || {};
  return (
    <div className={`${styles.metadata}`}>
      <h6>Name</h6>
      <p style={{ fontSize: '0.75rem', lineHeight: 1.2}}>{asset.title || asset.originalFilename}</p>
      {asset.description ? (
        <>
          <h6>Desc</h6>
          <p style={{ fontSize: '0.75rem', lineHeight: 1.2}}>{asset.description}</p>
        </>
      ) : (
        <></>
      )}
      <h6>Date</h6>
      <h6>{asset.metadata.date ? formatDate(asset.metadata.date) : "—"}</h6>
      <h6>System</h6>
      <h6>
        <a href={`/photos/${system.slug}`}>{system.name}</a>
      </h6>
    </div>
  );
}

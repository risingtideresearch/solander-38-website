import { DrawingsArticleDictionary } from "./util";

interface RelatedArticlesProps {
  uuid: string;
  drawingsArticleDictionary: DrawingsArticleDictionary;
}

export default function RelatedArticle({
  uuid,
  drawingsArticleDictionary,
}: RelatedArticlesProps) {
  if (drawingsArticleDictionary[uuid]) {
    return (
      <div
        className="pane"
        style={{
          border: "1px solid",
          position: "fixed",
          top: "6rem",
          left: "0.5rem",
          width: "15rem",
          padding: "0.5rem",
          zIndex: 100
        }}
      >
        <h6>Related articles</h6>
        <div>
          {drawingsArticleDictionary[uuid].map((article) => {
            return (
              <a
                href={`/article/${article.slug}`}
                style={{ marginTop: "0.5rem", display: "block" }}
                key={article.slug}
              >
                {article.title}
              </a>
            );
          })}
        </div>
      </div>
    );
  }
  return <div></div>;
}

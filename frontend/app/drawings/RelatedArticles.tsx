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
          borderBottom: "none",
          position: "fixed",
          top: "6rem",
          left: "0.5rem",
          width: "15rem",
          zIndex: 100,
        }}
      >
        <h6 style={{ padding: "0.5rem" }}>Related articles</h6>
        <div style={{ borderTop: "1px solid" }}>
          {drawingsArticleDictionary[uuid].map((article) => {
            return (
              <a
                href={`/article/${article.slug}`}
                style={{
                  padding: "0.5rem",
                  display: "block",
                  borderBottom: "1px solid",
                }}
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

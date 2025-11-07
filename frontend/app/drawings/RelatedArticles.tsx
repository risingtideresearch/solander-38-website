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
        style={{
          border: "1px solid",
          borderBottom: "none",
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
                <h6 style={{margin: '0 0 0.25rem 0'}}>{article.section.name}</h6>
                <span>{article.title}</span>
              </a>
            );
          })}
        </div>
      </div>
    );
  }
  return <div></div>;
}

import { LiaLongArrowAltRightSolid } from "react-icons/lia";
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
        <div style={{ borderTop: "1px solid", borderBottom: "1px solid" }}>
          {drawingsArticleDictionary[uuid].map((article) => {
            return (
              <div
                key={article._id}
                style={{
                  padding: "0.5rem",
                }}
              >
                <a
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                  }}
                  href={`/article/${article.slug}`}
                >
                  {article.title}
                  <LiaLongArrowAltRightSolid size={18} />
                </a>
                {/* <p style={{ margin: 0, fontSize: "0.75rem" }}>
                  {article.subtitle}
                </p> */}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return <div></div>;
}

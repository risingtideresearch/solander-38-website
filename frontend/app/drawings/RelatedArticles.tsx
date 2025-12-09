import { LiaLongArrowAltRightSolid } from "react-icons/lia";
import { DrawingsArticleDictionary } from "./util";
import styles from "./../stories/page.module.scss";

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
        // className={styles.page__metadata}
        style={{
          border: "1px solid",
          position: "static",
          margin: "1rem 0.5rem",
        }}
      >
        {/* {drawingsArticleDictionary[uuid].map((article) => {
          return (
            <div key={article._id}>
              <h6>Article</h6>
              <a href={`/stories/${article.slug}`}><h6>{article.title}</h6></a> 
            </div>
          );
        })}
      </div> */}
        <h6 style={{ padding: "0.5rem" }}>Stories</h6>
        <div style={{ borderTop: "1px solid"}}>
          {drawingsArticleDictionary[uuid].map((article) => {
            return (
              <div
                key={article._id}
                style={{
                  padding: "0.5rem",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    lineHeight: "1.2em",
                    textWrap: "initial",
                  }}
                >
                  <a
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                    href={`/stories/${article.slug}`}
                  >
                    {article.title}
                    <LiaLongArrowAltRightSolid size={18} />
                  </a>
                </p>
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

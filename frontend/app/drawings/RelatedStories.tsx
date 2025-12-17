import { LiaLongArrowAltRightSolid } from "react-icons/lia";
import { Article } from "@/sanity/sanity.types";

interface RelatedArticlesProps {
  stories: Array<Article>;
}

export default function RelatedStories({ stories }: RelatedArticlesProps) {
  if (stories && stories.length > 0) {
    return (
      <div
        className="pane"
        style={{
          border: "1px solid",
          position: "static",
          margin: "1rem 0 1rem 0.5rem",
        }}
      >
        <h6 style={{ padding: "0.5rem" }}>Stories</h6>
        <div style={{ borderTop: "1px solid" }}>
          {stories.map((story: Article) => {
            return (
              <div
                key={story._id}
                style={{
                  margin: "0.5rem",
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
                      lineHeight: "1.2em",
                      fontSize: "0.875rem",
                    }}
                    href={`/stories/${story.slug}`}
                  >
                    {story.title}
                    <LiaLongArrowAltRightSolid size={18} style={{flexShrink: 0}} />
                  </a>
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return <div></div>;
}

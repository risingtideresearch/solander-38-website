import { LiaLongArrowAltRightSolid } from "react-icons/lia";
import { Article } from "@/sanity/sanity.types";

interface RelatedArticlesProps {
  stories: Array<Article>;
}

export default function RelatedStories({ stories }: RelatedArticlesProps) {
  if (stories && stories.length > 0) {
    return (
      <div
        style={{
          display: "flex",
          // alignItems: "center",
          justifyContent: "space-between",
          gap: "0.5rem",
        }}
      >
        <h6 style={{ padding: "0.5rem" }}>Stories</h6>
        <div>
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
                      justifyContent: "flex-end",
                      textAlign: "right",
                      gap: "0.5rem",
                      lineHeight: "1rem",
                      fontSize: "0.8125rem",
                    }}
                    href={`/stories/${story.slug}`}
                  >
                    {story.title}
                    <LiaLongArrowAltRightSolid
                      size={18}
                      style={{ flexShrink: 0 }}
                    />
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

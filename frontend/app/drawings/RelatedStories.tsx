import { LiaLongArrowAltRightSolid } from "react-icons/lia";
import { Article } from "@/sanity/sanity.types";

interface RelatedArticlesProps {
  stories?: Array<Article>;
}

export default function RelatedStories({ stories }: RelatedArticlesProps) {
  if (stories && stories.length > 0) {
    return (
      <>
        <h6>Stories</h6>
        <div style={{flexDirection: 'column', gap: '0.375rem', alignItems: 'flex-end'}}>
          {stories.map((story: Article) => {
            return (
              <div key={story._id}>
                <p
                  className="font-sans"
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
      </>
    );
  }
  return <div></div>;
}

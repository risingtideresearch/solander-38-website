import { LiaLongArrowAltRightSolid } from "react-icons/lia";
import { Article } from "@/sanity/sanity.types";
import { fetchArticleIdMap } from "@/sanity/lib/utils";

interface RelatedArticlesProps {
  stories?: Array<Article>;
}

export default async function RelatedStories({
  stories,
}: RelatedArticlesProps) {
  if (!stories || stories.length === 0) return <div></div>;

  const articleIdMap = await fetchArticleIdMap();

  return (
    <>
      <h6>Stories</h6>
      <div style={{ flexDirection: "column", alignItems: "flex-end" }}>
        {stories.map((story: Article) => (
          <div key={story._id}>
            <p
              style={{
                margin: 0,
                lineHeight: "1.2em",
                textWrap: "initial",
                display: "flex",
                alignItems: "flex-end",
                gap: "0.5rem",
              }}
            >
              {articleIdMap[story._id] && (
                <span
                  style={{
                    color: "var(--muted)",
                    fontVariantNumeric: "tabular-nums",
                    flexShrink: 0,
                    fontSize: "0.75rem",
                  }}
                >
                  {articleIdMap[story._id]}
                </span>
              )}
              <a
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  textAlign: "right",
                  gap: "0.25rem",
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
        ))}
      </div>
    </>
  );
}

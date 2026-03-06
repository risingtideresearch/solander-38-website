import { Article } from "@/sanity/sanity.types";
import { fetchArticleIdMap } from "@/sanity/lib/utils";
import styles from "./related-stories.module.scss";

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
      <div className={styles.related_stories}>
        {stories.map((story: Article) => (
          <div key={story._id}>
            <p>
              {articleIdMap[story._id] && (
                <span className={styles.related_stories__id}>
                  {articleIdMap[story._id]}
                </span>
              )}
              <a href={`/stories/${story.slug}`}>
                {story.title}
                {/* <LiaLongArrowAltRightSolid size={18} /> */}
              </a>
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

import { fetchArticleIdMap, fetchPeople } from "@/sanity/lib/utils";
import { sortPeople, formatDate } from "../utils";
import articleStyles from "../stories/articles.module.scss";
import styles from "./people.module.scss";
import { getDrawingsManifest } from "../manifest-util";
import { URLS } from "../components/Navigation/Navigation";
import { Image } from "../components/Image";
import { LiaArrowUpSolid } from "react-icons/lia";

export default async function Page() {
  const people = await fetchPeople();
  const drawings = getDrawingsManifest();
  const articleIdMap = await fetchArticleIdMap();

  const getDrawingCount = (slug: string) =>
    drawings.files.filter((file) => file.author?.slug === slug).length;

  const sorted = sortPeople(people.data);

  return (
    <div className={styles.people}>
      <h1>People</h1>
      <div className={styles.table}>
        {sorted.map((person: any, index: number) => {
          const authored: any[] = person.articlesAsAuthor;
          const mentioned: any[] = person.articlesMentioned;
          const drawingCount = getDrawingCount(person.slug?.current);

          const sortedArticles = (list: any[]) =>
            [...list].sort((a, b) =>
              articleIdMap[a._id]?.localeCompare(articleIdMap[b._id]),
            );

          return (
            <div
              key={person._id}
              id={person.slug?.current}
              className={styles.row}
            >
              <div className={styles.photo}>
                {person.image ? (
                  <Image
                    src={person.image}
                    alt={person.name}
                    square={true}
                    width={160}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                ) : (
                  <div className={styles.noPhoto} />
                )}
              </div>

              <div className={`${styles.cell} ${styles["cell--name"]}`}>
                {person.name}
              </div>

              <div className={styles.cell}>{person.role}</div>

              <div className={`${styles.cell} ${styles.list}`}>
                {person.affiliations?.map((item: any) =>
                  item.url ? (
                    <p key={item.url}>
                      <a href={item.url} target="_blank">
                        {item.label ||
                          item.url.replace("https://", "").replace(/\/$/, "")}
                        <LiaArrowUpSolid
                          style={{
                            transform: "rotate(45deg)",
                            marginLeft: "0.2rem",
                          }}
                          size={12}
                        />
                      </a>
                    </p>
                  ) : (
                    <p key={item.label}>{item.label}</p>
                  ),
                )}
              </div>

              <div className={styles.cell}>
                {[
                  ...sortedArticles(authored),
                  ...sortedArticles(mentioned),
                ].map((article: any) => (
                  <div
                    key={article._id}
                    className={`${articleStyles["article-header"]} ${articleStyles["article-header--compact"]}`}
                  >
                    <h6>{articleIdMap[article._id]}</h6>
                    <a
                      href={`/stories/${article.slug}`}
                      className={articleStyles["article-title"]}
                    >
                      <p>{article.title}</p>
                      <div></div>
                      <h6>
                        {formatDate(
                          article.effectiveDate ?? article._updatedAt,
                        )}
                      </h6>
                    </a>
                  </div>
                ))}

                {drawingCount > 0 && (
                  <div
                    className={`${articleStyles["article-header"]} ${articleStyles["article-header--compact"]}`}
                  >
                    <h6>&nbsp;</h6>
                    <a
                      href={URLS.DRAWINGS}
                      className={articleStyles["article-title"]}
                    >
                      <p>Drawings</p>
                      <div></div>
                      <h6>{drawingCount} </h6>
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

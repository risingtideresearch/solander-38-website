import { fetchPeople, fetchSections } from "@/sanity/lib/utils";
import styles from "./people.module.scss";

export default async function Page() {
  const people = await fetchPeople();
  const sections = await fetchSections();

  const getArticleId = (slug) => {
    let id = "";
    sections.data.sections.forEach((section) => {
      section.articles.forEach((article) => {
        if (article.slug == slug) {
          id = article.articleId;
        }
      });
    });

    return id;
  };

  return (
    <div className={styles.people}>
      {/* <TableOfContents
        sections={sections?.data.sections || []}
        modes={["system", "material"]}
        materials={materials_index.unique_materials}
      > */}
      <main>
        <section className="section--two-col">
          <div>
            {/* <h6 style={{ textAlign: "right", margin: "0.625rem 0" }}>People</h6> */}
          </div>
          <div style={{ padding: "0.5rem" }}>
            {people.data
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((person) => {
                return (
                  <div
                    key={person._id}
                    style={{
                      margin: "0.375rem 0 2rem 0",
                    }}
                  >
                    <p style={{ margin: 0 }}>{person.name}</p>
                    {person.articlesAsAuthor.length > 0 ? (
                      <div>
                        <p style={{ margin: 0 }}>
                          {person.articlesAsAuthor
                            .sort((a, b) =>
                              getArticleId(a.slug).localeCompare(
                                getArticleId(b.slug),
                              ),
                            )
                            .map((article, i, all) => (
                              <div style={{ margin: 0 }} key={article._id}>
                                <a href={`/stories/${article.slug}`}>
                                  <span
                                    style={{
                                      fontSize: "0.75rem",
                                      textTransform: "uppercase",
                                    }}
                                  >
                                    {getArticleId(article.slug)}
                                  </span>{" "}
                                  {article.title}
                                </a>
                              </div>
                            ))}
                        </p>
                      </div>
                    ) : (
                      <div></div>
                    )}
                    {person.articlesMentioned.length > 0 ? (
                      <div>
                        <p style={{ margin: 0 }}>
                          {person.articlesMentioned
                            .sort((a, b) =>
                              getArticleId(a.slug).localeCompare(
                                getArticleId(b.slug),
                              ),
                            )
                            .map((article, i, all) => (
                              <div style={{ margin: 0 }} key={article._id}>
                                <a href={`/stories/${article.slug}`}>
                                  <span
                                    style={{
                                      fontSize: "0.75rem",
                                      textTransform: "uppercase",
                                    }}
                                  >
                                    {getArticleId(article.slug)}
                                  </span>{" "}
                                  {article.title}
                                </a>
                              </div>
                            ))}
                        </p>
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                );
              })}
          </div>
        </section>
      </main>
      {/* </TableOfContents> */}
    </div>
  );
}

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
          <div style={{ margin: "0 0 -1px -1px" }}>
            {people.data
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((person) => {
                return (
                  <div key={person._id} className={styles.person}>
                    <p
                      style={{
                        fontWeight: 600,
                      }}
                    >
                      {person.name}
                    </p>
                    {person.role ? (
                      <div>
                        <h6>Role</h6>
                        <p>{person.role}</p>
                      </div>
                    ) : (
                      <></>
                    )}
                    {person.link ? (
                      <div>
                        <h6>Website</h6>
                        <p>
                          <a href={person.link.url} target="_blank">
                            {person.link.label ||
                              person.link.url
                                .replace("https://", "")
                                .replace(".com/", ".com")}
                          </a>
                        </p>
                      </div>
                    ) : (
                      <></>
                    )}
                    {person.articlesAsAuthor.length > 0 ? (
                      <div>
                        <h6>Author</h6>
                        <div>
                          {person.articlesAsAuthor
                            .sort((a, b) =>
                              getArticleId(a.slug).localeCompare(
                                getArticleId(b.slug),
                              ),
                            )
                            .map((article, i, all) => (
                              <p style={{ margin: 0 }} key={article._id}>
                                <a
                                  style={{
                                    display: "grid",
                                    gridTemplateColumns: "2rem 1fr",
                                  }}
                                  href={`/stories/${article.slug}`}
                                >
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
                              </p>
                            ))}
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                    {person.articlesMentioned.length > 0 ? (
                      <div>
                        <h6>Part of</h6>
                        <div>
                          {person.articlesMentioned
                            .sort((a, b) =>
                              getArticleId(a.slug).localeCompare(
                                getArticleId(b.slug),
                              ),
                            )
                            .map((article, i, all) => (
                              <p style={{ margin: 0 }} key={article._id}>
                                <a
                                  style={{
                                    display: "grid",
                                    gridTemplateColumns: "2rem 1fr",
                                  }}
                                  href={`/stories/${article.slug}`}
                                >
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
                              </p>
                            ))}
                        </div>
                      </div>
                    ) : (
                      <></>
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

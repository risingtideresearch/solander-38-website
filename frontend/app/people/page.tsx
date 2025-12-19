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
                    <div>
                      <p
                        style={{
                          margin: 0,
                          fontWeight: 600,
                        }}
                      >
                        {person.name}
                      </p>
                    </div>
                    {person.role ? (
                      <div
                        style={{
                          margin: "1rem 0 0 0",
                        }}
                      >
                        <h6>Role</h6>
                        <p style={{ margin: "0 0 0 3rem" }}>{person.role}</p>
                      </div>
                    ) : (
                      <></>
                    )}
                    {person.link ? (
                      <div
                        style={{
                          margin: "1rem 0 0 0",
                        }}
                      >
                        <h6>Website</h6>
                        <p style={{ margin: "0 0 0 3rem" }}>
                          <a href={person.link.url} target="_blank">
                            {person.link.label || person.link.url.replace('https://', '').replace('.com/', '.com')}
                          </a>
                        </p>
                      </div>
                    ) : (
                      <></>
                    )}
                    <div>
                      {person.articlesAsAuthor.length > 0 ? (
                        <div>
                          <h6>Author</h6>
                          <p>
                            {person.articlesAsAuthor
                              .sort((a, b) =>
                                getArticleId(a.slug).localeCompare(
                                  getArticleId(b.slug),
                                ),
                              )
                              .map((article, i, all) => (
                                <div style={{ margin: 0 }} key={article._id}>
                                  <a
                                    style={{
                                      display: "grid",
                                      gridTemplateColumns: "2.5rem 1fr",
                                      marginLeft: "3rem",
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
                                </div>
                              ))}
                          </p>
                        </div>
                      ) : (
                        <div></div>
                      )}
                      {person.articlesMentioned.length > 0 ? (
                        <div>
                          <h6>Part of</h6>
                          <p>
                            {person.articlesMentioned
                              .sort((a, b) =>
                                getArticleId(a.slug).localeCompare(
                                  getArticleId(b.slug),
                                ),
                              )
                              .map((article, i, all) => (
                                <div style={{ margin: 0 }} key={article._id}>
                                  <a
                                    style={{
                                      display: "grid",
                                      gridTemplateColumns: "2.5rem 1fr",
                                      marginLeft: "3rem",
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
                                </div>
                              ))}
                          </p>
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </div>
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

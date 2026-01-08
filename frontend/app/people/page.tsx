import { fetchPeople, fetchSections } from "@/sanity/lib/utils";
import styles from "./people.module.scss";
import { readDrawingsManifest } from "../manifest-util";
import { URLS } from "../components/Navigation/Navigation";

export default async function Page() {
  const people = await fetchPeople();
  const sections = await fetchSections();
  const drawings = await readDrawingsManifest();

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

  const getDrawingCount = (slug) => {
    console.log(slug, drawings.files);
    return drawings.files.filter((file) => file.author?.slug == slug).length;
  };

  return (
    <div className={styles.people}>
      {/* <TableOfContents
        sections={sections?.data.sections || []}
        modes={["system", "material"]}
        materials={materials_index.unique_materials}
      > */}

      <h1
        style={{
          margin: "8rem auto 0 auto",
          maxWidth: "120rem",
          padding: "0 2rem",
        }}
      >
        People
      </h1>
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
                  <div
                    key={person._id}
                    id={person.slug?.current}
                    className={styles.person}
                  >
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
                        <div>
                          <p>{person.role}</p>
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                    {person.affiliations ? (
                      <div>
                        <h6>Also</h6>
                        <div>
                          {person.affiliations.map((item) => {
                            if (item.url) {
                              return (
                                <p key={item.url}>
                                  <a href={item.url} target="_blank">
                                    {item.label ||
                                      item.url
                                        .replace("https://", "")
                                        .replace(".com/", ".com")}
                                  </a>
                                </p>
                              );
                            }
                            return <p key={item.label}>{item.label}</p>;
                          })}
                        </div>
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
                              <p key={article._id}>
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
                    {getDrawingCount(person.slug?.current) > 0 ? (
                      <div>
                        <h6>Drafted</h6>
                        <div>
                          <h6>
                            <a href={URLS.DRAWINGS}>
                              {getDrawingCount(person.slug?.current)} drawings
                            </a>
                          </h6>
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

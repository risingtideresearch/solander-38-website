import { fetchPeople } from "@/sanity/lib/utils";
import styles from "./people.module.scss";
import { getDrawingsManifest } from "../manifest-util";
import { URLS } from "../components/Navigation/Navigation";
import { Image } from "../components/Image";
import { LiaArrowUpSolid } from "react-icons/lia";

export default async function Page() {
  const people = await fetchPeople();
  const drawings = getDrawingsManifest();

  const getDrawingCount = (slug) => {
    return drawings.files.filter((file) => file.author?.slug == slug).length;
  };

  return (
    <div className={styles.people}>
      <h1
        style={{
          margin: "6rem auto 0 auto",
          maxWidth: "120rem",
          padding: "0 2rem",
        }}
      >
        People
      </h1>
      <main>
        <section className="section--two-col">
          <div></div>
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
                    <div style={{ marginTop: 0, alignItems: "flex-end" }}>
                      <div>
                        {person.image ? (
                          <Image src={person.image} square={true} width={72} />
                        ) : (
                          // <div
                          //   style={{
                          //     width: "5.5rem",
                          //     aspectRatio: 1,
                          //     border: "1px solid var(--border)",
                          //     display: "flex",
                          //     alignItems: "center",
                          //     justifyContent: "center",
                          //   }}
                          // >
                          //   <MdOutlinePerson color="var(--border)" size={24} />
                          // </div>
                          <></>
                        )}
                      </div>

                      <div>
                        <p>
                          <span
                            style={{
                              fontWeight: 600,
                            }}
                          >
                            {person.name}
                          </span>
                          &nbsp;&mdash;&nbsp;{person.role}
                        </p>

                        {person.affiliations ? (
                          <div style={{ marginTop: "1rem" }}>
                            {(person.affiliations || []).map((item) => {
                              if (item.url) {
                                return (
                                  <p key={item.url}>
                                    <a
                                      href={item.url}
                                      style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "0.25rem",
                                      }}
                                      target="_blank"
                                    >
                                      {item.label ||
                                        item.url
                                          .replace("https://", "")
                                          .replace(".com/", ".com")}

                                      <LiaArrowUpSolid
                                        style={{ transform: "rotate(45deg)" }}
                                        size={16}
                                      />
                                    </a>
                                  </p>
                                );
                              }
                              return <p key={item.label}>{item.label}</p>;
                            })}
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                    {/* {person.affiliations ? (
                      <div>
                        <h6>Affiliations</h6>
                        <div>
                          {(person.affiliations || []).map((item) => {
                            if (item.url) {
                              return (
                                <p key={item.url}>
                                  <a href={item.url} target="_blank">
                                    {item.label ||
                                      item.url
                                        .replace("https://", "")
                                        .replace(".com/", ".com")}

                                      <LiaExternalLinkAltSolid size={16} />
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
                    )} */}
                    {person.articlesAsAuthor.length > 0 ? (
                      <div>
                        <h6>Author</h6>
                        <div>
                          {person.articlesAsAuthor.map((article) => (
                            <p key={article._id}>
                              <a
                                style={{
                                  display: "inline",
                                }}
                                href={`/stories/${article.slug}`}
                              >
                                <span
                                  style={{
                                    fontSize: "0.75rem",
                                    textTransform: "uppercase",
                                    marginTop: "0.0625rem",
                                  }}
                                >
                                  {article.section?.name}&nbsp;/&nbsp;
                                </span>
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
                        <h6>Stories</h6>
                        <div>
                          {person.articlesMentioned.map((article) => (
                            <p style={{ margin: 0 }} key={article._id}>
                              <a
                                style={{
                                  display: "inline",
                                }}
                                href={`/stories/${article.slug}`}
                              >
                                <span
                                  style={{
                                    fontSize: "0.75rem",
                                    textTransform: "uppercase",
                                    marginTop: "0.0625rem",
                                  }}
                                >
                                  {article.section?.name}&nbsp;/&nbsp;
                                </span>
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

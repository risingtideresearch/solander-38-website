import { fetchPeople } from "@/sanity/lib/utils";
import styles from "./people.module.scss";
import { getDrawingsManifest } from "../manifest-util";
import { URLS } from "../components/Navigation/Navigation";
import { Image } from "../components/Image";
import { LiaArrowUpSolid, LiaLongArrowAltRightSolid } from "react-icons/lia";
import { MdOutlinePerson } from "react-icons/md";

export default async function Page() {
  const people = await fetchPeople();
  const drawings = getDrawingsManifest();

  const getDrawingCount = (slug) => {
    return drawings.files.filter((file) => file.author?.slug == slug).length;
  };

  return (
    <div className={styles.people}>
      <h1>People</h1>
      <main>
        <section className="section--two-col">
          <div></div>
          <div style={{ margin: "0 0 -1px -1px" }}>
            {people.data
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((person) => {
                const stories = [
                  ...person.articlesAsAuthor,
                  ...person.articlesMentioned,
                ];
                return (
                  <div
                    key={person._id}
                    id={person.slug?.current}
                    className={styles.person}
                  >
                    <div style={{ marginTop: 0, alignItems: "flex-end" }}>
                      <div>
                        {person.image ? (
                          <Image src={person.image} alt={person.name} square={true} width={120} />
                        ) : (
                          <div
                            style={{
                              aspectRatio: 1,
                              border: "1px solid var(--border)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {/* <MdOutlinePerson color="var(--border)" size={24} /> */}
                          </div>
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
                        </p>
                        <h6>{person.role}</h6>
                      </div>
                    </div>
                    {stories.length > 0 ? (
                      <div>
                        <h6>Stories</h6>
                        <div>
                          {stories.map((article, i) => (
                            <p
                              style={i > 0 ? { marginTop: "0.5rem" } : {}}
                              key={article._id}
                            >
                              <a
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "0.25rem",
                                }}
                                href={`/stories/${article.slug}`}
                              >
                                {article.title}
                                <LiaLongArrowAltRightSolid size={16} />
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

                    {person.affiliations ? (
                      <div>
                        <h6>Links</h6>
                        <div>
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

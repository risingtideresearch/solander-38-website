import { fetchPeople, fetchPeoplePage, fetchSystems } from "@/sanity/lib/utils";
import styles from "./people.module.scss";
import { getDrawingsManifest } from "../manifest-util";
import { URLS } from "../components/Navigation/Navigation";
import { Image } from "../components/Image";
import { LiaArrowUpSolid, LiaLongArrowAltRightSolid } from "react-icons/lia";

export default async function Page() {
  const people = await fetchPeople();
  const page = await fetchPeoplePage();
  const { data: systemsData } = await fetchSystems();
  const drawings = getDrawingsManifest();

  const articleIdMap: Record<string, string> = {};
  systemsData.systems?.forEach((system) => {
    system.articles?.forEach((article) => {
      articleIdMap[article._id] = article.articleId;
    });
  });

  const getDrawingCount = (slug) => {
    return drawings.files.filter((file) => file.author?.slug == slug).length;
  };

  const sorted = people.data.sort((a, b) =>
    a.name == "Avi Bryant" ? -1 : a.name.localeCompare(b.name),
  );

  return (
    <div className={styles.people}>
      <h1>People</h1>
      {/* {page.data?.description && <p>{page.data.description}</p>} */}
      <main>
        <section className="section--two-col">
          <div className={styles.sidebar}></div>
          <div className={styles.list}>
            {sorted.map((person, index) => {
              const stories = [
                ...person.articlesAsAuthor,
                ...person.articlesMentioned,
              ];
              const drawingCount = getDrawingCount(person.slug?.current);

              return (
                <div
                  key={person._id}
                  id={person.slug?.current}
                  className={styles.row}
                >
                  <div className={styles.index}>
                    <h6>{String(index + 1).padStart(2, "0")}</h6>
                  </div>

                  <div className={styles.photo}>
                    {person.image ? (
                      <Image
                        src={person.image}
                        alt={person.name}
                        square={true}
                        width={96}
                      />
                    ) : (
                      <div className={styles.noPhoto} />
                    )}
                  </div>

                  <div className={styles.info}>
                    <p className={styles.name}>{person.name}</p>
                    {person.role && (
                      <h6 className={styles.role}>{person.role}</h6>
                    )}
                  </div>

                  <div className={styles.meta}>
                    {stories.length > 0 && (
                      <div className={styles.metaGroup}>
                        <h6>Stories</h6>
                        {stories.sort((a, b) => articleIdMap[a._id].localeCompare(articleIdMap[b._id])).map((article) => (
                          <p key={article._id}>
                            {articleIdMap[article._id] && (
                              <span className={styles.articleId}>
                                {articleIdMap[article._id]}
                              </span>
                            )}
                            <a href={`/stories/${article.slug}`}>
                              {article.title}
                              <LiaLongArrowAltRightSolid size={14} />
                            </a>
                          </p>
                        ))}
                      </div>
                    )}
                    {drawingCount > 0 && (
                      <div className={styles.metaGroup}>
                        <h6>Drawings</h6>
                        <p>
                          <a href={URLS.DRAWINGS}>{drawingCount} drawings <LiaLongArrowAltRightSolid size={14} /></a>
                        </p>
                      </div>
                    )}
                    {person.affiliations && person.affiliations.length > 0 && (
                      <div className={styles.metaGroup}>
                        <h6>Links</h6>
                        {person.affiliations.map((item) =>
                          item.url ? (
                            <p key={item.url}>
                              <a href={item.url} target="_blank">
                                {item.label ||
                                  item.url
                                    .replace("https://", "")
                                    .replace(".com/", ".com")}
                                <LiaArrowUpSolid
                                  style={{ transform: "rotate(45deg)" }}
                                  size={14}
                                />
                              </a>
                            </p>
                          ) : (
                            <p key={item.label}>{item.label}</p>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

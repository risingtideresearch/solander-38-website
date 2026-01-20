import styles from "./articles.module.scss";
import { fetchSystems } from "@/sanity/lib/utils";
import { formatDate } from "../utils";

export default async function Articles({ subtitles }) {
  const { data } = await fetchSystems();

  return (
    <>
      <h1
        style={{
          margin: "6rem auto 0 auto",
          maxWidth: "120rem",
          padding: "0 2rem",
        }}
      >
        Table of contents
      </h1>
      <main className={styles.articles}>
        {(data.systems || []).map((section, i) => (
          <section className="section--two-col" key={section._key}>
            <div></div>
            <div>
              <h6 className={styles["section-title"]}>
                <span>{i + 1}</span>
                <span>{section.name}</span>
              </h6>
              <ol>
                {(section.articles || []).map((article) => (
                  <li key={article._id}>
                    <div className={styles["article-header"]}>
                      <h6>{article.articleId}</h6>
                      <a
                        className={styles["article-title"]}
                        href={`/stories/${article.slug}`}
                        style={{ fontSize: "0.875rem" }}
                      >
                        <p>{article.title}</p>
                        {/* <LiaLongArrowAltRightSolid size={18} /> */}
                        <div></div>
                        <h6>
                          {article.isLive ? (
                            formatDate(article._updatedAt)
                          ) : (
                            <em>in progress</em>
                          )}
                        </h6>
                      </a>
                    </div>
                    <div className={styles["article-subtitle"]}>
                      {subtitles ? <p>{article.subtitle}</p> : null}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        ))}
      </main>
    </>
  );
}

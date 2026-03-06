import styles from "./articles.module.scss";
import { fetchSystems } from "@/sanity/lib/utils";
import { formatDate } from "../utils";
import RangeChart from "../components/RangeChart";
import Image from "next/image";

export default async function Articles({ subtitles }) {
  const { data } = await fetchSystems();

  return (
    <div className={styles.articles}>
      <h1>Table of contents</h1>
      <main>
        {(data.systems || []).map((system, i) => (
          <section className="section--two-col" key={system._key}>
            <div></div>
            <div>
              <h6 className={styles["section-title"]}>
                <span>{i + 1}</span>
                <span>{system.name}</span>
              </h6>
              <ol>
                {(system.articles || []).map((article) => (
                  <li key={article._id}>
                    <div className={styles["article-preview"]}>
                      {article.slug == "range" ? (
                        <RangeChart title={''} />
                      ) : (
                        <Image
                          src={`/preview/${article.slug}.png`}
                          width={1600}
                          height={840}
                          alt={`Model of ${article.title}`}
                        />
                      )}
                    </div>
                    <div className={styles["article-header"]}>
                      <h6>{article.articleId}</h6>
                      <a
                        className={styles["article-title"]}
                        href={`/stories/${article.slug}`}
                        style={{ fontSize: "0.875rem" }}
                      >
                        <p>{article.title}</p>
                        <div></div>
                        <h6>
                          {article.isLive ? (
                            formatDate(article._updatedAt)
                          ) : (
                            <em style={{ color: "var(--muted)" }}>
                              in progress
                            </em>
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
    </div>
  );
}

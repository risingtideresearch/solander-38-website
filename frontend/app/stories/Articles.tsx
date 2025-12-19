import { LiaLongArrowAltRightSolid } from "react-icons/lia";
import styles from "./articles.module.scss";
import { fetchSections } from "@/sanity/lib/utils";

export default async function Articles({ subtitles }) {
  const { data } = await fetchSections();

  return (
    <>
      <h1 style={{margin:  '8rem auto 0 auto', maxWidth: '120rem', padding: '0 2rem'}}>Table of contents</h1>
      <main className={styles.articles}>
        {(data.sections || []).map((section, i) => (
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
                      <p className={styles["article-title"]}>
                        <a
                          href={`/stories/${article.slug}`}
                          style={{ fontSize: "0.875rem" }}
                        >
                          {article.title}
                        </a>
                        <LiaLongArrowAltRightSolid size={18} />
                      </p>
                    </div>
                    <div className={styles["article-subtitle"]}>
                      {!article.isLive ? (
                        <em>In progress</em>
                      ) : subtitles ? (
                        <p>{article.subtitle}</p>
                      ) : null}
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

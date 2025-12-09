import { LiaLongArrowAltRightSolid } from "react-icons/lia";
import styles from "./articles.module.scss";
import { fetchSections } from "@/sanity/lib/utils";

export default async function Articles({ subtitles }) {
  const { data } = await fetchSections();

  return (
    <main className={styles.articles}>
      {(data.sections || []).map((section, i) => (
        <section className="section--two-col" key={section._key}>
          <div className={styles["section-title"]}>
            <h6>
              <span>{i + 1}.</span>
              <span>{section.name}</span>
            </h6>
          </div>
          <div>
            <ol>
              {(section.articles || []).map((article) => (
                <li key={article._id}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "0.5rem 1fr",
                      gap: "0.5rem",
                    }}
                  >
                    <h6
                      style={{
                        display: "block",
                        marginLeft: "-1rem",
                      }}
                    >
                      {article.articleId}
                    </h6>
                    <p
                      style={{
                        margin: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <a href={`/stories/${article.slug}`}>{article.title}</a>
                      <LiaLongArrowAltRightSolid size={18} />
                    </p>
                  </div>
                  <div style={{ marginLeft: "1rem" }}>
                    {subtitles ? (
                      <p style={{ margin: 0, fontSize: "0.875rem" }}>
                        {article.subtitle}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ))}
    </main>
  );
}

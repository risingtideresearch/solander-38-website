import styles from "./page.module.scss";
import { fetchSections } from "@/sanity/lib/utils";

export default async function Articles({ subtitles }) {
  const { data } = await fetchSections();

  return (
    <main className={styles.page} >
      {(data.sections || []).map((section, i) => (
        <section key={section._key} className={styles.page__toc}>
          <h6>
            <span>{i + 1}.</span>
            <span>{section.name}</span>
          </h6>
          <ol>
            {(section.articles || []).map((article) => (
              <div key={article._id} style={{ marginBottom: '1.5rem'}}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "0.5rem 1fr",
                    gap: "0.5rem",
                    margin: "0.5rem 0",
                  }}
                >
                  <h6 style={{ display: "block", marginLeft: "-1rem", marginTop: '0.25rem' }}>
                    {article.articleId}
                  </h6>
                  <a href={`/stories/${article.slug}`}>
                    <h2 style={{ margin: "0" }}>{article.title}</h2>
                  </a>
                </div>
                <div style={{marginLeft: '1rem'}}>{subtitles ? <p>{article.subtitle}</p> : null}</div>
              </div>
            ))}
          </ol>
        </section>
      ))}
    </main>
  );
}

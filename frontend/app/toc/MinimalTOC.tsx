import styles from "./toc.module.scss";

export default function MinimalTOC({ systems, system, url }) {
  return (
    <nav
      aria-label="Table of contents"
      className={`${styles.toc__container} ${styles.minimal}`}
    >
      <div className={`${styles.toc}`}>
        <ol>
          {systems.map((s, i) => {
            return (
              <li key={s.name} data-selected={s.slug == system}>
                <a href={`${url}/${s.slug}`}>
                  <span>{i + 1}.</span>
                  <h6>{s.name}</h6>
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

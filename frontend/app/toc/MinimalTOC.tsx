import styles from './toc.module.scss';

export default function MinimalTOC({ sections, section, url }) {
  return (
    <div className={`${styles.toc__container} ${styles.minimal}`}>
      <div className={`${styles.toc}`}>
        <ol>
          {sections.map((s) => {
            return (
              <li style={{ cursor: "pointer" }} key={s.name}>
                <a href={`${url}/${s.slug}`}>
                  <h6 style={{ fontWeight: s.slug == section ? 600 : '' }}>
                    {s.name}
                  </h6>
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

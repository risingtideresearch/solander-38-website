import styles from './toc.module.scss';

export default function MinimalTOC({ systems, system, url }) {
  return (
    <div className={`${styles.toc__container} ${styles.minimal}`}>
      <div className={`${styles.toc}`}>
        <ol>
          {systems.map((s) => {
            return (
              <li style={{ cursor: "pointer" }} key={s.name}>
                <a href={`${url}/${s.slug}`}>
                  <h6 style={{ fontWeight: s.slug == system ? 600 : '' }}>
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

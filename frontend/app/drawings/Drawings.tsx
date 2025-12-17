import { Drawing } from "./types";
import DrawingsGallery from "./DrawingsGallery";
import { Section } from "@/sanity/sanity.types";
import styles from "./../toc/toc.module.scss";

interface DrawingsProps {
  drawings: {
    files: Array<Drawing>;
  };
  defaultUUID?: string;
  section?: string;
  sections: Array<Section>;
}

export default async function Drawings({
  drawings,
  sections,
  section,
}: DrawingsProps) {
  return (
    <div className="section--two-col">
      <div>
        <div className={styles.toc__container}>
          <div className={`${styles.toc}`}>
            <ol>
              {sections.map((s) => {
                return (
                  <li style={{ cursor: "pointer" }} key={s.name}>
                    <a href={`/drawings/${s.slug}`}>
                      <h6 style={{ fontWeight: s.slug == section ? 600 : 400 }}>
                        {s.name}
                      </h6>
                    </a>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
      <DrawingsGallery drawings={drawings} section={section} />
    </div>
  );
}

import { fetchMaterials } from "@/sanity/lib/utils";
import styles from "./materialTable.module.scss";

export default async function MaterialTable({ materials }) {
  const { data } = await fetchMaterials();

  const descriptions = data.materials.filter(
    (m) => m.description && m.name && materials.indexOf(m.name) > -1,
  );

  if (descriptions.length > 0) {
    return (
      <div>
        <h2 style={{}}>Materials</h2>
        <div className={`${styles.materials}`}>
          {descriptions
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((material) => {
              return (
                <div key={material.name}>
                  <h6>{material.name}</h6>
                  <p className="font-sans">{material.description}</p>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
  return <></>;
}

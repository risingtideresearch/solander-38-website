import { fetchMaterials } from "@/sanity/lib/utils";
import styles from "./materialTable.module.scss";

export default async function MaterialTable({ materials }) {
  const { data } = await fetchMaterials();

  return (
    <div>
      <h2 style={{}}>Materials</h2>
      <div className={`${styles.materials}`}>
        {materials
          .sort((a, b) => a.localeCompare(b))
          .map((material, i, x) => {
            return (
              <div key={material}>
                <h6>{material}</h6>
                <p className="font-sans">
                  {data.materials.find((m) => m.name == material)?.description}
                </p>
              </div>
            );
          })}
      </div>
    </div>
  );
}

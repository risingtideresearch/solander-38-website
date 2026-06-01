import { Canvas3D } from "../anatomy/three-d/Canvas3D";
import AnatomyPane from "./AnatomyPane/AnatomyPane";
import styles from "./inline-model.module.scss";

interface InlineModelProps {
  title: string;
  models: string[];
}

export function InlineModel({ title, models }: InlineModelProps) {
  return (
    <>
      <h4>{title}</h4>
      <AnatomyPane className={styles.pane}>
        <div className={`bg--grid ${styles.canvas}`}>
          <div className={` ${styles.container}`}>
            <Canvas3D
              height="100%"
              filteredLayers={models}
              interaction="limited"
            />
          </div>
        </div>
      </AnatomyPane>
    </>
  );
}

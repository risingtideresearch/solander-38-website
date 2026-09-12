import { Canvas3D } from "../anatomy/three-d/Canvas3D";
import {
  expandModels,
  getMaterialsManifest,
  getModelsByFilename,
} from "../manifest-util";
import AnatomyPane from "./AnatomyPane/AnatomyPane";
import styles from "./inline-model.module.scss";

interface InlineModelProps {
  title: string;
  /** Filenames and "__"-terminated path prefixes, as stored in Sanity */
  models: string[];
  tooltips?: boolean;
}

export function InlineModel({ title, models, tooltips }: InlineModelProps) {
  const layers = expandModels(models);
  return (
    <>
      <h4>{title}</h4>
      <AnatomyPane className={styles.pane}>
        <div className={`bg--grid ${styles.canvas}`}>
          <div className={` ${styles.container}`}>
            <Canvas3D
              height="100%"
              filteredLayers={layers}
              interaction="limited"
              lighting="object"
              zoom
              pan
              settings={{ scalingLines: true }}
              tooltips={tooltips}
              partHover={tooltips}
              memoModels={tooltips ? getModelsByFilename(layers) : undefined}
              materials={
                tooltips ? getMaterialsManifest().material_index : undefined
              }
            />
          </div>
        </div>
      </AnatomyPane>
    </>
  );
}

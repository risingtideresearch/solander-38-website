import drawingsManifest from "@/public/drawings/output_images/conversion_manifest.json";
import modelManifest from "@/public/models/export_manifest.json";
import materialsManifest from "@/public/script-output/material_index_simple.json";
import { ModelManifest } from "./anatomy/three-d/util";

export function getDrawingsManifest() {
  return drawingsManifest;
}

export function getModelManifest(): ModelManifest {
  return modelManifest as unknown as ModelManifest;
}

export function getMaterialsManifest() {
  return materialsManifest;
}

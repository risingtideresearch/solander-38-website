import drawingsManifest from "@/public/drawings/output_images/conversion_manifest.json";
import modelManifest from "@/public/models/export_manifest.json";
import jigManifest from "@/public/models-jig/export_manifest.json";
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

const jigFilenames = new Set(jigManifest.exported_layers.map((l) => l.filename));

export function getModelURL(filename: string): string {
  if (jigFilenames.has(filename)) {
    const folder = (jigManifest.export_info as Record<string, unknown>).models_folder as string ?? "models-jig";
    return "/" + folder + "/" + filename;
  }
  const folder = (modelManifest.export_info as Record<string, unknown>).models_folder as string ?? "models";
  return "/" + folder + "/" + filename;
}

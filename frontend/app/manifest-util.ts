import drawingsManifest from "@/public/drawings/output_images/conversion_manifest.json";
import modelManifest from "@/public/models/export_manifest.json";
import materialsManifest from "@/public/script-output/material_index_simple.json";

export function getDrawingsManifest() {
  return drawingsManifest;
}

export function getModelManifest() {
  return modelManifest;
}

export function getMaterialsManifest() {
  return materialsManifest;
}

// import { promises as fs } from "fs";
// import path from "path";

export async function readJsonFile<T = any>(jsonPath: string): Promise<T> {
  return {
    files: [],
    "unique_materials": [],
    exported_layers: []
  }
  // try {
  //   const filePath = path.join(process.cwd(), jsonPath);
  //   const fileData = await fs.readFile(filePath, "utf8");
  //   return JSON.parse(fileData);
  // } catch (error) {
  //   throw new Error(`Failed to read JSON file at ${jsonPath}: ${error}`);
  // }
}

export async function readDrawingsManifest() {
  return readJsonFile("public/drawings/output_images/conversion_manifest.json");
}

export async function readModelManifest() {
  return readJsonFile("public/models/export_manifest.json");
}

export async function readMaterialsManifest() {
  return readJsonFile("public/script-output/material_index_simple.json");
}

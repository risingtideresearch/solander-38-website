import fs from "fs/promises";
import path from "path";

export async function readJsonFile<T = any>(
  relativePath: string,
  basePath: string = process.cwd(),
): Promise<T> {
  try {
    const filePath = path.join(basePath, relativePath);
    const fileData = await fs.readFile(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    throw new Error(`Failed to read JSON file at ${relativePath}: ${error}`);
  }
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

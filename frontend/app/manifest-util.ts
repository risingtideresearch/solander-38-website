import fs from "fs/promises";
import path from "path";

export async function readJsonFile<T = any>(
  jsonPath: string,
): Promise<T> {
  try {
    const isProduction = process.env.NODE_ENV === "production";
    const basePath = isProduction 
      ? path.join(process.cwd(), ".next/server/app") 
      : process.cwd();
    
    const adjustedPath = isProduction 
      ? jsonPath.replace(/^public\//, "")
      : jsonPath;
    
    const filePath = path.join(basePath, adjustedPath);
    const fileData = await fs.readFile(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    throw new Error(`Failed to read JSON file at ${jsonPath}: ${error}`);
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

import path from "path";
import { promises as fs } from "fs";
import SearchClient from "./SearchClient";

export default async function Search({ type = ''}) {
  const drawingsPath = path.join(
    process.cwd(),
    "public/drawings/output_images/conversion_manifest.json",
  );
  const drawingsData = await fs.readFile(drawingsPath, "utf8");
  const drawings = JSON.parse(drawingsData);
  
  return <SearchClient type={type} drawings={drawings.files} />;
}

import { promises as fs } from "fs";
import path from "path";
import Drawings from "./Drawings";
import { fetchSections } from "@/sanity/lib/utils";
import Navigation, { URLS } from "../components/Navigation";

export default async function Page() {
  const drawingsPath = path.join(
    process.cwd(),
    "public/drawings/output_images/conversion_manifest.json",
  );

  const drawingsData = await fs.readFile(drawingsPath, "utf8");

  const drawings = JSON.parse(drawingsData);

  const sections = await fetchSections();

  return (
    <>
      <Navigation type={"top-bar"} active={URLS.DRAWINGS} />
      <Drawings
        drawings={drawings}
        sections={sections?.data.sections || []}
        section={"overview"}
      />
    </>
  );
}

import { promises as fs } from "fs";
import path from "path";
import TableOfContents from "../toc/TableOfContents";
import Navigation from "../components/Navigation";
import Drawings from "./Drawings";
import { fetchArticles, fetchSections } from "@/sanity/lib/utils";
import { getDrawingArticleDictionary } from "./util";

export default async function Page() {
  const drawingsPath = path.join(
    process.cwd(),
    "public/drawings/output_images/conversion_manifest.json",
  );

  const drawingsData = await fs.readFile(drawingsPath, "utf8");

  const drawings = JSON.parse(drawingsData);

  const sections = await fetchSections();
  const articles = await fetchArticles();
  const drawingsArticleDictionary = getDrawingArticleDictionary(articles.data);

  return (
    <>
      <TableOfContents sections={sections?.data.sections || []}>
        <Navigation />
        <main style={{ paddingLeft: "16.5rem" }}>
          <Drawings
            drawings={drawings}
            drawingsArticleDictionary={drawingsArticleDictionary}
          />
        </main>
      </TableOfContents>
    </>
  );
}

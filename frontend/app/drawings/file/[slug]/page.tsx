import { promises as fs } from "fs";
import path from "path";
import { fetchArticles } from "@/sanity/lib/utils";
import { getDrawingArticleDictionary, getSlugFromDrawingGroup } from "../../util";
import { DrawingPage } from "../../DrawingPage";
import Navigation, { URLS } from "@/app/components/Navigation/Navigation";

export async function generateStaticParams() {
  const drawingsPath = path.join(
    process.cwd(),
    "public/drawings/output_images/conversion_manifest.json",
  );

  const drawingsData = await fs.readFile(drawingsPath, "utf8");

  const drawings = JSON.parse(drawingsData);

  return drawings.files.map((d) => ({
    slug: d.uuid,
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const drawingsPath = path.join(
    process.cwd(),
    "public/drawings/output_images/conversion_manifest.json",
  );

  const drawingsData = await fs.readFile(drawingsPath, "utf8");

  const drawings = JSON.parse(drawingsData);

  const articles = await fetchArticles();
  const drawingsArticleDictionary = getDrawingArticleDictionary(articles.data);
  const index = drawings.files?.findIndex((d) => d.uuid == slug)

  return (
    <>
    <Navigation type={"top-bar"} active={URLS.DRAWINGS} section={getSlugFromDrawingGroup(drawings.files[index]?.group).toLowerCase()} />
    <DrawingPage
      asset={drawings.files[index]}
      next={drawings.files[index + 1] || drawings.files[0]}
      prev={drawings.files[index - 1] || drawings.files[drawings.files.length - 1]}
      drawingsArticleDictionary={drawingsArticleDictionary}
    />
    </>
  );
}

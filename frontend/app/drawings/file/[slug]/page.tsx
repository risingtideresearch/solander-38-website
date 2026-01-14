import { fetchArticles } from "@/sanity/lib/utils";
import {
  getDrawingArticleDictionary,
  getSlugFromDrawingGroup,
} from "../../util";
import { DrawingPage } from "../../DrawingPage";
import Navigation, { URLS } from "@/app/components/Navigation/Navigation";
import { getDrawingsManifest } from "@/app/manifest-util";

export async function generateStaticParams() {
  const drawings = getDrawingsManifest();

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
  const drawings = getDrawingsManifest();

  const articles = await fetchArticles();
  const drawingsArticleDictionary = getDrawingArticleDictionary(articles.data);
  const index = drawings.files?.findIndex((d) => d.uuid == slug);
  
  const currentDrawing = drawings.files[index];
  
  const nextDrawing = drawings.files[index + 1] || drawings.files[0];
  const prevDrawing = drawings.files[index - 1] || drawings.files[drawings.files.length - 1];

  return (
    <>
      <Navigation
        type={"top-bar"}
        active={URLS.DRAWINGS}
        section={getSlugFromDrawingGroup(
          currentDrawing?.group,
        ).toLowerCase()}
      />
      <DrawingPage
        asset={currentDrawing}
        next={nextDrawing}
        prev={prevDrawing}
        drawingsArticleDictionary={drawingsArticleDictionary}
      />
    </>
  );
}

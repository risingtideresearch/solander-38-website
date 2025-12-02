import { promises as fs } from "fs";
import path from "path";
import { fetchArticles, fetchSections } from "@/sanity/lib/utils";
import Article from "../Article";
import { matchArticleDrawings } from "@/app/stories/util";

// export async function generateStaticParams() {
//   const articles = await fetchArticles();

//   return articles.data.map((article) => article.slug);
// }

export default async function Page({ params }) {
  const { slug } = await params;
  const { data } = await fetchArticles(slug);
  const sections = await fetchSections();

  const drawingsPath = path.join(
    process.cwd(),
    "public/drawings/output_images/conversion_manifest.json",
  );
  const drawingsData = await fs.readFile(drawingsPath, "utf8");
  const drawings = JSON.parse(drawingsData);

  const modelsManifestPath = path.join(
    process.cwd(),
    "public/models/export_manifest.json",
  );
  const modelsManifestData = await fs.readFile(modelsManifestPath, "utf8");
  const models_manifest = JSON.parse(modelsManifestData);

  const getArticleNavigation = (sections: any, currentSlug: string) => {
    const allArticles = sections?.sections.flatMap((section: any) =>
      (section.articles || []).map((article: any) => ({
        ...article,
        sectionName: section.name,
        sectionSlug: section.slug,
      })),
    );

    const currentIndex = allArticles?.findIndex(
      (article: any) => article.slug === currentSlug,
    );

    if (currentIndex === undefined || currentIndex === -1) {
      return { prev: null, next: null, current: null };
    }

    return {
      current: allArticles[currentIndex],
      prev:
        currentIndex > 0
          ? allArticles[currentIndex - 1]
          : allArticles[allArticles.length - 1],
      next:
        currentIndex < allArticles.length - 1
          ? allArticles[currentIndex + 1]
          : allArticles[0],
    };
  };

  const navigation = getArticleNavigation(sections.data, slug);

  const dataWithMatchedDrawings = matchArticleDrawings(
    drawings.files,
    data[0] || {},
  );

  if (!dataWithMatchedDrawings.relatedModels) {
    dataWithMatchedDrawings.relatedModels = models_manifest.exported_layers
      .filter(
        (layer) =>
          layer.filename &&
          layer.file_size < 3000000 &&
          (dataWithMatchedDrawings.section == "overview" ||
            layer.filename.split("__")[0].toLowerCase() ==
              dataWithMatchedDrawings.section),
      )
      .map((layer) => layer.filename);
  }
  const materialsIndexPath = path.join(
    process.cwd(),
    "public/script-output/material_index_simple.json",
  );
  const materialsIndexData = await fs.readFile(materialsIndexPath, "utf8");
  const materials_index = JSON.parse(materialsIndexData) || {};

  const getMaterials = (acc, layer) => {
    materials_index.material_index[layer]?.forEach((material) => {
      acc.add(material);
    });
    return acc;
  };
  const relatedMaterials = dataWithMatchedDrawings.relatedModels.reduce(
    getMaterials,
    new Set(),
  );

  dataWithMatchedDrawings.relatedModels = Array.from(
    new Set(dataWithMatchedDrawings.relatedModels),
  );

  dataWithMatchedDrawings.articleId = sections.data.sections
    .map((section) => section.articles)
    .flat()
    .find((article) => article._id == dataWithMatchedDrawings._id)?.articleId;

  return (
    <Article
      data={dataWithMatchedDrawings}
      navigation={navigation}
      materials={Array.from(relatedMaterials)}
    />
  );
}

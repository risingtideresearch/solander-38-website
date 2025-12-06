import { promises as fs } from "fs";
import path from "path";
import { fetchArticles, fetchSections } from "@/sanity/lib/utils";
import Article from "../Article";
import { matchArticleDrawings } from "@/app/stories/util";
import { slugToRhinoSystem } from "@/app/utils";
import { LiaArrowLeftSolid, LiaArrowRightSolid } from "react-icons/lia";

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
      .filter((layer) => {
        if (!layer.filename || layer.file_size > 8000000) {
          return false;
        }
        const system = layer.filename.split("__")[0].toLowerCase();
        if (dataWithMatchedDrawings.section == "overview") {
          // improve frame rate by reducing unnecessary file loads
          return ![
            "OUTFITTING_INTERIOR__galley, workbench, shelving, etc.__CABINETS__cabinet surfaces.glb",
            "OUTFITTING_INTERIOR__galley, workbench, shelving, etc.__SHELF SURFS.glb",
            "OUTFITTING_INTERIOR__galley, workbench, shelving, etc.__GALLEY SURFS.glb",
            "PROPULSION__MOTOR MOUNT__motor mount surfaces.glb",
            "PROPULSION__20W Bell Marine Motor__SIMPLIFIED 20W Bell surfs.glb",
            "BODY__INTERNALS__soles & bhds.glb",
            "OUTFITTING_INTERIOR__COMPANIONWAY HATCH__SIMPLIFIED TRACK HARDWARE.glb",
            "OUTFITTING_INTERIOR__COMPANIONWAY HATCH__companionway hatch other hardware.glb",
            "BODY__INTERNALS__stringers.glb",
          ].includes(layer.filename);
        }

        return system == dataWithMatchedDrawings.section.replace(" & ", "_");
      })
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
    <>
      <div
        style={{
          marginTop: "2rem",
          display: "flex",
          gap: "0.25rem",
          borderLeft: "1px solid",
          marginLeft: "auto",
          padding: "0.5rem 2rem 0.5rem 0.5rem",
          maxWidth: "32rem",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        {navigation.prev && (
          <div>
            <a
              href={`/stories/${navigation.prev.slug}`}
              style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}
            >
              <LiaArrowLeftSolid size={18} />
              <h6>{navigation.prev.title}</h6>
            </a>
          </div>
        )}
        {navigation.next && (
          <div>
            <a
              href={`/stories/${navigation.next.slug}`}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <h6>{navigation.next.title}</h6>
              <LiaArrowRightSolid size={18} />
            </a>
          </div>
        )}
      </div>
      <Article
        data={dataWithMatchedDrawings}
        navigation={navigation}
        materials={Array.from(relatedMaterials)}
      />
    </>
  );
}

import TableOfContents from "@/app/toc/TableOfContents";
import {
  fetchArticles,
  fetchComponents,
  fetchSystems,
  fetchSystemsStatic,
} from "@/sanity/lib/utils";
import Anatomy from "../Anatomy";
import styles from "./page.module.scss";
import { getMaterialsManifest, getModelManifest } from "@/app/manifest-util";

export async function generateStaticParams() {
  const systems = await fetchSystemsStatic();
  const slugs = [
    {
      slug: [],
    },
  ];
  systems.data.systems.forEach((system) => {
    slugs.push({
      slug: [system.slug],
    });

    system.articles.forEach((article) => {
      slugs.push({
        slug: [system.slug, article.slug],
      });
    });
  });

  return slugs;
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const models_manifest = getModelManifest();
  const materials_index = getMaterialsManifest();

  const systems = await fetchSystems();

  const articles = await fetchArticles();

  const componentParts = await fetchComponents();

  let defaultSection = systems.data.systems.find(
    (system) => system.slug == slug,
  );
  const defaultArticle = articles.data.find((article) => article.slug == slug);
  if (defaultArticle) {
    defaultSection = defaultArticle.section;
  }

  return (
    <>
      <div className={styles.page} style={{backgroundPositionY: '2rem'}}>
        <TableOfContents
          sections={systems?.data.systems || []}
          defaultSection={defaultSection?.slug || null}
          defaultArticle={defaultArticle || null}
        >
          <Anatomy
            content={{
              models_manifest: models_manifest,
              material_index: materials_index.material_index,
              articles: articles.data,
              componentParts: componentParts.data,
            }}
          />
        </TableOfContents>
      </div>
    </>
  );
}

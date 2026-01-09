import TableOfContents from "@/app/toc/TableOfContents";
import {
  fetchArticles,
  fetchComponents,
  fetchSections,
  fetchSectionsStatic,
} from "@/sanity/lib/utils";
import Anatomy from "../Anatomy";
import styles from "./page.module.scss";
import { getMaterialsManifest, getModelManifest } from "@/app/manifest-util";

export async function generateStaticParams() {
  const sections = await fetchSectionsStatic();
  const slugs = [
    {
      slug: [],
    },
  ];
  sections.data.sections.forEach((section) => {
    slugs.push({
      slug: [section.slug],
    });

    section.articles.forEach((article) => {
      slugs.push({
        slug: [section.slug, article.slug],
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

  const sections = await fetchSections();

  const articles = await fetchArticles();

  const componentParts = await fetchComponents();

  let defaultSection = sections.data.sections.find(
    (section) => section.slug == slug,
  );
  const defaultArticle = articles.data.find((article) => article.slug == slug);
  if (defaultArticle) {
    defaultSection = defaultArticle.section;
  }

  return (
    <>
      <div className={styles.page}>
        <TableOfContents
          sections={sections?.data.sections || []}
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

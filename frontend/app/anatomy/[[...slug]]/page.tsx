import TableOfContents from "@/app/toc/TableOfContents";
import { fetchArticles, fetchComponents, fetchSections } from "@/sanity/lib/utils";
import Anatomy from "../Anatomy";
import styles from "./page.module.scss";
import { readMaterialsManifest, readModelManifest } from "@/app/manifest-util";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const models_manifest = await readModelManifest();
  const materials_index = await readMaterialsManifest();

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

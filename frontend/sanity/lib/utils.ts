import { createDataAttribute, CreateDataAttributeProps } from "next-sanity";
import { dataset, projectId, studioUrl } from "./api";
import {
  allPhotosQuery,
  annotationsQuery,
  articlesQuery,
  assetWithNavigationQuery,
  componentPartQuery,
  homepageQuery,
  materialsQuery,
  peopleQuery,
  sectionsQuery,
} from "./queries";
import { sanityFetch } from "./live";

export async function fetchAnnotations(models_manifest) {
  let { data } = await sanityFetch({ query: annotationsQuery });

  data = data.map((annotation, i) => ({
    ...annotation,
    // check sanity content against current model manifest
    relatedModels: annotation.relatedModels.filter((model) => {
      return models_manifest.exported_layers.find(
        (file) => file.filename == model,
      );
    }),
    i: i + 1,
  }));

  return { data };
}

/**
 *
 * @returns
 */
export async function fetchArticles(slug?: string) {
  const { data } = await sanityFetch({ query: articlesQuery(slug) });

  return { data };
}

/**
 *
 * @returns
 */
export async function fetchMaterials() {
  const { data } = await sanityFetch({ query: materialsQuery() });

  return { data };
}

/**
 *
 * @returns
 */
export async function fetchSections(slug?: string) {
  const { data } = await sanityFetch({ query: sectionsQuery(slug) });

  data.sections.forEach((section, i) => {
    section.articles.forEach((article, j) => {
      article.articleId = `${i + 1}–${String.fromCharCode(65 + j)}`
    })
  });

  return { data };
}

/**
 *
 * @returns
 */
export async function fetchPhotos(section?: string) {
  const { data } = await sanityFetch({ query: allPhotosQuery(section) });

  return { data };
}

/**
 *
 * @returns
 */
export async function fetchAssetWithNavigation(idPrefix: string) {
  const { data } = await sanityFetch({
    query: assetWithNavigationQuery(idPrefix),
  });

  return { data };
}

/**
 *
 * @returns
 */
export async function fetchPeople() {
  const { data } = await sanityFetch({ query: peopleQuery });

  return { data };
}

/**
 *
 * @returns
 */
export async function fetchHomepage() {
  const { data } = await sanityFetch({ query: homepageQuery() });

  return { data };
}

/**
 *
 */
export async function fetchTableOfContents() {
  const { data } = await sanityFetch({ query: sectionsQuery() });

  return data;
}

/**
 *
 * @returns
 */
export async function fetchComponents() {
  const { data } = await sanityFetch({ query: componentPartQuery() });

  return { data };
}

type DataAttributeConfig = CreateDataAttributeProps &
  Required<Pick<CreateDataAttributeProps, "id" | "type" | "path">>;

export function dataAttr(config: DataAttributeConfig) {
  return createDataAttribute({
    projectId,
    dataset,
    baseUrl: studioUrl,
  }).combine(config);
}

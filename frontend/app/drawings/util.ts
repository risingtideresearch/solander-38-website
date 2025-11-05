import { Article } from "../anatomy/page";

export const cleanFilename = (asset): string => {
  if (!asset) {
    return "";
  }
  if (asset._type == "image") {
    return asset.asset?.title || asset.asset?.originalFilename || "<no title>";
  }
  const name = asset.filename;
  const stripPage = asset.total_pages_in_pdf <= 1;

  const clean = name
    .replace("Solander 38", "")
    .replace(/\d{1,2}-\d{1,2}-\d{2}/, "")
    .replace(/\s*\.png/, "")
    .replace(" HJN", "");

  if (stripPage) {
    return clean.replace(/\spage\s\d+/, "");
  }

  return clean;
};

/**
 *
 */
export type DrawingsArticleDictionary = {
  [key: string]: Array<{
    slug: string;
    title: string;
    section: {
      slug: string;
      title: string;
    };
  }>;
};
export function getDrawingArticleDictionary(articles: Array<Article>): DrawingsArticleDictionary {
  const dictionary = {};

  articles.forEach((article) => {
    article.content?.forEach((p) => {
      if (p.imageSet) {
        p.imageSet?.forEach((item) => {
          if (item._type == "drawingImage") {
            if (!dictionary[item.drawing]) {
              dictionary[item.drawing] = [];
            }
            dictionary[item.drawing].push({
              slug: article.slug,
              title: article.title,
              section: article.section,
            });
          }
        });
      }
    });
  });

  return dictionary;
}

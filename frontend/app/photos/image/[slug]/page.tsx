import { fetchAssetWithNavigation } from "@/sanity/lib/utils";
import { PhotoPage } from "../../PhotoPage";
import Navigation, { URLS } from "@/app/components/Navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const idPrefix = "image-" + slug;

  const { data } = await fetchAssetWithNavigation(idPrefix);
  const currentIndex = data.allImages.findIndex((img) =>
    img._id.startsWith(idPrefix),
  );
  const current = data.allImages[currentIndex];
  const prev = currentIndex > 0 ? data.allImages[currentIndex - 1] : data.allImages[data.allImages.length - 1];
  const next =
    currentIndex < data.allImages.length - 1
      ? data.allImages[currentIndex + 1]
      : data.allImages[0];

  const section = current.usedInArticles[0]?.section || {};

  return (
    <>
      <Navigation type={"top-bar"} active={URLS.PHOTOS} section={section.slug} />
      <PhotoPage
        asset={current}
        next={next && { uuid: next._id.split("-")[1] }}
        prev={prev && { uuid: prev._id.split("-")[1] }}
      />
    </>
  );
}

import {
  fetchAssetWithNavigation,
  fetchPhotoOrder,
  fetchPhotosStatic,
} from "@/sanity/lib/utils";
import { PhotoPage } from "../../PhotoPage";
import Navigation, { URLS } from "@/app/components/Navigation/Navigation";
import { Metadata } from "next";

export async function generateStaticParams() {
  const photos = await fetchPhotosStatic();

  return photos.data.map((photo) => ({ slug: photo._id.split("-")[1] }));
}

export async function generateMetadata({ params }): Promise<Metadata> {
   const { slug } = await params;

  const idPrefix = "image-" + slug;

  const { data } = await fetchAssetWithNavigation(idPrefix);
  const current = data.allImages.find((img) => img._id.startsWith(idPrefix));

  return {
    title: `${current.title} | | Solander 38`,
    description: `${current.description || `Photo of ${current.title}`}`,
    openGraph: {
      images: [
        {
          url: current.url,
          width: current.metadata?.dimensions?.width,
          height: current.metadata?.dimensions?.height,
          alt: current.title,
        },
      ],
    },
    publisher: 'Rising Tide Research Foundation'
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const idPrefix = "image-" + slug;

  const [{ data }, { data: orderData }] = await Promise.all([
    fetchAssetWithNavigation(idPrefix),
    fetchPhotoOrder(),
  ]);

  // Build ordered image ID list: homepage image first, then story order
  const orderedIds: string[] = [];
  const seen = new Set<string>();
  const homepageRef = orderData?.homepageImageRef;
  if (homepageRef && !seen.has(homepageRef)) {
    seen.add(homepageRef);
    orderedIds.push(homepageRef);
  }
  for (const system of orderData?.systems ?? []) {
    for (const article of system.articles ?? []) {
      for (const ref of article.imageRefs ?? []) {
        if (ref && !seen.has(ref)) {
          seen.add(ref);
          orderedIds.push(ref);
        }
      }
    }
  }

  const imageOrder = new Map(orderedIds.map((id: string, i: number) => [id, i]));
  const allSorted = [...data.allImages].sort((a, b) => {
    const ai = imageOrder.get(a._id) ?? Infinity;
    const bi = imageOrder.get(b._id) ?? Infinity;
    return ai - bi;
  });

  const current = allSorted.find((img) => img._id.startsWith(idPrefix));
  const navigableImages = allSorted.filter((img) => !img.tags?.includes("no-gallery"));

  const currentIndex = navigableImages.findIndex((img) =>
    img._id.startsWith(idPrefix),
  );
  const prev =
    currentIndex > 0
      ? navigableImages[currentIndex - 1]
      : navigableImages[navigableImages.length - 1];
  const next =
    currentIndex < navigableImages.length - 1
      ? navigableImages[currentIndex + 1]
      : navigableImages[0];

  const isNoGallery = current.tags?.includes("no-gallery");
  const isHomepageImage = current.usedInArticles.length === 0 && !isNoGallery;
  const system = (!isNoGallery && (current.usedInArticles[0]?.system || (isHomepageImage ? { name: "Overview", slug: "overview" } : null))) || {};

  return (
    <>
      <Navigation
        type={"top-bar"}
        active={URLS.PHOTOS}
        system={system.slug}
      />
      <PhotoPage
        asset={current}
        next={next && { uuid: next._id.split("-")[1] }}
        prev={prev && { uuid: prev._id.split("-")[1] }}
      />
    </>
  );
}

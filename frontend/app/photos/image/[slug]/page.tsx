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

  // Build ordered image ID list: for each system in order, story images first then tagged-only images
  const orderedIds: string[] = [];
  const seen = new Set<string>();
  for (const system of orderData?.systems ?? []) {
    for (const article of system.articles ?? []) {
      for (const ref of article.imageRefs ?? []) {
        if (ref && !seen.has(ref)) {
          seen.add(ref);
          orderedIds.push(ref);
        }
      }
    }
    if (system.slug) {
      for (const img of data.allImages) {
        if (!seen.has(img._id) && !img.tags?.includes("no-gallery")) {
          const imgTag = img.tags?.find((t: string) => t !== "no-gallery");
          const inSystem = img.usedInArticles?.some((a: any) => a.system?.slug === system.slug);
          if (imgTag === system.slug || inSystem) {
            seen.add(img._id);
            orderedIds.push(img._id);
          }
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

  const isNoGallery = current.tags?.includes("no-gallery");
  const systemTag = current.tags?.find((t) => t !== "no-gallery") ?? null;
  const system = (!isNoGallery && (current.usedInArticles[0]?.system || (systemTag ? { name: systemTag, slug: systemTag } : null))) || {};

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

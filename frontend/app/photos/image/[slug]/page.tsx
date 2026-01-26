import {
  fetchAssetWithNavigation,
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
  const currentIndex = data.allImages.findIndex((img) =>
    img._id.startsWith(idPrefix),
  );
  const current = data.allImages[currentIndex];

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

  const { data } = await fetchAssetWithNavigation(idPrefix);
  const currentIndex = data.allImages.findIndex((img) =>
    img._id.startsWith(idPrefix),
  );
  const current = data.allImages[currentIndex];
  const prev =
    currentIndex > 0
      ? data.allImages[currentIndex - 1]
      : data.allImages[data.allImages.length - 1];
  const next =
    currentIndex < data.allImages.length - 1
      ? data.allImages[currentIndex + 1]
      : data.allImages[0];

  const system = current.usedInArticles[0]?.system || {};

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

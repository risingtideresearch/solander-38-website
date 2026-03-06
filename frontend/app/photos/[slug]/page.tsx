import { fetchPhotos, fetchPhotoOrder, fetchSystems, fetchSystemsStatic } from "@/sanity/lib/utils";
import Navigation, { URLS } from "../../components/Navigation/Navigation";
import PhotoGallery from "./../PhotoGallery";
import MinimalTOC from "../../toc/MinimalTOC";
import styles from './../photos.module.scss';

export async function generateStaticParams() {
  const systems = await fetchSystemsStatic();
  return systems.data.systems.map(system => (
    {
      slug: system.slug
    }
  ));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [photos, { data: orderData }, systems] = await Promise.all([
    fetchPhotos(slug),
    fetchPhotoOrder(),
    fetchSystems(),
  ]);

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

  const imageOrder = new Map(orderedIds.map((id, i) => [id, i]));
  const sortedPhotos = [...photos.data].sort((a, b) => {
    const ai = imageOrder.get(a._id) ?? Infinity;
    const bi = imageOrder.get(b._id) ?? Infinity;
    return ai - bi;
  });

  return (
    <>
      <Navigation type={"top-bar"} active={URLS.PHOTOS} system={slug} />
       <main className={styles.main}>
        <div className="section--two-col">
          <div>
            <MinimalTOC systems={systems.data.systems} url={URLS.PHOTOS} system={slug} />
          </div>
          <div>
            <PhotoGallery photos={sortedPhotos} />
          </div>
        </div>
      </main>
    </>
  );
}

import { fetchPhotos, fetchSystems, fetchSystemsStatic } from "@/sanity/lib/utils";
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
  const photos = await fetchPhotos(slug);
  
  const systems = await fetchSystems();

  return (
    <>
      <Navigation type={"top-bar"} active={URLS.PHOTOS} system={slug} />
       <main className={styles.main}>
        <div className="section--two-col">
          <div>
            <MinimalTOC systems={systems.data.systems} url={URLS.PHOTOS} system={slug} />
          </div>
          <div>
            <PhotoGallery photos={photos.data} />
          </div>
        </div>
      </main>
    </>
  );
}

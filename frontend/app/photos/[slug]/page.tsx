import { fetchPhotos, fetchSystems, fetchSystemsStatic } from "@/sanity/lib/utils";
import Navigation, { URLS } from "../../components/Navigation/Navigation";
import PhotoGallery from "./../PhotoGallery";
import MinimalTOC from "../../toc/MinimalTOC";
import styles from './../photos.module.scss';

export async function generateStaticParams() {
  const sections = await fetchSystemsStatic();
  return sections.data.systems.map(section => (
    {
      slug: section.slug
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
  
  const sections = await fetchSystems();

  return (
    <>
      <Navigation type={"top-bar"} active={URLS.PHOTOS} section={slug} />
       <main className={styles.main}>
        <div className="section--two-col">
          <div>
            <MinimalTOC sections={sections.data.systems} url={URLS.PHOTOS} section={slug} />
          </div>
          <div>
            <PhotoGallery photos={photos.data} />
          </div>
        </div>
      </main>
    </>
  );
}

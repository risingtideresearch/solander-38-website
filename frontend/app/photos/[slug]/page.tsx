import { fetchPhotos, fetchSections, fetchSectionsStatic } from "@/sanity/lib/utils";
import Navigation, { URLS } from "../../components/Navigation/Navigation";
import PhotoGallery from "./../PhotoGallery";
import MinimalTOC from "../../toc/MinimalTOC";
import styles from './../photos.module.scss';

export async function generateStaticParams() {
  const sections = await fetchSectionsStatic();
  return sections.data.sections.map(section => (
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
  
  const sections = await fetchSections();

  return (
    <>
      <Navigation type={"top-bar"} active={URLS.PHOTOS} section={slug} />
       <main className={styles.main}>
        <div className="section--two-col">
          <div>
            <MinimalTOC sections={sections.data.sections} url={URLS.PHOTOS} section={slug} />
          </div>
          <div>
            <PhotoGallery photos={photos.data} />
          </div>
        </div>
      </main>
    </>
  );
}

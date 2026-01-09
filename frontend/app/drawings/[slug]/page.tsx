import Drawings from "../Drawings";
import { fetchSections, fetchSectionsStatic } from "@/sanity/lib/utils";
import Navigation, { URLS } from "@/app/components/Navigation/Navigation";
import { getDrawingsManifest } from "@/app/manifest-util";

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
  const drawings = getDrawingsManifest();
  const sections = await fetchSections();

  return (
    <>
      <Navigation type={"top-bar"} active={URLS.DRAWINGS} section={slug} />
      <Drawings
        drawings={drawings}
        sections={sections?.data.sections || []}
        section={slug || "overview"}
      />
    </>
  );
}

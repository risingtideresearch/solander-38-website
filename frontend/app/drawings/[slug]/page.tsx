import Drawings from "../Drawings";
import { fetchSystems, fetchSystemsStatic } from "@/sanity/lib/utils";
import Navigation, { URLS } from "@/app/components/Navigation/Navigation";
import { getDrawingsManifest } from "@/app/manifest-util";

export async function generateStaticParams() {
  const sections = await fetchSystemsStatic();
  return sections.data.systems.map(system => (
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
  const drawings = getDrawingsManifest();
  const sections = await fetchSystems();

  return (
    <>
      <Navigation type={"top-bar"} active={URLS.DRAWINGS} section={slug} />
      <Drawings
        drawings={drawings}
        sections={sections?.data.systems || []}
        section={slug || "overview"}
      />
    </>
  );
}

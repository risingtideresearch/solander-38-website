import Drawings from "../Drawings";
import { fetchSections } from "@/sanity/lib/utils";
import Navigation, { URLS } from "@/app/components/Navigation/Navigation";
import { getDrawingsManifest } from "@/app/manifest-util";

export async function generateStaticParams() {
  return [
    { slug: "overview" },
    { slug: "body" },
    { slug: "power-architecture" },
    { slug: "superstructure" },
    { slug: "control" },
    { slug: "propulsion" },
    { slug: "water-heating-systems" },
    { slug: "outfitting-interior" },
  ];
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

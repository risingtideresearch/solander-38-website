import Drawings from "./Drawings";
import { fetchSections } from "@/sanity/lib/utils";
import Navigation, { URLS } from "../components/Navigation/Navigation";
import { getDrawingsManifest } from "../manifest-util";

export default async function Page() {
  const drawings = getDrawingsManifest();

  const sections = await fetchSections();

  return (
    <>
      <Navigation type={"top-bar"} active={URLS.DRAWINGS} />
      <Drawings
        drawings={drawings}
        sections={sections?.data.sections || []}
        section={"overview"}
      />
    </>
  );
}

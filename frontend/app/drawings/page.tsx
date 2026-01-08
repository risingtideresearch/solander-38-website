import Drawings from "./Drawings";
import { fetchSections } from "@/sanity/lib/utils";
import Navigation, { URLS } from "../components/Navigation/Navigation";
import { readDrawingsManifest } from "../manifest-util";

export default async function Page() {
  const drawings = await readDrawingsManifest();

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

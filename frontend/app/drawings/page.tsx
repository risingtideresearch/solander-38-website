import Drawings from "./Drawings";
import { fetchSystems } from "@/sanity/lib/utils";
import Navigation, { URLS } from "../components/Navigation/Navigation";
import { getDrawingsManifest } from "../manifest-util";

export default async function Page() {
  const drawings = getDrawingsManifest();

  const sections = await fetchSystems();

  return (
    <>
      <Navigation type={"top-bar"} active={URLS.DRAWINGS} />
      <Drawings
        drawings={drawings}
        sections={sections?.data.systems || []}
        section={"overview"}
      />
    </>
  );
}

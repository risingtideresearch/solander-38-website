import SearchClient from "./SearchClient";
import { getDrawingsManifest } from "@/app/manifest-util";

export default async function Search({ type = ''}) {
  const { files } = getDrawingsManifest();
  const drawings = files.map(({ clean_filename, uuid, id }) => ({ clean_filename, uuid, id }));
  return <SearchClient type={type} drawings={drawings} />;
}

import SearchClient from "./SearchClient";
import { getDrawingsManifest } from "@/app/manifest-util";

export default async function Search({ type = ''}) {
  const drawings = getDrawingsManifest()
  
  return <SearchClient type={type} drawings={drawings.files} />;
}

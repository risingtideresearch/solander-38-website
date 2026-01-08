import SearchClient from "./SearchClient";
import { readDrawingsManifest } from "@/app/manifest-util";

export default async function Search({ type = ''}) {
  const drawings = await readDrawingsManifest();
  
  return <SearchClient type={type} drawings={drawings.files} />;
}

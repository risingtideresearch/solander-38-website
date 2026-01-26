import { Drawing } from "./types";
import DrawingsGallery from "./DrawingsGallery";
import { System } from "@/sanity/sanity.types";
import MinimalTOC from "../toc/MinimalTOC";
import { URLS } from "../components/Navigation/Navigation";

interface DrawingsProps {
  drawings: {
    files: Array<Drawing>;
  };
  defaultUUID?: string;
  system?: string;
  systems: Array<System>;
}

export default async function Drawings({
  drawings,
  systems,
  system,
}: DrawingsProps) {
  return (
    <main>
      <div className="section--two-col">
        <div>
          <MinimalTOC
            systems={systems}
            system={system}
            url={URLS.DRAWINGS}
          />
        </div>
        <DrawingsGallery drawings={drawings} system={system} />
      </div>
    </main>
  );
}

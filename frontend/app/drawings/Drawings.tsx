import { Drawing } from "./types";
import DrawingsGallery from "./DrawingsGallery";
import { Section } from "@/sanity/sanity.types";
import MinimalTOC from "../toc/MinimalTOC";
import { URLS } from "../components/Navigation";

interface DrawingsProps {
  drawings: {
    files: Array<Drawing>;
  };
  defaultUUID?: string;
  section?: string;
  sections: Array<Section>;
}

export default async function Drawings({
  drawings,
  sections,
  section,
}: DrawingsProps) {
  return (
    <main>
      <div className="section--two-col">
        <div>
          <MinimalTOC
            sections={sections}
            section={section}
            url={URLS.DRAWINGS}
          />
        </div>
        <DrawingsGallery drawings={drawings} section={section} />
      </div>
    </main>
  );
}

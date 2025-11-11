"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import ThreeDContainer from "./ThreeDContainer";
import { TOCContext } from "../toc/TableOfContents";
import {
  processModels,
  getSystemMap,
  computeCombinedBoundingBox,
  ModelManifest,
  MaterialIndex,
} from "./three-d/util";
import Info from "./Info";
import { Article } from "@/sanity/sanity.types";

type AnatomyContent = {
  material_index: MaterialIndex;
  models_manifest: ModelManifest;
  articles: Array<Article>;
}

interface IAnatomy {
  content: AnatomyContent;
}

export default function Anatomy({ content }: IAnatomy) {
  const toc = useContext(TOCContext);
  const [visibleAnnotations, setVisibleAnnotations] = useState(false);
  const [activeAnnotation, setActiveAnnotation] = useState<unknown>(null);
  const [search, setSearch] = useState("");
  const memoModels = useMemo(() => processModels(content.models_manifest), []);
  const systems = useMemo(() => getSystemMap(memoModels), [memoModels]);

  const active =
    toc.mode == "system"
      ? toc.section.slug != "overview"
        ? toc.section.slug == "water-heating-systems"
          ? {
              type: "system",
              key: "water_heating systems".toUpperCase(),
            }
          : toc.section.slug == "outfitting-interior"
            ? {
                type: "system",
                key: toc.section.slug.replaceAll("-", "_").toUpperCase(),
              }
            : {
                type: "system",
                key: toc.section.slug.replaceAll("-", " ").toUpperCase(),
              }
        : null
      : {
          type: toc.mode,
          key: toc.section.slug,
        };

  const filteredLayers = useMemo(() => {
    let arr: string[] = memoModels.map((m) => m.filename) || [];

    if (search) {
      arr = arr.filter((layer) => {
        return layer.toLowerCase().includes(search.toLowerCase());
      });
    } else {
      if (active && active.type == "material") {
        arr = arr.filter((m) =>
          (content.material_index[m] || []).includes(
            toc.material,
          ),
        );
      } else if (toc.article) {
        arr = toc.article?.relatedModels || arr;
      } else if (active && active.key != "overview") {
        arr = systems[active.key]?.children;
      }
    }

    // ensure CMS defined related models are in sync with current manifest
    arr = arr.filter((name) =>
      memoModels.find((layer) => layer.filename == name),
    );

    return Array.from(new Set(arr));
  }, [active, systems, search, activeAnnotation, toc.article, toc.material]);

  const filteredContent = content;

  useEffect(() => {
    if (toc.article) {
      window.history.pushState(null, "", `/anatomy/${toc.article?.slug}`);
    } else if (toc.section.slug) {
      window.history.pushState(null, "", `/anatomy/${toc.section.slug}`);
    }
  }, [toc.article, toc.section.slug]);

  const boundingBox = computeCombinedBoundingBox(
    memoModels
      .filter((m) => filteredLayers.includes(m.filename))
      .map((m) => m.bounding_box),
  );

  return (
    <div>
      <input
        type="text"
        placeholder="search"
        value={search}
        style={{
          border: "1px solid",
          position: "fixed",
          top: "3.25rem",
          left: "0.5rem",
          width: "15rem",
          zIndex: "1",
        }}
        onChange={(e) => {
          const val = e.target.value;
          setSearch(val);
        }}
      />
      <ThreeDContainer
        content={filteredContent}
        setActiveAnnotation={(note) =>
          setActiveAnnotation((prev) =>
            !prev || prev?._id != note._id ? note : null,
          )
        }
        filteredLayers={filteredLayers}
        boundingBox={boundingBox}
      />
      {/* <AnnotationsList
        content={filteredContent.annotations}
        activeAnnotation={activeAnnotation}
        setActiveAnnotation={(note) => setActiveAnnotation(note)}
        visible={visibleAnnotations}
      /> */}

      <Info
        visible={visibleAnnotations}
        setVisible={setVisibleAnnotations}
        lastUpdated={content.models_manifest.export_info.timestamp_end}
      />
    </div>
  );
}

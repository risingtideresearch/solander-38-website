"use client";

import { useContext, useEffect, useMemo, useState, useCallback } from "react";
import { Plane, Vector3 } from "three";
import { TOCContext } from "../toc/TableOfContents";
import {
  processModels,
  getSystemMap,
  computeCombinedBoundingBox,
  ModelManifest,
  MaterialIndex,
  contextualLayers,
  Units,
} from "./three-d/util";
import Info from "./Info";
import { ClippingPlaneControls } from "./ClippingPlaneControls";
import { Article } from "@/sanity/sanity.types";
import { Canvas3D } from "./three-d/Canvas3D";

type AnatomyContent = {
  material_index: MaterialIndex;
  models_manifest: ModelManifest;
  articles: Array<Article>;
};

interface IAnatomy {
  content: AnatomyContent;
}

export type ControlSettings = {
  transparent?: boolean;
  expand: boolean;
  units?: Units;
  monochrome?: boolean;
};

export interface ClippingPlanes {
  [key: string]: Plane;
}

const INITIAL_CLIPPING_PLANES: ClippingPlanes = {
  x1: new Plane(new Vector3(1, 0, 0), 13),
  x2: new Plane(new Vector3(-1, 0, 0), 2),
  y1: new Plane(new Vector3(0, 1, 0), 10),
  y2: new Plane(new Vector3(0, -1, 0), 10),
  z1: new Plane(new Vector3(0, 0, 1), 5),
  z2: new Plane(new Vector3(0, 0, -1), 5),
};

const slugToRhinoSystem = (slug: string) => {
  switch (slug) {
    case "water-heating-systems":
      return "water_heating systems".toUpperCase();
    case "outfitting-interior":
      return slug.replaceAll("-", "_").toUpperCase();
    default:
      return slug.replaceAll("-", " ").toUpperCase();
  }
};

const isDefaultTransparentBody = (toc) => {
  return !(
    (toc.section.slug === "body" && !toc.article) ||
    toc.section.slug === "overview" ||
    toc.article?.slug === "hull-and-deck"
  );
};

export default function Anatomy({ content }: IAnatomy) {
  const toc = useContext(TOCContext);
  const [visibleAnnotations, setVisibleAnnotations] = useState(false);
  const [activeAnnotation, setActiveAnnotation] = useState<unknown>(null);
  const [search, setSearch] = useState("");
  const memoModels = useMemo(() => processModels(content.models_manifest), []);
  const systems = useMemo(() => getSystemMap(memoModels), [memoModels]);
  const [settings, setSettings] = useState<ControlSettings>({
    transparent: isDefaultTransparentBody(toc),
    units: Units.Feet,
    expand: false,
  });
  const [clippingPlanes, setClippingPlanes] = useState<ClippingPlanes>(
    INITIAL_CLIPPING_PLANES,
  );

  const handleSetClippingPlane = useCallback((dir: string, value: Plane) => {
    setClippingPlanes((prev) => ({
      ...prev,
      [dir]: value,
    }));
  }, []);

  const active =
    toc.mode == "system"
      ? toc.section.slug != "overview"
        ? {
            type: "system",
            key: slugToRhinoSystem(toc.section.slug),
          }
        : null
      : {
          type: toc.mode,
          key: toc.section.slug,
        };

  useEffect(() => {
    setSettings((prev) => ({
      ...prev,
      transparent: isDefaultTransparentBody(toc),
    }));
  }, [toc.article, toc.section]);

  const filteredLayers = useMemo(() => {
    let arr: string[] = memoModels.map((m) => m.filename) || [];

    if (search) {
      arr = arr.filter((layer) => {
        return layer.toLowerCase().includes(search.toLowerCase());
      });
    } else if (active) {
      if (active.type == "material") {
        arr = arr.filter((m) =>
          (content.material_index[m] || []).includes(toc.material),
        );
      } else if (toc.article) {
        arr = toc.article?.relatedModels || systems[active.key]?.children || [];
      } else if (active.key != "overview") {
        arr = systems[active.key]?.children;
      }
    }

    // ensure CMS defined related models are in sync with current manifest
    arr = arr.filter((name) =>
      memoModels.find((layer) => layer.filename == name),
    );

    return Array.from(new Set(arr));
  }, [active, systems, search, activeAnnotation, toc.article, toc.material]);

  useEffect(() => {
    if (toc.article) {
      window.history.pushState(null, "", `/anatomy/${toc.article?.slug}`);
    } else if (toc.section.slug) {
      window.history.pushState(null, "", `/anatomy/${toc.section.slug}`);
    }
  }, [toc.article, toc.section.slug]);

  const visibleModelsBBoxes = memoModels
    .filter(
      (m) =>
        filteredLayers.includes(m.filename) &&
        (!contextualLayers.includes(m.filename) ||
          filteredLayers.includes(m.filename)),
    )
    .map((m) => m.bounding_box);
  const boundingBox = computeCombinedBoundingBox(visibleModelsBBoxes);

  const layersToRender = settings.transparent
    ? [
        ...filteredLayers.filter((layer) => !contextualLayers.includes(layer)),
        ...contextualLayers,
      ]
    : filteredLayers;

  return (
    <div>
      {/* <input
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
      /> */}

      <Canvas3D
        clippingPlanes={clippingPlanes}
        filteredLayers={layersToRender}
        settings={settings}
        boundingBox={boundingBox}
        materials={content.material_index}
        memoModels={memoModels}
      />

      <ClippingPlaneControls
        settings={settings}
        setSettings={setSettings}
        setClippingPlane={handleSetClippingPlane}
        boundingBox={boundingBox}
      />

      <button
        onClick={() =>
          setSettings((prev) => ({ ...prev, transparent: !prev.transparent }))
        }
        style={{
          position: "absolute",
          right: "0.5rem",
          top: "5.5rem",
          border: "1px solid",
        }}
      >
        {settings.transparent ? (
          <svg
            width="18"
            height="18"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M34 31.5V26H28.5V31.5H34ZM170 77H175.5V74.7396L173.911 73.1325L170 77ZM125 31.5L128.911 27.6325L127.296 26H125V31.5ZM170 171V176.5H175.5V171H170ZM34 126H28.5V128.224L30.0456 129.823L34 126ZM77.5 171L73.5456 174.823L77.5 176.5V171ZM34 31.5L30.0245 35.3007L73.5245 80.8007L77.5 77L81.4755 73.1993L37.9755 27.6993L34 31.5ZM77.5 77V82.5H170V77V71.5H77.5V77ZM170 77L173.911 73.1325L128.911 27.6325L125 31.5L121.089 35.3675L166.089 80.8675L170 77ZM125 31.5V26H34V31.5V37H125V31.5ZM170 171H175.5V77H170H164.5V171H170ZM34 31.5H28.5V126H34H39.5V31.5H34ZM77.5 77H72V171H77.5H83V77H77.5ZM77.5 171V176.5H170V171V165.5H77.5V171ZM34 126L30.0456 129.823L73.5456 174.823L77.5 171L81.4544 167.177L37.9544 122.177L34 126Z"
              fill="black"
            />
          </svg>
        ) : (
          <svg
            width="18"
            height="18"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M34 31.5V26H28.5V31.5H34ZM170 77H175.5V74.7396L173.911 73.1325L170 77ZM125 31.5L128.911 27.6325L127.296 26H125V31.5ZM170 171V176.5H175.5V171H170ZM34 126H28.5V128.224L30.0456 129.823L34 126ZM77.5 171L73.5456 174.823L77.5 176.5V171ZM34 31.5L30.0245 35.3007L73.5245 80.8007L77.5 77L81.4755 73.1993L37.9755 27.6993L34 31.5ZM77.5 77V82.5H170V77V71.5H77.5V77ZM170 77L173.911 73.1325L128.911 27.6325L125 31.5L121.089 35.3675L166.089 80.8675L170 77ZM125 31.5V26H34V31.5V37H125V31.5ZM125 31.5H119.5V126H125H130.5V31.5H125ZM125 126L121.111 129.889L166.111 174.889L170 171L173.889 167.111L128.889 122.111L125 126ZM170 171H175.5V77H170H164.5V171H170ZM34 31.5H28.5V126H34H39.5V31.5H34ZM34 126V131.5H125V126V120.5H34V126ZM77.5 77H72V171H77.5H83V77H77.5ZM77.5 171V176.5H170V171V165.5H77.5V171ZM34 126L30.0456 129.823L73.5456 174.823L77.5 171L81.4544 167.177L37.9544 122.177L34 126Z"
              fill="black"
            />
          </svg>
        )}
      </button>

      <Info
        visible={visibleAnnotations}
        setVisible={setVisibleAnnotations}
        lastUpdated={content.models_manifest.export_info.timestamp_end}
      />
    </div>
  );
}

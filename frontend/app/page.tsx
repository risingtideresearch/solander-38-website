import path from "path";
import { promises as fs } from "fs";
import { Canvas3D } from "./anatomy/three-d/Canvas3D";
import Footer from "./components/Footer";
import { URLS } from "./components/Navigation";
import styles from "./home.module.scss";
import { LiaLongArrowAltRightSolid } from "react-icons/lia";

export default async function Page() {
  const modelsManifestPath = path.join(
    process.cwd(),
    "public/models/export_manifest.json",
  );
  const modelsManifestData = await fs.readFile(modelsManifestPath, "utf8");
  const models_manifest = JSON.parse(modelsManifestData);
  const layers = models_manifest.exported_layers
    .filter(
      (layer) =>
        ![
          "BODY__INTERNALS",
          "CONTROL__STEERING__STEERING COMPONENTS__tillers",
          "SUPERSTRUCTURE__WIREWAYS__ww parts surfs",
          "POWER ARCHITECTURE__SMARTPLUG INLET SYSTEM",
          "POWER ARCHITECTURE__ELEC BOARD COMPONENTS",
          "OUTFITTING_INTERIOR__SIMPLIFIED CTR DECK TRACKS",
          "PROPULSION__MOTOR MOUNT",
          "PROPULSION__20W Bell Marine Motor",
          "OUTFITTING_INTERIOR__BATTERY CMPT",
          "WATER_HEATING SYSTEMS__TANKS_",
          "WATER_HEATING SYSTEMS__HEAT PUMP VENTS",
          "OUTFITTING_INTERIOR__galley, workbench, shelving, etc.__CABINETS",
          "OUTFITTING_INTERIOR__galley, workbench, shelving, etc.__SHELF SURFS",
          "SUPERSTRUCTURE__ALUM. PARTS+__flat bar base",
          "CONTROL__STEERING__STEERING SHELVES__port dummy shelf",
          "OUTFITTING_INTERIOR__COMPANIONWAY HATCH__companionway hatch",
          "SUPERSTRUCTURE__ALUM. PARTS+__TOE-KICKS__TOE-KICK 1_4_ FHMS.glb",
          "BODY__CTR BEAM__fwd beam hatches",
          "BODY__CTR BEAM__ctr beam inside surfaces",
          "CONTROL__STEERING__STEERING COMPONENTS__JEFA",
          "WATER_HEATING SYSTEMS__Headhunter",
          "CONTROL__STEERING__STEERING COMPONENTS__Washer, delri",
          "OUTFITTING_INTERIOR__DECK ACCESS STAIRLADDER",
          "OUTFITTING_INTERIOR__galley, workbench, shelving, etc.__workbench",
          "OUTFITTING_INTERIOR__galley, workbench, shelving, etc.__GALLEY",
          "CONTROL__STEERING__steering tunnels",
          "CONTROL__STEERING__STEERING COMPONENTS__autopilot"
        ].find((n) => layer.filename.startsWith(n)),
    ).map((layer) => layer.filename)
  return (
    <div className={styles.home}>
      <div className={styles.header}>
        <div className={styles.hero}>
          <div className={styles.title}>
            <h1>Solander 38</h1>
            <h6>
              <svg
                width="59"
                height="78"
                viewBox="0 0 59 78"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.9 77.6C20 68.8 24.8 54.9 26.7 49.5H0L7.7 40.7C18.5 37.7 23.4 39.9 28.3 42C32.8 44 37.2 45.9 44.5 45.3L16.9 77.6Z"
                  fill="#000"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M42.4 0C39.3 8.8 34.5 22.7 32.6 28.1H58.9L51.7 36.8C40.8 39.9 36 37.8 31.1 35.7C26.7 33.8 22.2 31.8 15 32.4L42.4 0Z"
                  fill="#000"
                />
              </svg>
              Rising Tide Research Foundation
            </h6>
          </div>
          {/* <img
            src="/images/solander-38-4.png"
            alt="3D model of Solander 38"
            height={1125}
            width={2038}
            className={styles.solander}
          /> */}
          <div>
            <Canvas3D
              height={"20rem"}
              filteredLayers={layers}
              settings={{
                transparent: false,
              }}
              interaction={"none"}
            />
          </div>
        </div>
      </div>

      <Footer>
        <div className={styles.toc}>
          <a href={URLS.STORIES}>
            Stories <LiaLongArrowAltRightSolid size={18} />{" "}
          </a>
          <h6>Details from the build, organized by anatomical system</h6>
          <a href={URLS.ANATOMY}>
            Anatomy <LiaLongArrowAltRightSolid size={18} />{" "}
          </a>
          <h6>Model of parts and systems</h6>
          <a href={URLS.DRAWINGS}>
            Drawings <LiaLongArrowAltRightSolid size={18} />{" "}
          </a>
          <h6>Library of fabrication plans</h6>
          <a href={URLS.PEOPLE}>
            People <LiaLongArrowAltRightSolid size={18} />{" "}
          </a>
          <h6>Builders, engineers, and researchers involved</h6>
        </div>
      </Footer>
    </div>
  );
}

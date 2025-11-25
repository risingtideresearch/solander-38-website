import { Box3, Vector3 } from "three";

export enum Units {
  Meters = "Meters",
  Feet = "Feet",
}

export const contextualLayers = [
  // "BODY__CTR BEAM__ctr beam inside surfaces.glb",
  "BODY__HULLS & DECKS__MESH H&D (for website)__HULL.glb",
  "BODY__CTR BEAM__ctr beam outside surfaces.glb",
  "BODY__HULLS & DECKS__MESH H&D (for website)__DECK.glb",
];

export type Model = {
  filename: string;
  layer_name: string;
  bounding_box: BoundingBox;
  normalized_size: BoundingBox;
  system: string;
};

export type ModelManifest = {
  exported_layers: Array<{
    filename: string;
    layer_name: string;
    bounding_box: BoundingBox;
    normalized_size: BoundingBox;
    file_size: number;
  }>;
  export_info: {
    timestamp_end: Date;
  };
};

export type MaterialIndex = {
  [key: string]: Array<string>;
};

export const processModels = (models_manifest: ModelManifest): Array<Model> => {
  return models_manifest.exported_layers
    .filter((d) => d.file_size > 0 && d.file_size < 100000000)
    .map((d) => ({
      filename: d.filename,
      layer_name: d.layer_name,
      bounding_box: d.bounding_box,
      normalized_size: d.normalized_size,
      system: d.filename.split("__")[0],
    }));
};

export type SystemsMap = { [key: string]: { children: string[]; i: number } };
export const getSystemMap = (
  layers: Array<{ filename: string }>,
): SystemsMap => {
  const systemsMap: SystemsMap = {};

  layers.forEach((layer: { filename: string }) => {
    const systemParts = layer.filename
      .replaceAll(".", "")
      .replace("glb", "")
      .split("__");

    systemParts.forEach((sys, i) => {
      // if (i < 3) {
      if (!systemsMap[sys]) {
        systemsMap[sys] = {
          children: [],
          i: i,
        };
      }
      systemsMap[sys].children.push(layer.filename);
      // }
    });
  });

  return systemsMap;
};

export const INCHES_TO_METERS = 0.0254;

type BoundingBox = {
  min: { x: number; y: number; z: number };
  max: { x: number; y: number; z: number };
  center: { x: number; y: number; z: number };
  dimensions: { width: number; depth: number; height: number };
};

export function computeCombinedBoundingBox(boxes: BoundingBox[]): Box3 {
  if (!boxes || boxes.length === 0) {
    console.error("Cannot compute bounding box from empty array");

    return new Box3(new Vector3(0, 0, 0), new Vector3(0, 0, 0));
  }

  const scale = INCHES_TO_METERS;

  // Rhino: X, Y, Z → Three.js: X, Z, Y (swap Y and Z)
  const combinedMin = {
    x: boxes[0].min.x * scale,
    y: boxes[0].min.z * scale, // Rhino Z → Three.js Y
    z: boxes[0].min.y * scale, // Rhino Y → Three.js Z
  };

  const combinedMax = {
    x: boxes[0].max.x * scale,
    y: boxes[0].max.z * scale, // Rhino Z → Three.js Y
    z: boxes[0].max.y * scale, // Rhino Y → Three.js Z
  };

  for (let i = 1; i < boxes.length; i++) {
    const box = boxes[i];

    combinedMin.x = Math.min(combinedMin.x, box.min.x * scale);
    combinedMin.y = Math.min(combinedMin.y, box.min.z * scale); // Rhino Z → Three.js Y
    combinedMin.z = Math.min(combinedMin.z, box.min.y * scale); // Rhino Y → Three.js Z

    combinedMax.x = Math.max(combinedMax.x, box.max.x * scale);
    combinedMax.y = Math.max(combinedMax.y, box.max.z * scale); // Rhino Z → Three.js Y
    combinedMax.z = Math.max(combinedMax.z, box.max.y * scale); // Rhino Y → Three.js Z
  }

  return new Box3(
    new Vector3(combinedMin.x, combinedMin.y, combinedMin.z),
    new Vector3(combinedMax.x, combinedMax.y, combinedMax.z),
  );
}

export const weightData = {
  "POWER ARCHITECTURE__SIMPLIFIED BATT RACKS.glb": {
    quantity: 8,
    weightPerUnit: 200,
  },
  "POWER ARCHITECTURE__SOLAR__SIMPLIFIED SOLAR PANELS.glb": {
    quantity: 15,
    weightPerUnit: 61,
  },
  "OUTFITTING_INTERIOR__galley, workbench, shelving, etc.__CABINETS__WM CABINET__watermaker cabinet.glb":
    {
      quantity: 1,
      weightPerUnit: 60,
    },
  "OUTFITTING_INTERIOR__Isotherm Drawer 65 - FROST FREE Refrigerator.glb": {
    quantity: 1,
    weightPerUnit: 70,
  },
  "OUTFITTING_INTERIOR__Isotherm Drawer 55 \u2013 Frost Free Freezer.glb": {
    quantity: 1,
    weightPerUnit: 70,
  },
  "OUTFITTING_INTERIOR__helm seat.glb": {
    quantity: 1,
    weightPerUnit: 150,
  },
  "OUTFITTING_INTERIOR__galley, workbench, shelving, etc.__workbench.glb": {
    quantity: 1,
    weightPerUnit: 150,
  },
  "WATER_HEATING SYSTEMS__TANKS__hot water tank (model_).glb": {
    quantity: 1,
    weightPerUnit: 54,
  },
  "WATER_HEATING SYSTEMS__TANKS__holding tank 25 gal TOD 85-1532WH.glb": {
    quantity: 1,
    weightPerUnit: 110,
  },
  "WATER_HEATING SYSTEMS__TANKS__port FW tank (35 gal) Todd MFG __85-1525WH.glb":
    {
      quantity: 1,
      weightPerUnit: 150,
    },
  // "SUPERSTRUCTURE__ALUM. PARTS+__PLATING.glb": {
  //   quantity: 1,
  //   weightPerUnit: 578,
  // },
  // "SUPERSTRUCTURE__ALUM. PARTS+__TOE-KICKS__TOE-KICK SURFS.glb": {
  //   quantity: 1,
  //   weightPerUnit: 111,
  // },
  // "SUPERSTRUCTURE__ALUM. PARTS+__flat bar base__5_ X 3_8_ baseplate surfs.glb":
  //   {
  //     quantity: 1,
  //     weightPerUnit: 143,
  //   },
  // "SUPERSTRUCTURE__ALUM. PARTS+__FASCIA__fascia plates.glb": {
  //   quantity: 1,
  //   weightPerUnit: 106,
  // },
  // "SUPERSTRUCTURE__ALUM. PARTS+__FRAMING__4_ SQ TUBE.glb": {
  //   quantity: 1,
  //   weightPerUnit: 284,
  // },
  // "SUPERSTRUCTURE__ALUM. PARTS+__FRAMING__1_ X 2_ TUBE.glb": {
  //   quantity: 1,
  //   weightPerUnit: 161.5,
  // },
  // "SUPERSTRUCTURE__ALUM. PARTS+__FRAMING__1.5_ SQ TUBE.glb": {
  //   quantity: 1,
  //   weightPerUnit: 58.5,
  // },
  // "SUPERSTRUCTURE__ALUM. PARTS+__RAILINGS & POSTS__SCH40 1_ nominal pipe.glb": {
  //   quantity: 1,
  //   weightPerUnit: 51,
  // },
  // "SUPERSTRUCTURE__ALUM. PARTS+__FRAMING__nonstandard framing.glb": {
  //   quantity: 1,
  //   weightPerUnit: 61,
  // },
  // "SUPERSTRUCTURE__WINDOWS__window panes.glb": {
  //   quantity: 1,
  //   weightPerUnit: 64,
  // },
  "OUTFITTING_INTERIOR__FWD TRAMPOLINE AREA__cross beam.glb": {
    quantity: 1,
    weightPerUnit: 150,
  },
  "POWER ARCHITECTURE__ELEC BOARD COMPONENTS__COTEK SP-3000 (3000W) inverter.glb":
    {
      quantity: 1,
      weightPerUnit: 18,
    },
  "CONTROL__STEERING__STEERING COMPONENTS__autopilot DD1.glb": {
    quantity: 1,
    weightPerUnit: 26.5,
  },
  "PROPULSION__20W Bell Marine Motor__MOTOR CONTROLLER APPROX.glb": {
    quantity: 2,
    weightPerUnit: 40,
  },
  "PROPULSION__20W Bell Marine Motor__SIMPLIFIED 20W Bell surfs.glb": {
    quantity: 2,
    weightPerUnit: 225,
  },
  "WATER_HEATING SYSTEMS__Headhunter Royal Flush Espresso.glb": {
    quantity: 1,
    weightPerUnit: 50,
  },
  "OUTFITTING_INTERIOR__portland pudgy__PORTLAND PUDGY SIMPLIFIED.glb": {
    quantity: 1,
    weightPerUnit: 128,
  },
  "PROPULSION__MOTOR MOUNT__motor mount surfaces.glb": {
    quantity: 2,
    weightPerUnit: 21,
  },
  "POWER ARCHITECTURE__ELEC BOARD COMPONENTS__victron lynx distributor.glb": {
    quantity: 3,
    weightPerUnit: 5,
  },
  "POWER ARCHITECTURE__ELEC BOARD COMPONENTS__IMO-2108 4 string - DC disconnect.glb":
    {
      quantity: 1,
      weightPerUnit: 3,
    },
  "POWER ARCHITECTURE__ELEC BOARD COMPONENTS__MPPT250_70-Tr solar charge controller.glb":
    {
      quantity: 4,
      weightPerUnit: 6.6,
    },
  "POWER ARCHITECTURE__ELEC BOARD COMPONENTS__Orion 360W isolated DC-DC converter.glb":
    {
      quantity: 3,
      weightPerUnit: 4,
    },
  "POWER ARCHITECTURE__ELEC BOARD COMPONENTS__ELCON HK-J 6.6KW charger.glb": {
    quantity: 2,
    weightPerUnit: 25.5,
  },
  "BODY__INTERNALS__soles & bhds.glb": {
    quantity: 1,
    weightPerUnit: 365.7 + 47 + 366 + 265 + 211,
  },
  "BODY__INTERNALS__stringers.glb": {
    quantity: 4,
    weightPerUnit: 20,
  }
  // "BODY__HULLS & DECKS__MESH H&D (for website)__HULL.glb": {
  //   quantity: 1,
  //   weightPerUnit: 2501.8,
  // },
  // "BODY__HULLS & DECKS__MESH H&D (for website)__DECK.glb": {
  //   quantity: 1,
  //   weightPerUnit: 1796.9,
  // },
  // "BODY__CTR BEAM__ctr beam outside surfaces.glb": {
  //   quantity: 1,
  //   weightPerUnit: 984.3,
  // },
};

export const systemWeightData = {
  BODY: {
    weight: 6700,
  },
  SUPERSTRUCTURE: {
    weight: 578 + 111 + 143 + 106 + 284 + 161.5 + 58.5 + 51 + 61 + 64,
  },
};

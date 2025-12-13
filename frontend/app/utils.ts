/**
 * Format dates consistently
 */
export function formatDate(date: string | Date) {
  // return new Date(date).toLocaleDateString();

  date = new Date(date);

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const paddedDay = String(day).padStart(2, "0");
  const paddedMonth = String(month).padStart(2, "0");

  return `${year}–${paddedMonth}–${paddedDay}`;
}

export const slugToRhinoSystem = (slug: string) => {
  switch (slug) {
    case "water-heating-systems":
      return "water_heating systems".toUpperCase();
    case "outfitting-interior":
      return slug.replaceAll("-", "_").toUpperCase();
    default:
      return slug.replaceAll("-", " ").toUpperCase();
  }
};

/**
 *
 */
export const filterLayersWhenPossible = (layers) => {
  const filtered = layers.filter(
    (layer) =>
      ![
        "BODY__INTERNALS",
        "CONTROL__MECHANICAL STEERING__STEERING COMPONENTS__tillers",
        "CONTROL__MECHANICAL STEERING__STEERING COMPONENTS__Washer, delrin",
        "CONTROL__MECHANICAL STEERING__STEERING COMPONENTS__JEFA",
        "CONTROL__MECHANICAL STEERING__STEERING COMPONENTS__50mm dummy",
        "CONTROL__MECHANICAL STEERING__STEERING SHELVES__port dummy ",
        "CONTROL__MECHANICAL STEERING__steering tunnels",
        "CONTROL__MECHANICAL STEERING__STEERING COMPONENTS__locking rings",
        "CONTROL__ELECTRONIC CONTROL__autopilot",
        "CONTROL__rudder assembly__Rudder tube",
        "CONTROL__rudder assembly__Turcite",
        "SUPERSTRUCTURE__WIREWAYS__ww parts surfs",
        "POWER ARCHITECTURE__SMARTPLUG INLET SYSTEM",
        "POWER ARCHITECTURE__ELEC BOARD COMPONENTS",
        "OUTFITTING_INTERIOR__SIMPLIFIED CTR DECK TRACKS",
        "OUTFITTING_INTERIOR__COMPANIONWAY HATCH__SIMPLIFIED TRACK HARDWARE",
        "PROPULSION__MOTOR MOUNT",
        "PROPULSION__20W Bell Marine Motor",
        "PROPULSION__SHAFTLINE COMPONENTS__PSS shaft seal",
        "PROPULSION__SHAFTLINE COMPONENTS__stern tube",
        "PROPULSION__SHAFTLINE COMPONENTS__Cutless Bearing",
        "CONTROL__rudder assembly__SS sleeve",
        "OUTFITTING_INTERIOR__COMPANIONWAY HATCH__MF-02-110-60 sliding door",
        "OUTFITTING_INTERIOR__BATTERY CMPT",
        "WATER_HEATING SYSTEMS__TANKS_",
        "WATER_HEATING SYSTEMS__HEAT PUMP VENTS",
        "WATER_HEATING SYSTEMS__heat pump",
        "WATER_HEATING SYSTEMS__Headhunter",
        "OUTFITTING_INTERIOR__SHOWER AFT STBD",
        "OUTFITTING_INTERIOR__cleats",
        "OUTFITTING_INTERIOR__galley, workbench, shelving, etc.__CABINETS",
        "OUTFITTING_INTERIOR__galley, workbench, shelving, etc.__SHELF SURFS",
        "SUPERSTRUCTURE__ALUM. PARTS+__flat bar base",
        "OUTFITTING_INTERIOR__COMPANIONWAY HATCH__companionway hatch",
        "SUPERSTRUCTURE__ALUM. PARTS+__TOE-KICKS__TOE-KICK 1_4_ FHMS.glb",
        "BODY__CTR BEAM__fwd beam hatches",
        "BODY__CTR BEAM__ctr beam inside surfaces",
        "OUTFITTING_INTERIOR__DECK ACCESS STAIRLADDER",
        "OUTFITTING_INTERIOR__galley, workbench, shelving, etc.__workbench",
        "OUTFITTING_INTERIOR__galley, workbench, shelving, etc.__GALLEY",
        "SUPERSTRUCTURE__WINDOWS__rough window hardware & trim",
        "SUPERSTRUCTURE__instr panel & wireway__instrument panel 1_2_ StarBoard",
        "SUPERSTRUCTURE__ALUM. PARTS+__FASCIA__fascia flange brackets",
        "CONTROL__rudder assembly__SS thrust bearing",
        "CONTROL__rudder assembly__foil top wedge contoured",
      ].find((n) => layer.filename.startsWith(n)),
  );
  return filtered;
};

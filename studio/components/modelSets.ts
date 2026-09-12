import data from '../script_output/model_export_manifest.json'
import jigData from '../script_output/model_jig_export_manifest.json'
import batteryData from '../script_output/model_battery_export_manifest.json'

type Manifest = {exported_layers: {filename: string}[]}

/**
 * Manifests outside the main Rhino export. These are offered whole, as one
 * set per system, rather than by layer — and future auxiliary exports belong
 * in this list too.
 */
const SET_MANIFESTS: Manifest[] = [jigData, batteryData]

/** Path separator inside a GLB filename: "BODY__CTR BEAM__DECK.glb". */
export const SEPARATOR = '__'

/**
 * A set is stored as its system prefix, e.g. "BATTERY MODULE V2__". The front
 * end expands it to every layer under that prefix at render time, so the block
 * keeps working when a part inside the set is renamed. Only the system name
 * itself is a link.
 */
export const isGroup = (entry: string): boolean => entry.endsWith(SEPARATOR)

export type ModelGroup = {
  /** The stored value: "BATTERY MODULE V2__" */
  prefix: string
  /** Path segments without the trailing separator — one segment for a set */
  path: string[]
  /** Humanised system name: "Battery module v2" */
  title: string
  /** Layers currently under this prefix */
  count: number
}

/** "BATTERY MODULE V1" → "Battery module v1". */
function humanise(segment: string): string {
  const spaced = segment.replace(/_/g, ' ').toLowerCase()
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

/** One set per system across the auxiliary manifests. */
export const MODEL_GROUPS: ModelGroup[] = (() => {
  const counts = new Map<string, number>()
  for (const manifest of SET_MANIFESTS) {
    for (const {filename} of manifest.exported_layers) {
      const prefix = filename.split(SEPARATOR)[0] + SEPARATOR
      counts.set(prefix, (counts.get(prefix) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .map(([prefix, count]) => {
      const system = prefix.slice(0, -SEPARATOR.length)
      return {prefix, path: [system], title: humanise(system), count}
    })
    .sort((a, b) => a.title.localeCompare(b.title))
})()

export function groupForPrefix(prefix: string): ModelGroup | undefined {
  return MODEL_GROUPS.find((g) => g.prefix === prefix)
}

/** Individually selectable models — the Rhino layers only. */
export const rhinoModels: string[] = data.exported_layers.map((f) => f.filename)

export function modelTitle(filename: string): string {
  const parts = filename.replace('.glb', '').split(SEPARATOR)
  return parts[parts.length - 1]
}

/** "BODY__CTR BEAM__DECK.glb" → "BODY / CTR BEAM" */
export function parentPath(filename: string): string {
  return filename.replace('.glb', '').split(SEPARATOR).slice(0, -1).join(' / ')
}

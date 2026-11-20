/**
 * Sound-effect helpers for the HyperFrames project.
 *
 * Reads assets/sfx/registry.json (built from Wyzowl's SFX Kit, CC0) and returns
 * the `<audio>` attributes that mount one cue on the film timeline:
 *
 *   data-start = eventTime - sync.at   (so the sync point lands on the event)
 *
 * Usage in a scene:
 *
 *   <template>
 *     …
 *     <script type="module" src="../scripts/sfx.js"></script>
 *     <script>
 *       import { cue } from "../scripts/sfx.js";
 *       // mounts a "pop" whose peak lands at 2.3 s of this composition
 *       document.write(`<audio ${cue("pop", 2.3).attr()}></audio>`);
 *     </script>
 *   </template>
 */

import registry from "../assets/sfx/registry.json" assert { type: "json" };

const CUES = registry.cues;
const TRACK = registry.usage.trackIndex;

/** Return the `{ attr, ... }` for one `<audio>` cue named `name` mounted at
 * `eventTime` (seconds from the start of this composition). `attr()` renders
 * the HTML attribute string. */
export function cue(name, eventTime) {
  const c = CUES[name];
  if (!c) throw new Error(`unknown sfx cue "${name}". Known: ${Object.keys(CUES).join(", ")}`);
  if (typeof eventTime !== "number" || !Number.isFinite(eventTime))
    throw new Error(`sfx cue "${name}": eventTime must be a number of seconds`);

  const syncAt = c.sync.at;
  const start = Math.max(0, eventTime - syncAt);
  const duration = c.duration;

  const attrs = {
    id: `sfx-${name}-${Math.round(eventTime * 1000)}`,
    class: "clip",
    src: c.file,
    "data-track-index": TRACK,
    "data-start": start.toFixed(3),
    "data-duration": duration.toFixed(3),
    "data-volume": c.recommendedVolume.toFixed(2),
    "data-sync-at": syncAt.toFixed(3),
    "data-source-id": c.sourceId,
    "data-under-voiceover-db": c.under_voiceover_db,
  };

  return {
    attr: () => Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(" "),
    start,
    duration,
    syncAt,
    cue: c,
  };
}

/** Return every cue's name, source and recommended volume. */
export function all() {
  return Object.fromEntries(
    Object.entries(CUES).map(([name, c]) => [name, { file: c.file, volume: c.recommendedVolume }]),
  );
}

/** Recommended volume for a cue when its body overlaps a voiceover: the cue's
 * recommendedVolume attenuated by its `under_voiceover_db`. */
export function volumeUnderVoiceover(name) {
  const c = CUES[name];
  if (!c) throw new Error(`unknown sfx cue "${name}"`);
  return c.recommendedVolume * 10 ** (c.under_voiceover_db / 20);
}

#!/usr/bin/env node
/* Design guard: fails when a scene invents styles instead of using the system. */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SCENE_DIR = join(ROOT, "compositions");

const ANIMS = new Set([
  "fade",
  "fade-up",
  "fade-down",
  "slide-left",
  "slide-right",
  "scale-in",
  "grow-x",
  "grow-y",
  "draw",
  "count",
  "highlight",
  "pulse",
  "cursor",
]);

const problems = [];

function files(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });
}

function report(file, line, message) {
  problems.push(`${relative(ROOT, file)}:${line}  ${message}`);
}

for (const file of files(SCENE_DIR).filter((f) => f.endsWith(".html"))) {
  const source = readFileSync(file, "utf8");
  const lines = source.split("\n");

  lines.forEach((text, i) => {
    const line = i + 1;

    const hex = text.match(
      /(?<![\w&])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g
    );
    if (hex) report(file, line, `raw colour ${hex.join(", ")} — use a token`);

    if (/font-family\s*:/.test(text))
      report(file, line, "font-family belongs in tokens.css");

    if (/(^|[^-])\btransition\s*:/.test(text))
      report(file, line, "CSS transitions are banned — use data-anim");

    if (/(^|[^-])\banimation\s*:/.test(text))
      report(file, line, "CSS animations are banned — use data-anim");

    if (/Math\.random|Date\.now|requestAnimationFrame/.test(text))
      report(file, line, "non-deterministic API — renders must be seekable");

    if (/signal-editorial/.test(text))
      report(file, line, "retired stylesheet — link styles/tokens.css instead");
  });

  const anims = [
    ...source.matchAll(/data-anim(?:-group)?="([^"]+)"/g),
  ].map((m) => m[1]);
  for (const anim of anims) {
    if (!ANIMS.has(anim)) report(file, 0, `unknown data-anim value "${anim}"`);
  }

  if (!/data-composition-id="/.test(source))
    report(file, 0, "missing data-composition-id on the composition root");
}

if (problems.length) {
  console.error(`Design audit failed with ${problems.length} problem(s):\n`);
  for (const problem of problems) console.error(`  ${problem}`);
  process.exit(1);
}

console.log("Design audit passed: no raw colours, ad-hoc fonts, CSS motion or unknown animations.");

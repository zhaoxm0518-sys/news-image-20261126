// Sum up 26 November 2026 in one image: 55 stories, 7 regions.
// This program ships the finished image beside it as entry.png and
// copies it to the output directory make.fun grades.
import { copyFileSync, mkdirSync, statSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "entry.png");
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const dest = join(outDir, "entry.png");

mkdirSync(outDir, { recursive: true });
copyFileSync(source, dest);
const sourceSize = statSync(source).size;
const written = statSync(dest);
if (!written.isFile() || written.size !== sourceSize) {
  unlinkSync(dest);
  throw new Error(`bad output: ${dest} does not match ${source}`);
}
console.log(`wrote ${dest} (${written.size} bytes, verified)`);

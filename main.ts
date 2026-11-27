import { copyFileSync, statSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, "entry.png");
const dst = join(outDir, "entry.png");

const srcStat = statSync(src);
if (!srcStat.isFile()) {
  throw new Error(`source is not a regular file: ${src}`);
}

copyFileSync(src, dst);

const srcSize = srcStat.size;
const dstStat = statSync(dst);
if (!dstStat.isFile() || dstStat.size !== srcSize) {
  try {
    unlinkSync(dst);
  } catch {
    // destination was already gone or never written
  }
  throw new Error(`verification failed: wrote ${dstStat.size} bytes, expected ${srcSize}`);
}
console.log(`wrote ${dst} (${dstStat.size} bytes, verified)`);

// Entry program: place the pre-rendered front page where the grader looks.
// The image itself is the entry; this program only copies it to /output.
import { copyFile, mkdir, rm, stat } from "node:fs/promises";
import { join } from "node:path";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "out";
const src = new URL("./entry.png", import.meta.url).pathname;
const dst = join(outDir, "entry.png");

await mkdir(outDir, { recursive: true });
await copyFile(src, dst);

// Verify the copy before reporting success: the destination must be a
// regular file whose size matches the source exactly. A partial or missing
// copy is a failed run, not a silent success.
const [srcInfo, dstInfo] = await Promise.all([stat(src), stat(dst)]);
if (!dstInfo.isFile() || dstInfo.size !== srcInfo.size) {
  await rm(dst, { force: true });
  console.error(`copy failed: ${dst} is not a complete copy of ${src}`);
  process.exit(1);
}
console.log(`wrote ${dst} (${dstInfo.size} bytes, verified)`);

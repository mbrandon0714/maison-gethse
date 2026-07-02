// Compress every JPG/PNG under public/images to web-appropriate size.
// Originals are copied to assets-archive/images-original before overwrite.
import sharp from "sharp";
import { readdir, stat, mkdir, copyFile } from "fs/promises";
import { join, relative, dirname } from "path";

const SRC = "public/images";
const BACKUP = "assets-archive/images-original";
const MAX_WIDTH = 2000;
const QUALITY = 80;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else if (/\.(jpe?g|png)$/i.test(entry.name)) yield p;
  }
}

let totalBefore = 0, totalAfter = 0, count = 0;

for await (const file of walk(SRC)) {
  const before = (await stat(file)).size;
  if (before < 300 * 1024) { totalBefore += before; totalAfter += before; continue; } // skip already-small files

  const backupPath = join(BACKUP, relative(SRC, file));
  await mkdir(dirname(backupPath), { recursive: true });
  await copyFile(file, backupPath);

  const isPng = /\.png$/i.test(file);
  const img = sharp(file).rotate().resize({ width: MAX_WIDTH, withoutEnlargement: true });
  const buf = isPng
    ? await img.png({ compressionLevel: 9, palette: true }).toBuffer()
    : await img.jpeg({ quality: QUALITY, mozjpeg: true }).toBuffer();

  await sharp(buf).toFile(file + ".tmp");
  const { rename, unlink } = await import("fs/promises");
  await unlink(file);
  await rename(file + ".tmp", file);

  const after = (await stat(file)).size;
  totalBefore += before; totalAfter += after; count++;
  console.log(`${relative(SRC, file)}: ${(before / 1e6).toFixed(1)}MB → ${(after / 1e6).toFixed(2)}MB`);
}

console.log(`\nOptimized ${count} files: ${(totalBefore / 1e6).toFixed(0)}MB → ${(totalAfter / 1e6).toFixed(0)}MB`);

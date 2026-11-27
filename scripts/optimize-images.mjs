/**
 * Generates .webp twins for every .png/.jpg/.jpeg under public/.
 *
 * - Idempotent: skips files whose .webp is newer than the source.
 * - Keeps full resolution (only caps at MAX_WIDTH) — sources are ~2x
 *   of display size, which is what Retina screens need.
 * - Runs automatically via predev/prebuild; safe to run manually:
 *   npm run optimize
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC_DIR = path.join(ROOT, 'public')
const MAX_WIDTH = 2800
const QUALITY = 82
const SOURCE_EXT = /\.(png|jpe?g|gif)$/i

async function* walk(dir) {
  let entries
  try {
    entries = await fs.readdir(dir, { withFileTypes: true })
  } catch {
    return
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else if (SOURCE_EXT.test(entry.name)) yield full
  }
}

async function isFresh(webpPath, sourceMtime) {
  try {
    return (await fs.stat(webpPath)).mtimeMs >= sourceMtime
  } catch {
    return false
  }
}

let converted = 0
let skipped = 0
let savedBytes = 0
const failures = []

for await (const file of walk(PUBLIC_DIR)) {
  const webpPath = file.replace(SOURCE_EXT, '.webp')
  const { mtimeMs, size } = await fs.stat(file)
  if (await isFresh(webpPath, mtimeMs)) {
    skipped++
    continue
  }
  try {
    await sharp(file, { animated: true })
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(webpPath)
    const { size: webpSize } = await fs.stat(webpPath)
    converted++
    savedBytes += size - webpSize
    const rel = path.relative(PUBLIC_DIR, file)
    console.log(
      `  ${rel}: ${(size / 1e6).toFixed(1)}MB → ${(webpSize / 1e6).toFixed(2)}MB`,
    )
  } catch (err) {
    failures.push(`${path.relative(PUBLIC_DIR, file)}: ${err.message}`)
  }
}

console.log(
  `\noptimize-images: ${converted} converted, ${skipped} up-to-date` +
    (converted ? `, saved ${(savedBytes / 1e6).toFixed(1)}MB` : ''),
)
if (failures.length) {
  console.error('Failed:\n  ' + failures.join('\n  '))
  process.exitCode = 1
}

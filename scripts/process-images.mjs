#!/usr/bin/env node
/**
 * Pipeline de imágenes — Sesión W0 (brief §9).
 *
 * Lee ~/Desktop/imagenes alto castillo (organizada por Adrián/Carolina en
 * carpetas por uso), clasifica cada carpeta a un slug de habitación/uso,
 * corrige orientación EXIF, renombra con nombres SEO descriptivos y genera
 * derivados AVIF/WebP en 2 anchos responsive (800w tarjeta, 1600w hero).
 *
 * HEIC no lo decodifica `sharp` en este build (sin libheif) — se convierte
 * primero a JPEG con `sips` (nativo de macOS, sin dependencia nueva).
 *
 * Uso: node scripts/process-images.mjs
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, statSync, rmSync, writeFileSync } from "node:fs";
import { join, extname, basename } from "node:path";
import os from "node:os";
import sharp from "sharp";

const SOURCE_DIR = join(os.homedir(), "Desktop", "imagenes alto castillo");
const OUTPUT_DIR = join(process.cwd(), "public", "images");
const WIDTHS = [
  { suffix: "card", width: 800 },
  { suffix: "hero", width: 1600 },
];

// Carpeta de origen -> { slug, label usado en el nombre de archivo y alt text }
const FOLDER_MAP = {
  "Fotos exterior": { slug: "exterior", label: "vista exterior de Alto Castillo Lodge, Cerro Castillo" },
  "Habitacion Suite": { slug: "suite-principal", label: "Suite Principal, Alto Castillo Lodge" },
  "Deluxe Superior": { slug: "deluxe-superior", label: "Habitación Deluxe Superior, Alto Castillo Lodge" },
  "Habitacion Deluxe": { slug: "deluxe", label: "Habitación Deluxe, Alto Castillo Lodge" },
  // "Living y Hab std" se resuelve por sub-carpeta más abajo: la raíz es
  // living/común, "Hab STD" adentro es la habitación Standard.
  "Living y Hab std": { slug: "living-comun", label: "living y comedor común, Alto Castillo Lodge" },
  "Living y Hab std/Hab STD": { slug: "standard", label: "Habitación Standard, Alto Castillo Lodge" },
};

function listSourceFiles() {
  /** @type {{absPath: string, folderKey: string}[]} */
  const files = [];
  function walk(dir, folderKey) {
    for (const entry of readdirSync(dir)) {
      if (entry === ".DS_Store") continue;
      const abs = join(dir, entry);
      const stat = statSync(abs);
      if (stat.isDirectory()) {
        const nestedKey = folderKey ? `${folderKey}/${entry}` : entry;
        walk(abs, nestedKey);
      } else {
        files.push({ absPath: abs, folderKey });
      }
    }
  }
  walk(SOURCE_DIR, "");
  return files;
}

function resolveMapping(folderKey) {
  if (FOLDER_MAP[folderKey]) return FOLDER_MAP[folderKey];
  // fallback: buscar por el segmento final de la ruta si no matchea exacto
  const lastSegment = folderKey.split("/").pop();
  const found = Object.entries(FOLDER_MAP).find(([key]) => key.endsWith(lastSegment));
  return found ? found[1] : null;
}

function heicToJpegBuffer(absPath, tmpDir) {
  const tmpJpeg = join(tmpDir, `${basename(absPath, extname(absPath))}.jpg`);
  execFileSync("sips", ["-s", "format", "jpeg", absPath, "--out", tmpJpeg], { stdio: "pipe" });
  return tmpJpeg;
}

async function main() {
  rmSync(OUTPUT_DIR, { recursive: true, force: true });
  mkdirSync(OUTPUT_DIR, { recursive: true });
  const tmpDir = join(os.tmpdir(), "alto-castillo-heic-" + Date.now());
  mkdirSync(tmpDir, { recursive: true });

  const files = listSourceFiles();
  /** @type {Record<string, {src: string, alt: string}[]>} */
  const manifest = {};
  let processed = 0;
  let skipped = 0;

  for (const { absPath, folderKey } of files) {
    const mapping = resolveMapping(folderKey);
    if (!mapping) {
      console.warn(`[omitido] carpeta sin mapeo: "${folderKey}" (${basename(absPath)})`);
      skipped++;
      continue;
    }

    const ext = extname(absPath).toLowerCase();
    let inputPath = absPath;
    if (ext === ".heic") {
      try {
        inputPath = heicToJpegBuffer(absPath, tmpDir);
      } catch (e) {
        console.warn(`[omitido] no se pudo convertir HEIC: ${absPath} (${e.message})`);
        skipped++;
        continue;
      }
    } else if (![".jpg", ".jpeg", ".png"].includes(ext)) {
      console.warn(`[omitido] formato no soportado: ${absPath}`);
      skipped++;
      continue;
    }

    const slugDir = join(OUTPUT_DIR, mapping.slug);
    mkdirSync(slugDir, { recursive: true });

    manifest[mapping.slug] = manifest[mapping.slug] || [];
    const index = manifest[mapping.slug].length + 1;
    const seoBase = `${mapping.slug}-${String(index).padStart(2, "0")}`;

    const image = sharp(inputPath).rotate(); // auto-orienta según EXIF, luego lo descarta
    const entryDerivatives = [];

    for (const { suffix, width } of WIDTHS) {
      for (const format of ["webp", "avif"]) {
        const fileName = `${seoBase}-${suffix}.${format}`;
        const outPath = join(slugDir, fileName);
        const pipeline = image.clone().resize({ width, withoutEnlargement: true });
        if (format === "webp") await pipeline.webp({ quality: 78 }).toFile(outPath);
        else await pipeline.avif({ quality: 55 }).toFile(outPath);
        entryDerivatives.push(`/images/${mapping.slug}/${fileName}`);
      }
    }

    // La página placeholder usa el derivado "hero" en webp (soporte universal);
    // AVIF queda generado y listo para cuando se arme <picture> con fallback.
    manifest[mapping.slug].push({
      src: `/images/${mapping.slug}/${seoBase}-hero.webp`,
      alt: mapping.label,
    });
    processed++;
  }

  writeFileSync(join(OUTPUT_DIR, "manifest.json"), JSON.stringify(manifest, null, 2));
  rmSync(tmpDir, { recursive: true, force: true });

  console.log(`\nListo: ${processed} fotos procesadas, ${skipped} omitidas.`);
  for (const [slug, items] of Object.entries(manifest)) {
    console.log(`  - ${slug}: ${items.length} fotos`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

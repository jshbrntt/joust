import AdmZip from "adm-zip";
import path from "node:path";
import {
  color,
  copyFileEnsured,
  ensureDir,
  exists,
  hasFlag,
  main,
  removePath,
  requireFiles,
  requireTools,
  resolveRoot,
  run,
  sha1,
  useColor,
} from "./lib.ts";

const binDir = resolveRoot("bin");
const romDir = resolveRoot("bin/roms");
const originalDir = resolveRoot("bin/original");
const originalZip = path.join(originalDir, "joust.zip");
const originalStamp = path.join(originalDir, ".extracted");
const originalUrl = "https://ia800603.us.archive.org/3/items/arcade_joust/joust.zip";
const rewriteDir = resolveRoot("src/rewrite");

type Slice = {
  file: string;
  range: string;
};

type Variant = {
  name: string;
  source: string;
  program: string;
  listing: string;
  outputs: Slice[];
};

const commonSources = [
  "JOUSTI.ASM",
  "RAMDEF.ASM",
  "EQU.ASM",
  "MESSEQU.ASM",
  "MESSEQU2.ASM",
  "MESSAGE.ASM",
  "PHRASE.ASM",
  "ATT.ASM",
  "SYSTEM.ASM",
  "joust_mods.ASM",
];

const variants: Variant[] = [
  {
    name: "joust",
    source: "make.ASM",
    program: "joust.p",
    listing: "joust.lst",
    outputs: [
      ["3006-13.1b", "0x0000-0x0FFF"],
      ["3006-14.2b", "0x1000-0x1FFF"],
      ["3006-15.3b", "0x2000-0x2FFF"],
      ["3006-16.4b", "0x3000-0x3FFF"],
      ["3006-17.5b", "0x4000-0x4FFF"],
      ["3006-18.6b", "0x5000-0x5FFF"],
      ["3006-19.7b", "0x6000-0x6FFF"],
      ["3006-20.8b", "0x7000-0x7FFF"],
      ["3006-21.9b", "0x8000-0x8FFF"],
      ["3006-22.10b", "0xD000-0xDFFF"],
      ["3006-23.11b", "0xE000-0xEFFF"],
      ["3006-24.12b", "0xF000-0xFFFF"],
    ].map(([file, range]) => ({ file, range })),
  },
  {
    name: "joustr",
    source: "make_rv1.ASM",
    program: "joustr.p",
    listing: "joustr.lst",
    outputs: [
      ["joustr/joust.sr4", "0x3000-0x3FFF"],
      ["joustr/joust.sr6", "0x5000-0x5FFF"],
      ["joustr/joust.sr7", "0x6000-0x6FFF"],
      ["joustr/joust.sr8", "0x7000-0x7FFF"],
      ["joustr/joust.sr9", "0x8000-0x8FFF"],
      ["joustr/joust.sra", "0xD000-0xDFFF"],
      ["joustr/joust.srb", "0xE000-0xEFFF"],
      ["joustr/joust.src", "0xF000-0xFFFF"],
    ].map(([file, range]) => ({ file, range })),
  },
  {
    name: "joustwr",
    source: "make_rv2.ASM",
    program: "joustwr.p",
    listing: "joustwr.lst",
    outputs: [
      ["joustwr/joust.wr7", "0x6000-0x6FFF"],
      ["joustwr/joust.wra", "0xD000-0xDFFF"],
    ].map(([file, range]) => ({ file, range })),
  },
];

const variantExtraSources: Record<string, string[]> = {
  joust: ["TB12REV3.ASM", "JOUSTRV4.ASM", "T12REV3.ASM"],
  joustr: ["TB12REV1.ASM", "JOUSTRV1.ASM", "T12REV1.ASM"],
  joustwr: ["TB12REV3.ASM", "JOUSTRV2.ASM", "T12REV3.ASM"],
};

const mameEntries = [
  ["3006-13.1b", "joust_rom_1b_3006-13.e4"],
  ["3006-14.2b", "joust_rom_2b_3006-14.c4"],
  ["3006-15.3b", "joust_rom_3b_3006-15.a4"],
  ["3006-16.4b", "joust_rom_4b_3006-16.e5"],
  ["3006-17.5b", "joust_rom_5b_3006-17.c5"],
  ["3006-18.6b", "joust_rom_6b_3006-18.a5"],
  ["3006-19.7b", "joust_rom_7b_3006-19.e6"],
  ["3006-20.8b", "joust_rom_8b_3006-20.c6"],
  ["3006-21.9b", "joust_rom_9b_3006-21.a6"],
  ["3006-22.10b", "joust_rom_10b_3006-22.a7"],
  ["3006-23.11b", "joust_rom_11b_3006-23.c7"],
  ["3006-24.12b", "joust_rom_12b_3006-24.e7"],
  ["joust.snd", "video_sound_rom_4_std_780.ic12"],
  ["decoder.4", "decoder_rom_4.3g"],
  ["decoder.6", "decoder_rom_6.3c"],
] as const;

const verifyGroups = [
  {
    name: "joust (green label)",
    pairs: [
      ...variants[0].outputs.map((output) => [output.file, output.file]),
      ["joust.snd", "joust.snd"],
      ["decoder.4", "decoder.4"],
      ["decoder.6", "decoder.6"],
    ],
  },
  {
    name: "joustr (red label)",
    pairs: variants[1].outputs.map((output) => [output.file, output.file]),
  },
  {
    name: "joustwr (yellow label)",
    pairs: variants[2].outputs.map((output) => [output.file, output.file]),
  },
];

export const joustZip = path.join(romDir, "joust.zip");

async function preflight(): Promise<void> {
  await requireTools(["asl", "p2bin"]);
  await requireFiles([
    "src/rewrite/make.ASM",
    "src/rewrite/make_rv1.ASM",
    "src/rewrite/make_rv2.ASM",
    "src/rewrite/VSNDRM4.ASM",
    "src/rewrite/decoder_roms.asm",
    "tools/asl/Makefile",
  ]);
  try {
    await import("adm-zip");
  } catch {
    throw new Error("Missing package dependencies. Run: bun install");
  }
}

function sourcePath(file: string): string {
  return path.join(rewriteDir, file);
}

async function assemble(source: string, listing: string, program: string): Promise<void> {
  await run([
    "asl",
    sourcePath(source),
    "-L",
    "-olist",
    path.join(binDir, listing),
    "-o",
    path.join(binDir, program),
  ]);
}

async function slice(program: string, output: string, range: string): Promise<void> {
  const destination = path.join(romDir, output);
  await ensureDir(path.dirname(destination));
  await run(["p2bin", path.join(binDir, program), destination, "-l", "00", "-r", range]);
}

async function buildVariant(variant: Variant): Promise<void> {
  await requireFiles([
    `src/rewrite/${variant.source}`,
    ...commonSources.map((file) => `src/rewrite/${file}`),
    ...variantExtraSources[variant.name].map((file) => `src/rewrite/${file}`),
  ]);
  await assemble(variant.source, variant.listing, variant.program);
  for (const output of variant.outputs) {
    await slice(variant.program, output.file, output.range);
  }
}

async function buildSoundAndDecoder(): Promise<void> {
  await assemble("VSNDRM4.ASM", "vsndrm4.lst", "vsndrm4.p");
  await slice("vsndrm4.p", "joust.snd", "0xF000-0xFFFF");

  await assemble("decoder_roms.asm", "decoder.lst", "decoder.p");
  await slice("decoder.p", "decoder.4", "0x0000-0x01FF");
  await slice("decoder.p", "decoder.6", "0x0200-0x03FF");
}

async function writeMameZip(): Promise<void> {
  const zip = new AdmZip();
  for (const [source, entryName] of mameEntries) {
    zip.addLocalFile(path.join(romDir, source), "", entryName);
  }
  await ensureDir(path.dirname(joustZip));
  zip.writeZip(joustZip);
}

export async function buildRom(): Promise<void> {
  await preflight();
  await ensureDir(binDir);
  await ensureDir(romDir);
  for (const variant of variants) {
    await buildVariant(variant);
  }
  await buildSoundAndDecoder();
  await writeMameZip();
}

async function fetchWithRetries(url: string, attempts = 5): Promise<ArrayBuffer> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return await response.arrayBuffer();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await Bun.sleep(2000);
      }
    }
  }
  throw new Error(`Failed to download ${url}: ${lastError instanceof Error ? lastError.message : lastError}`);
}

export async function downloadOriginal(force = false): Promise<void> {
  if (force) {
    await removePath(originalDir);
  }
  if (await exists(originalStamp)) {
    return;
  }

  await ensureDir(originalDir);
  if (!(await exists(originalZip))) {
    console.log(`Downloading ${originalUrl}`);
    const data = await fetchWithRetries(originalUrl);
    await Bun.write(originalZip, data);
  }

  const zip = new AdmZip(originalZip);
  zip.extractAllTo(originalDir, true);
  await Bun.write(originalStamp, "");
}

async function verifyZipEntries(): Promise<string[]> {
  const failures: string[] = [];
  const zip = new AdmZip(joustZip);
  for (const [source, entryName] of mameEntries) {
    const entry = zip.getEntry(entryName);
    if (!entry) {
      failures.push(`missing zip entry ${entryName}`);
      continue;
    }
    const entryHash = await sha1(entry.getData());
    const sourceHash = await sha1(path.join(romDir, source));
    if (entryHash !== sourceHash) {
      failures.push(`zip entry mismatch ${entryName}`);
    }
  }
  return failures;
}

export async function verifyRom(args: string[]): Promise<void> {
  await buildRom();
  await downloadOriginal(hasFlag(args, "--force"));

  const palette = color(useColor(args));
  let failed = false;

  for (const group of verifyGroups) {
    console.log(group.name);
    for (const [builtRelative, originalRelative] of group.pairs) {
      const built = path.join(romDir, builtRelative);
      const original = path.join(originalDir, originalRelative);
      const builtHash = await sha1(built);
      const originalHash = await sha1(original);
      const ok = builtHash === originalHash;
      console.log(`  ${ok ? palette.green("OK") : palette.red("FAIL")}   ${builtRelative}`);
      if (!ok) {
        failed = true;
        console.log(`    built:    ${builtHash}`);
        console.log(`    original: ${originalHash} (${original})`);
      }
    }
  }

  const zipFailures = await verifyZipEntries();
  if (zipFailures.length > 0) {
    failed = true;
    console.log("joust.zip");
    for (const failure of zipFailures) {
      console.log(`  ${palette.red("FAIL")} ${failure}`);
    }
  }

  if (failed) {
    throw new Error("ROM verification failed");
  }
}

if (import.meta.main) {
  await main(async () => {
    const [command = "build", ...args] = Bun.argv.slice(2);
    if (command === "build") {
      await buildRom();
    } else if (command === "download") {
      await downloadOriginal(hasFlag(args, "--force"));
    } else if (command === "verify") {
      await verifyRom(args);
    } else {
      throw new Error(`Unknown rom command: ${command}`);
    }
  });
}

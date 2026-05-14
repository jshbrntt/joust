import path from "node:path";
import { cpus } from "node:os";
import {
  copyFileEnsured,
  ensureDir,
  exists,
  hasFlag,
  main,
  parseFlag,
  parseNumberFlag,
  removePath,
  requireFiles,
  requireTools,
  resolveRoot,
  run,
} from "./lib.ts";
import { buildRom, joustZip } from "./rom.ts";
import { serve } from "./server.ts";

const mameDir = resolveRoot("mame");
const outputDir = resolveRoot("bin/mame");
const target = "mame";
const subtarget = "joust";
const sources = "src/mame/midway/williams.cpp";
const project = subtarget.replaceAll("-", "_");
const jsName = `${project}.js`;
const wasmName = `${project}.wasm`;
const chunkSize = 1048576;

function mameBuildArgs(): string[] {
  return [`TARGET=${target}`, `SUBTARGET=${subtarget}`, `SOURCES=${sources}`, "WEBASSEMBLY=1"];
}

function jobs(args: string[]): number {
  return parseNumberFlag(args, "--jobs", cpus().length || 1);
}

async function preflight(): Promise<void> {
  await requireTools(["emmake", "make"]);
  await requireFiles(["mame/makefile", "mame/src/mame/midway/williams.cpp"]);
}

async function compile(args: string[]): Promise<void> {
  const js = path.join(mameDir, jsName);
  const wasm = path.join(mameDir, wasmName);
  const force = hasFlag(args, "--force");
  if (!force && (await exists(js)) && (await exists(wasm))) {
    console.log(`Reusing ${path.relative(resolveRoot(), js)} and ${path.relative(resolveRoot(), wasm)}`);
    return;
  }
  await run(["emmake", "make", `-j${jobs(args)}`, ...mameBuildArgs()], { cwd: mameDir });
}

async function writeHtml(): Promise<void> {
  const template = await Bun.file(resolveRoot("scripts/templates/mame.html")).text();
  const html = template
    .replaceAll("{{TITLE}}", project)
    .replaceAll("{{SUBTARGET}}", subtarget)
    .replaceAll("{{ROM_FILE}}", path.basename(joustZip))
    .replaceAll("{{JS_FILE}}", jsName)
    .replaceAll("{{WASM_FILE}}", wasmName)
    .replaceAll("{{CHUNK_SIZE}}", String(chunkSize));
  await Bun.write(path.join(outputDir, "index.html"), html);
}

export async function buildMame(args: string[] = []): Promise<void> {
  await preflight();
  await buildRom();
  await compile(args);
  await ensureDir(outputDir);
  await copyFileEnsured(path.join(mameDir, jsName), path.join(outputDir, jsName));
  await copyFileEnsured(path.join(mameDir, wasmName), path.join(outputDir, wasmName));
  await copyFileEnsured(joustZip, path.join(outputDir, path.basename(joustZip)));
  await writeHtml();
}

export async function cleanMame(): Promise<void> {
  await removePath(outputDir);
  if (await exists(mameDir)) {
    await run(["emmake", "make", "clean", ...mameBuildArgs()], { cwd: mameDir });
  }
}

export async function rebuildMame(args: string[] = []): Promise<void> {
  await cleanMame();
  await buildMame(["--force", ...args]);
}

export async function serveMame(args: string[] = []): Promise<void> {
  await buildMame(args);
  serve({
    host: parseFlag(args, "--host", "0.0.0.0")!,
    port: parseNumberFlag(args, "--port", 8000),
    root: path.resolve(parseFlag(args, "--root", outputDir)!),
  });
}

if (import.meta.main) {
  await main(async () => {
    const [command = "serve", ...args] = Bun.argv.slice(2);
    if (command === "build") {
      await buildMame(args);
    } else if (command === "clean") {
      await cleanMame();
    } else if (command === "rebuild") {
      await rebuildMame(args);
    } else if (command === "serve") {
      await serveMame(args);
    } else {
      throw new Error(`Unknown mame command: ${command}`);
    }
  });
}

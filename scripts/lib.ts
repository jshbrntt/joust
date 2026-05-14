import { createHash } from "node:crypto";
import { access, copyFile, mkdir, readdir, rm, stat } from "node:fs/promises";
import path from "node:path";

export const root = path.resolve(import.meta.dir, "..");

export type RunOptions = {
  cwd?: string;
  quiet?: boolean;
};

export function resolveRoot(...parts: string[]): string {
  return path.join(root, ...parts);
}

export async function exists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function ensureDir(dir: string): Promise<void> {
  await mkdir(dir, { recursive: true });
}

export async function removePath(target: string): Promise<void> {
  await rm(target, { recursive: true, force: true });
}

export async function copyFileEnsured(source: string, destination: string): Promise<void> {
  await ensureDir(path.dirname(destination));
  await copyFile(source, destination);
}

export async function sha1(filePath: string | Buffer): Promise<string> {
  const hash = createHash("sha1");
  hash.update(typeof filePath === "string" ? Buffer.from(await Bun.file(filePath).arrayBuffer()) : filePath);
  return hash.digest("hex");
}

export async function requireFiles(files: string[]): Promise<void> {
  const missing: string[] = [];
  for (const file of files) {
    if (!(await exists(resolveRoot(file)))) {
      missing.push(file);
    }
  }
  if (missing.length > 0) {
    throw new Error(`Missing required file(s):\n${missing.map((file) => `  ${file}`).join("\n")}`);
  }
}

export async function requireTools(tools: string[]): Promise<void> {
  const missing: string[] = [];
  for (const tool of tools) {
    const result = await Bun.spawn(["sh", "-c", `command -v "$1" >/dev/null`, "sh", tool], {
      stdout: "ignore",
      stderr: "ignore",
    }).exited;
    if (result !== 0) {
      missing.push(tool);
    }
  }
  if (missing.length > 0) {
    throw new Error(
      `Missing required tool(s): ${missing.join(", ")}\nRebuild the devcontainer so the build toolchain is installed.`,
    );
  }
}

export async function run(command: string[], options: RunOptions = {}): Promise<void> {
  if (!options.quiet) {
    console.log(`$ ${command.join(" ")}`);
  }
  const proc = Bun.spawn(command, {
    cwd: options.cwd ?? root,
    stdout: "inherit",
    stderr: "inherit",
  });
  const exitCode = await proc.exited;
  if (exitCode !== 0) {
    throw new Error(`Command failed (${exitCode}): ${command.join(" ")}`);
  }
}

export function parseFlag(args: string[], name: string, fallback?: string): string | undefined {
  const index = args.indexOf(name);
  if (index === -1) {
    return fallback;
  }
  const value = args[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`Missing value for ${name}`);
  }
  return value;
}

export function hasFlag(args: string[], name: string): boolean {
  return args.includes(name);
}

export function parseNumberFlag(args: string[], name: string, fallback: number): number {
  const raw = parseFlag(args, name);
  if (raw === undefined) {
    return fallback;
  }
  const value = Number(raw);
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`Invalid ${name}: ${raw}`);
  }
  return value;
}

export function color(enabled: boolean) {
  return {
    green: (text: string) => (enabled ? `\x1b[32m${text}\x1b[0m` : text),
    red: (text: string) => (enabled ? `\x1b[31m${text}\x1b[0m` : text),
    dim: (text: string) => (enabled ? `\x1b[2m${text}\x1b[0m` : text),
  };
}

export function useColor(args: string[]): boolean {
  return !hasFlag(args, "--no-color") && Boolean(process.stdout.isTTY);
}

export async function listFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(fullPath)));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

export async function isFile(filePath: string): Promise<boolean> {
  try {
    return (await stat(filePath)).isFile();
  } catch {
    return false;
  }
}

export async function main(fn: () => Promise<void>): Promise<void> {
  try {
    await fn();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

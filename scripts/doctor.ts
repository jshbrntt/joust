import { main, requireFiles, requireTools } from "./lib.ts";

async function version(command: string[]): Promise<string> {
  const proc = Bun.spawn(command, { stdout: "pipe", stderr: "pipe" });
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ]);
  if (exitCode !== 0) {
    return "unavailable";
  }
  return (stdout || stderr).split("\n")[0].trim();
}

await main(async () => {
  await requireTools(["asl", "p2bin", "asm6809", "emcc", "emmake", "bun", "make", "git"]);
  await requireFiles([
    "tools/asl/Makefile",
    "tools/asm6809/autogen.sh",
    "tools/emsdk/emsdk",
    "mame/makefile",
    "src/rewrite/make.ASM",
  ]);

  try {
    await import("adm-zip");
  } catch {
    throw new Error("Missing package dependencies. Run: bun install");
  }

  console.log("Tools");
  console.log(`  bun: ${await version(["bun", "--version"])}`);
  console.log(`  emcc: ${await version(["emcc", "--version"])}`);
  console.log(`  asm6809: ${await version(["asm6809", "--version"])}`);
  console.log(`  asl: ${await version(["asl", "-version"])}`);
  console.log("OK");
});

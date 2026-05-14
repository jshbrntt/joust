import { main, removePath, resolveRoot } from "./lib.ts";

await main(async () => {
  const all = Bun.argv.slice(2).includes("--all");
  await removePath(resolveRoot("bin"));

  if (all) {
    const { cleanMame } = await import("./mame.ts");
    await cleanMame();
  }
});

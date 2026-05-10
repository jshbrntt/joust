import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { PNG } from "pngjs";
import { indexedTextureFromRgba } from "../core/texture";
import { directImages } from "./directImages";

test("extracts CLIF1L PNG texture from ROM bytes", () => {
    const clif1l = directImages.find((image) => image.name === "CLIF1L");
    if (!clif1l) throw new Error("CLIF1L image missing");
    const png = PNG.sync.read(readFileSync(fileURLToPath(clif1l.url)));
    const texture = indexedTextureFromRgba(png.width, png.height, png.data);

    expect(clif1l.widthBytes).toBe(17);
    expect(clif1l.height).toBe(7);
    expect(clif1l.width).toBe(34);
    expect(texture.width).toBe(34);
    expect(texture.height).toBe(7);
    expect([...texture.pixels.slice(0, 34)]).toEqual([
        0xa, 0xa, 0xa, 0xa, 0xa, 0xa, 0xa, 0xa, 0xa, 0xa, 0xa, 0xa, 0xa, 0xa, 0xa, 0xa, 0xa,
        0xa, 0xa, 0xa, 0xa, 0xa, 0xa, 0xa, 0xa, 0xa, 0xa, 0xa, 0xa, 0xa, 0xa, 0xa, 0xa, 0x0,
    ]);
});

test("extracts all direct cliff images", () => {
    expect(directImages.map((image) => image.name)).toEqual([
        "CLIF1L",
        "CLIF1R",
        "CLIF2",
        "CLIF3U",
        "CLIF3L",
        "CLIF3R",
        "CLIF4",
    ]);
});

import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { PNG } from "pngjs";
import { indexedTextureFromRgba } from "../core/texture";
import { fontImages } from "./fontImages";

test("extracts both Joust bitmap font tables", () => {
    expect(fontImages.filter((glyph) => glyph.font === "FONT57")).toHaveLength(53);
    expect(fontImages.filter((glyph) => glyph.font === "FONT35")).toHaveLength(49);
});

test("writes large font glyph PNGs from ROM font data", () => {
    const glyph = fontImages.find((entry) => entry.font === "FONT57" && entry.char === "A");
    if (!glyph) throw new Error("FONT57 A glyph missing");

    const png = PNG.sync.read(readFileSync(fileURLToPath(glyph.url)));
    const texture = indexedTextureFromRgba(png.width, png.height, png.data);

    expect(glyph).toMatchObject({
        name: "LA",
        widthBytes: 3,
        height: 7,
        width: 6,
    });
    expect(texture.width).toBe(6);
    expect(texture.height).toBe(7);
    expect([...texture.pixels.slice(0, 6)]).toEqual([0, 1, 1, 1, 0, 0]);
});

test("writes small font glyph PNGs from ROM font data", () => {
    const glyph = fontImages.find((entry) => entry.font === "FONT35" && entry.char === "000");
    if (!glyph) throw new Error("FONT35 000 glyph missing");

    const png = PNG.sync.read(readFileSync(fileURLToPath(glyph.url)));
    const texture = indexedTextureFromRgba(png.width, png.height, png.data);

    expect(glyph).toMatchObject({
        name: "S000",
        widthBytes: 6,
        height: 5,
        width: 12,
    });
    expect(texture.width).toBe(12);
    expect(texture.height).toBe(5);
});

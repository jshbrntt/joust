import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { PNG } from "pngjs";
import { backgroundImages } from "../generated/backgroundImages";
import { compactClif5 } from "../generated/compactClif5";
import { IndexedFramebuffer } from "./framebuffer";
import { drawStaticCliffs, hashFramebuffer, type JoustTextures } from "./playfield";
import { screenAddressToXY } from "./screen";
import { indexedTextureFromRgba, type IndexedTexture } from "./texture";

function loadPngTexture(url: string): IndexedTexture {
    const png = PNG.sync.read(readFileSync(fileURLToPath(url)));
    return indexedTextureFromRgba(png.width, png.height, png.data);
}

function loadTestTextures(): JoustTextures {
    const cliffNames = ["CLIF1L", "CLIF1R", "CLIF2", "CLIF3L", "CLIF3U", "CLIF3R", "CLIF4"];
    return {
        compactClif5: loadPngTexture(compactClif5.url),
        cliffs: cliffNames.map((name) => {
            const metadata = backgroundImages.find((entry) => entry.name === name);
            if (!metadata) throw new Error(`${name} image missing`);
            return { metadata, texture: loadPngTexture(metadata.url) };
        }),
        sprites: [],
        fonts: [],
    };
}

test("renders static background cliffs deterministically", () => {
    const fb = new IndexedFramebuffer();
    fb.clear(0);
    drawStaticCliffs(fb, loadTestTextures());

    expect(hashFramebuffer(fb)).toBe("4a9de4cd");
});

test("renders the source bridge fill records over lava", () => {
    const fb = new IndexedFramebuffer();
    fb.clear(0);
    drawStaticCliffs(fb, loadTestTextures());

    const left = screenAddressToXY(0x00d3);
    const right = screenAddressToXY(0x78d3);

    expect(fb.pixels[left.y * fb.width + left.x]).toBe(8);
    expect(fb.pixels[(left.y + 2) * fb.width + left.x + 53]).toBe(8);
    expect(fb.pixels[right.y * fb.width + right.x]).toBe(8);
    expect(fb.pixels[(right.y + 2) * fb.width + right.x + 59]).toBe(8);
});

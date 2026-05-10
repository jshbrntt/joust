import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { PNG } from "pngjs";
import { indexedTextureFromRgba } from "../core/texture";
import { spriteImages } from "./spriteImages";

test("extracts bitmap-backed animation frames from image tables", () => {
    const counts = new Map<string, number>();
    for (const image of spriteImages) counts.set(image.group, (counts.get(image.group) ?? 0) + 1);

    expect(Object.fromEntries(counts)).toEqual({
        TRANS1: 1,
        TRANS2: 1,
        TRANS3: 1,
        TRANS4: 1,
        OSTRICH: 18,
        BUZARD: 18,
        STORK: 18,
        PLYR1: 4,
        PLYR2: 4,
        PLYR3: 5,
        PLYR4: 5,
        PLYR5: 5,
        EGGI: 7,
        ILAVAT: 6,
        IFLAME: 4,
        POOF1: 1,
        POOF2: 1,
        POOF3: 1,
        IPTERO: 6,
    });
});

test("writes sprite frame PNGs that round-trip through the palette loader", () => {
    const frame = spriteImages.find((image) => image.name === "OSTRICH_04_ORUN1R_x0_ym19");
    if (!frame) throw new Error("OSTRICH ORUN1R frame missing");

    const png = PNG.sync.read(readFileSync(fileURLToPath(frame.url)));
    const texture = indexedTextureFromRgba(png.width, png.height, png.data);

    expect(frame).toMatchObject({
        sourcePtr: 0x1b1a,
        dmaControl: 0x0c10,
        widthBytes: 8,
        height: 20,
        width: 16,
    });
    expect(texture.width).toBe(16);
    expect(texture.height).toBe(20);
    expect([...texture.pixels.slice(0, 16)]).toEqual([
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0xf, 8, 0, 0,
    ]);
});

test("extracts representative enemies, players, eggs, lava, and pterodactyl frames", () => {
    expect(spriteImages.find((image) => image.name === "BUZARD_04_BRUN1R_x0_ym13")).toMatchObject({
        widthBytes: 9,
        height: 14,
    });
    expect(spriteImages.find((image) => image.name === "STORK_04_SRUN1R_x0_ym19")).toMatchObject({
        widthBytes: 9,
        height: 20,
    });
    expect(spriteImages.find((image) => image.name === "EGGI_00_EGGUP_x0_ym6")).toMatchObject({
        widthBytes: 4,
        height: 7,
    });
    expect(spriteImages.find((image) => image.name === "ILAVAT_05_GRAB6_x0_ym17")).toMatchObject({
        widthBytes: 7,
        height: 18,
    });
    expect(spriteImages.find((image) => image.name === "IFLAME_00_FLAME1_x0_ym14")).toMatchObject({
        widthBytes: 4,
        height: 15,
    });
    expect(spriteImages.find((image) => image.name === "IPTERO_00_PT1R_xp1_ym11")).toMatchObject({
        widthBytes: 13,
        height: 10,
    });
});

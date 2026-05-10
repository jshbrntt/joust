import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { PNG } from "pngjs";
import { indexedTextureFromRgba } from "../core/texture";
import { compactClif5 } from "./compactClif5";

test("decodes COMCL5 through the NEWCL5 bitstream format", () => {
    expect(compactClif5).toMatchObject({
        name: "COMCL5",
        sourcePtr: 0x0a48,
        startX: 54,
        startY: 211,
        width: 186,
        height: 33,
    });

    const png = PNG.sync.read(readFileSync(fileURLToPath(compactClif5.url)));
    const texture = indexedTextureFromRgba(png.width, png.height, png.data);

    expect(texture.width).toBe(186);
    expect(texture.height).toBe(33);
    expect([...texture.pixels.slice(0, 16)]).toEqual([
        0xa, 0xa, 0xa, 0xa, 0xa, 0xa, 0xa, 0xa, 0xa, 0xa, 0xa, 0xa, 0xa, 0xa, 0xa, 0xa,
    ]);
    expect([...texture.pixels.slice(32 * texture.width + texture.width - 16)]).toEqual([
        0x8, 0x8, 0x8, 0x8, 0x8, 0xe, 0xe, 0xe, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0,
    ]);
});

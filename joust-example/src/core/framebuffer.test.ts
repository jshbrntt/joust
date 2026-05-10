import { expect, test } from "bun:test";
import { IndexedFramebuffer } from "./framebuffer";

test("blits nibble rows with transparent zero", () => {
    const fb = new IndexedFramebuffer();
    fb.clear(1);
    fb.blitNibbles(2, 3, [
        [0, 2],
        [3, 0],
    ]);

    expect(fb.pixels[3 * fb.width + 2]).toBe(1);
    expect(fb.pixels[3 * fb.width + 3]).toBe(2);
    expect(fb.pixels[4 * fb.width + 2]).toBe(3);
    expect(fb.pixels[4 * fb.width + 3]).toBe(1);
});

test("blits indexed textures with a tint color", () => {
    const fb = new IndexedFramebuffer();
    fb.clear(0);

    fb.blitTexture(1, 1, { width: 2, height: 1, pixels: new Uint8Array([1, 0]) }, { transparent: 0, tint: 5 });

    expect(fb.pixels[1 * fb.width + 1]).toBe(5);
    expect(fb.pixels[1 * fb.width + 2]).toBe(0);
});

test("presents color zero as opaque black", () => {
    const previousImageData = globalThis.ImageData;
    globalThis.ImageData = class ImageData {
        constructor(
            readonly data: Uint8ClampedArray,
            readonly width: number,
            readonly height: number,
        ) {}
    } as typeof ImageData;
    const fb = new IndexedFramebuffer();
    fb.clear(0);

    const image = fb.toImageData();
    globalThis.ImageData = previousImageData;

    expect([...image.data.slice(0, 4)]).toEqual([0, 0, 0, 255]);
});

import { expect, test } from "bun:test";
import { backgroundImages } from "./backgroundImages";

test("extracts background cliff DMA records", () => {
    expect(backgroundImages.map((image) => image.name)).toEqual([
        "CLIF1L",
        "CLIF1R",
        "CLIF2",
        "CLIF3U",
        "CLIF3L",
        "CLIF3R",
        "CLIF4",
        "CLIF5_TOP",
        "CLIF5_LEFT",
        "CLIF5_RIGHT",
    ]);
});

test("extracts CLIF5 split background parts", () => {
    const top = backgroundImages.find((image) => image.name === "CLIF5_TOP");
    const left = backgroundImages.find((image) => image.name === "CLIF5_LEFT");
    const right = backgroundImages.find((image) => image.name === "CLIF5_RIGHT");

    expect(top).toMatchObject({
        sourcePtr: 0x093e,
        startAddress: 0x1bd3,
        dmaControl: 0x5906,
        widthBytes: 93,
        height: 2,
    });
    expect(left).toMatchObject({
        sourcePtr: 0x08ce,
        startAddress: 0x1bd3,
        dmaControl: 0x0c09,
        widthBytes: 8,
        height: 13,
    });
    expect(right).toMatchObject({
        sourcePtr: 0x0866,
        startAddress: 0x70d3,
        dmaControl: 0x0c09,
        widthBytes: 8,
        height: 13,
    });
});

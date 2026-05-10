import { expect, test } from "bun:test";
import { decodeDmaSize, DmaControlBit, hasDmaControl } from "./dma";

test("decodes DMAFIX-inverted dimensions", () => {
    expect(decodeDmaSize(0x1503)).toEqual({ widthBytes: 17, height: 7 });
});

test("decodes background write control bits", () => {
    expect(hasDmaControl(0x0a, DmaControlBit.SuppressZeroes)).toBe(true);
    expect(hasDmaControl(0x0a, DmaControlBit.WriteBlock)).toBe(true);
    expect(hasDmaControl(0x0a, DmaControlBit.ReadBlock)).toBe(false);
});

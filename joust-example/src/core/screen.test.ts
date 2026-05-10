import { expect, test } from "bun:test";
import { screenAddressToXY, screenPixelToAddress } from "./screen";

test("maps ROM screen addresses to Williams byte-column coordinates", () => {
    expect(screenAddressToXY(0x0145)).toEqual({ x: 2, y: 69 });
    expect(screenAddressToXY(0x7e45)).toEqual({ x: 252, y: 69 });
    expect(screenAddressToXY(0x2b51)).toEqual({ x: 86, y: 81 });
    expect(screenAddressToXY(0x1bd3)).toEqual({ x: 54, y: 211 });
});

test("maps pixel coordinates to Williams video RAM byte and nibble", () => {
    expect(screenPixelToAddress(0x1b * 2, 0xd3)).toEqual({
        address: 0x1bd3,
        nibble: "high",
    });
    expect(screenPixelToAddress(0x1b * 2 + 1, 0xd3)).toEqual({
        address: 0x1bd3,
        nibble: "low",
    });
    expect(screenPixelToAddress(0xfc, 0x45)).toEqual({
        address: 0x7e45,
        nibble: "high",
    });
});

export interface ScreenPoint {
    readonly x: number;
    readonly y: number;
}

export interface ScreenPixelAddress {
    readonly address: number;
    readonly nibble: "high" | "low";
}

export const SCREEN_BYTES_PER_ROW = 0x100;
export const SCREEN_PIXELS_PER_BYTE = 2;

// Williams video RAM stores two horizontal pixels per byte. The high address
// byte is the x byte column, and the low address byte is the scanline.
export function screenAddressToXY(address: number): ScreenPoint {
    return {
        x: screenByteColumn(address) * SCREEN_PIXELS_PER_BYTE,
        y: address & 0xff,
    };
}

export function screenByteColumn(address: number): number {
    return (address >> 8) & 0xff;
}

export function screenPixelToAddress(x: number, y: number): ScreenPixelAddress {
    return {
        address: (((x >> 1) & 0xff) << 8) | (y & 0xff),
        nibble: (x & 1) === 0 ? "high" : "low",
    };
}

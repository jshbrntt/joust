import { PALETTE_SIZE } from "./constants";

export type Rgba = readonly [number, number, number, number];

// Default screen colors loaded by SYSTEM.SRC COLOR1. Williams color RAM stores
// BB in bits 6-7, GGG in bits 3-5, and RRR in bits 0-2.
// The original source uses the second operand-looking token as a comment; these
// are the 16 bytes emitted at COLOR1 in bin/joust.lst.
export const colorRam = [
    0o000, 0o377, 0o160, 0o130, 0o017, 0o077, 0o121, 0o350, 0o024, 0o220, 0o135, 0o021, 0o037,
    0o244, 0o012, 0o147,
] as const;

function scale(value: number, max: number): number {
    return Math.round((value * 0xff) / max);
}

function decodeColorRam(value: number, alpha = 0xff): Rgba {
    return [
        scale(value & 0x07, 0x07),
        scale((value >> 3) & 0x07, 0x07),
        scale((value >> 6) & 0x03, 0x03),
        alpha,
    ];
}

export const palette: readonly Rgba[] = colorRam.map((value, index) =>
    decodeColorRam(value, index === 0 ? 0x00 : 0xff),
);

if (palette.length !== PALETTE_SIZE) {
    throw new Error(`palette must contain ${PALETTE_SIZE} entries`);
}

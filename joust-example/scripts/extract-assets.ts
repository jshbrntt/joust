import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { PNG } from "pngjs";
import { palette } from "../src/core/palette";

const repoRoot = resolve(import.meta.dir, "../../../..");
const rewriteDir = resolve(repoRoot, "src/rewrite");
const romDir = resolve(repoRoot, "roms");
const listingPath = resolve(repoRoot, "bin/joust.lst");
const outputPath = resolve(import.meta.dir, "../src/generated/imagePointers.ts");
const descriptorsOutputPath = resolve(import.meta.dir, "../src/generated/imageDescriptors.ts");
const directImagesOutputPath = resolve(import.meta.dir, "../src/generated/directImages.ts");
const backgroundImagesOutputPath = resolve(import.meta.dir, "../src/generated/backgroundImages.ts");
const compactClif5OutputPath = resolve(import.meta.dir, "../src/generated/compactClif5.ts");
const spriteImagesOutputPath = resolve(import.meta.dir, "../src/generated/spriteImages.ts");
const fontImagesOutputPath = resolve(import.meta.dir, "../src/generated/fontImages.ts");
const imageOutputDir = resolve(import.meta.dir, "../src/generated/images");

if (!existsSync(rewriteDir)) {
    throw new Error(`missing rewrite source directory: ${rewriteDir}`);
}

if (!existsSync(romDir)) {
    throw new Error(`missing ROM directory: ${romDir}`);
}

if (!existsSync(listingPath)) {
    throw new Error(`missing listing: ${listingPath}`);
}

interface ImagePointer {
    readonly name: string;
    readonly tableOffset: number;
    readonly address: number;
}

interface ImageDescriptor {
    readonly name: string;
    readonly shape: ImageShape;
    readonly address: number;
    readonly collisionPtr: number;
    readonly sourcePtr: number;
    readonly startAddress: number;
    readonly dmaControl: number;
    readonly widthBytes: number | null;
    readonly height: number | null;
}

type ImageShape = "direct" | "table" | "compact" | "special";

interface DirectImage {
    readonly name: string;
    readonly widthBytes: number;
    readonly height: number;
    readonly rows: readonly (readonly number[])[];
}

interface BackgroundImage {
    readonly name: string;
    readonly sourcePtr: number;
    readonly startAddress: number;
    readonly dmaControl: number;
    readonly widthBytes: number;
    readonly height: number;
    readonly rows: readonly (readonly number[])[];
}

interface CompactClif5 {
    readonly name: "COMCL5";
    readonly sourcePtr: number;
    readonly startX: number;
    readonly startY: number;
    readonly width: number;
    readonly height: number;
    readonly rows: readonly (readonly number[])[];
}

interface SpriteFrame {
    readonly group: string;
    readonly name: string;
    readonly collisionPtr: number;
    readonly offsetWord: number;
    readonly sourcePtr: number;
    readonly dmaControl: number;
    readonly widthBytes: number;
    readonly height: number;
    readonly rows: readonly (readonly number[])[];
}

interface FontGlyph {
    readonly font: "FONT57" | "FONT35";
    readonly name: string;
    readonly char: string;
    readonly sourcePtr: number;
    readonly widthBytes: number;
    readonly height: number;
    readonly rows: readonly (readonly number[])[];
}

interface TextureMetadata {
    readonly name: string;
    readonly width: number;
    readonly height: number;
    readonly fileName: string;
}

const romFiles = [
    ["joust_rom_1b_3006-13.e4", 0x0000],
    ["joust_rom_2b_3006-14.c4", 0x1000],
    ["joust_rom_3b_3006-15.a4", 0x2000],
    ["joust_rom_4b_3006-16.e5", 0x3000],
    ["joust_rom_5b_3006-17.c5", 0x4000],
    ["joust_rom_6b_3006-18.a5", 0x5000],
    ["joust_rom_7b_3006-19.e6", 0x6000],
    ["joust_rom_8b_3006-20.c6", 0x7000],
    ["joust_rom_9b_3006-21.a6", 0x8000],
    ["joust_rom_10b_3006-22.a7", 0xd000],
    ["joust_rom_11b_3006-23.c7", 0xe000],
    ["joust_rom_12b_3006-24.e7", 0xf000],
] as const;

const DMAFIX = 0x0404;
const directImageNames = new Set(["CLIF1L", "CLIF1R", "CLIF2", "CLIF3U", "CLIF3L", "CLIF3R", "CLIF4"]);
const compactImages = new Set(["COMCL5"]);
const specialImages = new Set(["CLIF5", "ASH1R", "ASH1L"]);
const tableImageNames = new Set([
    "TRANS1",
    "TRANS2",
    "TRANS3",
    "TRANS4",
    "OSTRICH",
    "BUZARD",
    "STORK",
    "PLYR1",
    "PLYR2",
    "PLYR3",
    "PLYR4",
    "PLYR5",
    "EGGI",
    "ILAVAT",
    "IFLAME",
    "POOF1",
    "POOF2",
    "POOF3",
    "IPTERO",
]);
const singleFrameTableImages = new Set(["POOF1", "POOF2", "POOF3"]);

const glyphChars = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "space",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "back_arrow",
    "equals",
    "dash",
    "question",
    "exclamation",
    "left_paren",
    "right_paren",
    "apostrophe",
    "comma",
    "period",
    "slash",
    "ampersand",
    "quote",
    "colon",
    "cursor",
    "center_arrow",
] as const;

const smallGlyphChars = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "space",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "back_arrow",
    "equals",
    "dash",
    "question",
    "exclamation",
    "left_paren",
    "right_paren",
    "apostrophe",
    "comma",
    "period",
    "000",
    "arrow",
] as const;

function parseHexByte(value: string): number {
    const byte = Number.parseInt(value, 16);
    if (!Number.isInteger(byte) || byte < 0 || byte > 0xff) {
        throw new Error(`invalid byte: ${value}`);
    }
    return byte;
}

function parseImagePointers(listing: string): ImagePointer[] {
    const pointers: ImagePointer[] = [];
    const linePattern =
        /^\(1\)\s+\d+\/\s+([0-9A-F]+)\s+:\s+([0-9A-F]{2})\s+([0-9A-F]{2})\s+FDB\s+_([A-Z0-9]+)\b/;

    for (const line of listing.split(/\r?\n/)) {
        const match = line.match(linePattern);
        if (!match) continue;

        const tableOffset = Number.parseInt(match[1], 16);
        if (tableOffset !== pointers.length * 2) {
            break;
        }

        const address = (parseHexByte(match[2]) << 8) | parseHexByte(match[3]);
        pointers.push({
            name: match[4],
            tableOffset,
            address,
        });
    }

    if (pointers.length === 0) {
        throw new Error("no image pointers found in listing");
    }

    return pointers;
}

function parseListingLabels(listing: string): Map<number, string> {
    const labels = new Map<number, string>();
    const linePattern = /^\(1\)\s+\d+\/\s*([0-9A-F]+)\s+:\s+(?:[0-9A-F]{2}(?:\s+|$))*\s*([A-Za-z_][A-Za-z0-9_]*)\b/;

    for (const line of listing.split(/\r?\n/)) {
        const match = line.match(linePattern);
        if (!match) continue;

        const label = match[2];
        if (label === "FCB" || label === "FDB" || label === "FCC" || label === "EQU") continue;
        const address = Number.parseInt(match[1], 16);
        if (!labels.has(address)) labels.set(address, label.replace(/^_/, ""));
    }

    return labels;
}

function formatHex(value: number, width: number): string {
    return `0x${value.toString(16).toUpperCase().padStart(width, "0")}`;
}

function textureFileName(name: string): string {
    return `${name.toLowerCase().replace(/[^a-z0-9]+/g, "_")}.png`;
}

function writeTexturePng(fileName: string, rows: readonly (readonly number[])[]): TextureMetadata {
    const width = Math.max(...rows.map((row) => row.length));
    const height = rows.length;
    const png = new PNG({ width, height });

    for (let y = 0; y < height; y++) {
        const row = rows[y];
        for (let x = 0; x < width; x++) {
            const color = row[x] ?? 0;
            const [r, g, b, a] = palette[color & 0x0f];
            const offset = (y * width + x) * 4;
            png.data[offset] = r;
            png.data[offset + 1] = g;
            png.data[offset + 2] = b;
            png.data[offset + 3] = color === 0 ? 0 : a;
        }
    }

    writeFileSync(resolve(imageOutputDir, fileName), PNG.sync.write(png));
    return { name: fileName.replace(/\.png$/, ""), width, height, fileName };
}

function generateImagePointers(pointers: readonly ImagePointer[]): string {
    const rows = pointers
        .map(
            (p) =>
                `    { name: "${p.name}", tableOffset: ${formatHex(p.tableOffset, 2)}, address: ${formatHex(p.address, 4)} },`,
        )
        .join("\n");

    return `// Generated by scripts/extract-assets.ts. Do not edit by hand.

export interface ImagePointer {
    readonly name: string;
    readonly tableOffset: number;
    readonly address: number;
}

export const imagePointers = [
${rows}
] as const satisfies readonly ImagePointer[];
`;
}

function loadRomMemory(): Uint8Array {
    const memory = new Uint8Array(0x10000);

    for (const [file, base] of romFiles) {
        const path = resolve(romDir, file);
        if (!existsSync(path)) throw new Error(`missing ROM file: ${path}`);

        const bytes = readFileSync(path);
        memory.set(bytes, base);
    }

    return memory;
}

function readWord(memory: Uint8Array, address: number): number {
    return (memory[address] << 8) | memory[(address + 1) & 0xffff];
}

function readSignedByte(value: number): number {
    return value & 0x80 ? value - 0x100 : value;
}

function imageShape(name: string): ImageShape {
    if (directImageNames.has(name)) return "direct";
    if (compactImages.has(name)) return "compact";
    if (specialImages.has(name)) return "special";
    return "table";
}

function parseImageDescriptors(
    memory: Uint8Array,
    pointers: readonly ImagePointer[],
): ImageDescriptor[] {
    return pointers.map((pointer) => {
        const dmaControl = readWord(memory, pointer.address + 6);
        const fixed = dmaControl ^ DMAFIX;
        const shape = imageShape(pointer.name);

        return {
            name: pointer.name,
            shape,
            address: pointer.address,
            collisionPtr: readWord(memory, pointer.address),
            sourcePtr: readWord(memory, pointer.address + 2),
            startAddress: readWord(memory, pointer.address + 4),
            dmaControl,
            widthBytes: shape === "direct" ? (fixed >> 8) & 0xff : null,
            height: shape === "direct" ? fixed & 0xff : null,
        };
    });
}

function generateImageDescriptors(descriptors: readonly ImageDescriptor[]): string {
    const rows = descriptors
        .map(
            (d) =>
                `    { name: "${d.name}", shape: "${d.shape}", address: ${formatHex(d.address, 4)}, collisionPtr: ${formatHex(d.collisionPtr, 4)}, sourcePtr: ${formatHex(d.sourcePtr, 4)}, startAddress: ${formatHex(d.startAddress, 4)}, dmaControl: ${formatHex(d.dmaControl, 4)}, widthBytes: ${d.widthBytes ?? "null"}, height: ${d.height ?? "null"} },`,
        )
        .join("\n");

    return `// Generated by scripts/extract-assets.ts. Do not edit by hand.

export interface ImageDescriptor {
    readonly name: string;
    readonly shape: "direct" | "table" | "compact" | "special";
    readonly address: number;
    readonly collisionPtr: number;
    readonly sourcePtr: number;
    readonly startAddress: number;
    readonly dmaControl: number;
    readonly widthBytes: number | null;
    readonly height: number | null;
}

export const imageDescriptors = [
${rows}
] as const satisfies readonly ImageDescriptor[];
`;
}

function decodeNibbles(bytes: Uint8Array): number[] {
    const pixels: number[] = [];
    for (const byte of bytes) {
        pixels.push((byte >> 4) & 0x0f, byte & 0x0f);
    }
    return pixels;
}

function parseDirectImages(
    memory: Uint8Array,
    descriptors: readonly ImageDescriptor[],
): DirectImage[] {
    return descriptors
        .filter((descriptor) => descriptor.shape === "direct")
        .map((descriptor) => {
            if (descriptor.widthBytes == null || descriptor.height == null) {
                throw new Error(`${descriptor.name} direct descriptor missing dimensions`);
            }

            const rows: number[][] = [];
            for (let y = 0; y < descriptor.height; y++) {
                const offset = descriptor.sourcePtr + y * descriptor.widthBytes;
                const bytes = memory.subarray(offset, offset + descriptor.widthBytes);
                rows.push(decodeNibbles(bytes));
            }

            return {
                name: descriptor.name,
                widthBytes: descriptor.widthBytes,
                height: descriptor.height,
                rows,
            };
        });
}

function decodeImageRows(
    memory: Uint8Array,
    sourcePtr: number,
    widthBytes: number,
    height: number,
): number[][] {
    const rows: number[][] = [];
    for (let y = 0; y < height; y++) {
        const offset = sourcePtr + y * widthBytes;
        const bytes = memory.subarray(offset, offset + widthBytes);
        rows.push(decodeNibbles(bytes));
    }
    return rows;
}

function decodeBitmapAt(memory: Uint8Array, sourcePtr: number): Omit<SpriteFrame, "group" | "name" | "collisionPtr" | "offsetWord" | "sourcePtr"> | null {
    const dmaControl = readWord(memory, sourcePtr);
    const fixed = dmaControl ^ DMAFIX;
    const widthBytes = (fixed >> 8) & 0xff;
    const height = fixed & 0xff;

    if (widthBytes < 1 || widthBytes > 0x20 || height < 1 || height > 0x40) return null;
    if (sourcePtr + 2 + widthBytes * height > memory.length) return null;

    return {
        dmaControl,
        widthBytes,
        height,
        rows: decodeImageRows(memory, sourcePtr + 2, widthBytes, height),
    };
}

function decodeBitmapRecord(
    memory: Uint8Array,
    sourcePtr: number,
    dmaControl: number,
): Omit<SpriteFrame, "group" | "name" | "collisionPtr" | "offsetWord" | "sourcePtr"> | null {
    const fixed = dmaControl ^ DMAFIX;
    const widthBytes = (fixed >> 8) & 0xff;
    const height = fixed & 0xff;

    if (widthBytes < 1 || widthBytes > 0x20 || height < 1 || height > 0x40) return null;
    if (sourcePtr + widthBytes * height > memory.length) return null;

    return {
        dmaControl,
        widthBytes,
        height,
        rows: decodeImageRows(memory, sourcePtr, widthBytes, height),
    };
}

function parseSpriteImages(
    memory: Uint8Array,
    descriptors: readonly ImageDescriptor[],
    labels: ReadonlyMap<number, string>,
): SpriteFrame[] {
    const frames: SpriteFrame[] = [];

    for (const descriptor of descriptors) {
        if (!tableImageNames.has(descriptor.name)) continue;

        if (descriptor.name.startsWith("TRANS")) {
            const bitmap = decodeBitmapRecord(memory, descriptor.sourcePtr, descriptor.dmaControl);
            if (!bitmap) throw new Error(`${descriptor.name} has invalid bitmap record`);
            frames.push({
                group: descriptor.name,
                name: descriptor.name,
                collisionPtr: descriptor.collisionPtr,
                offsetWord: descriptor.startAddress,
                sourcePtr: descriptor.sourcePtr,
                ...bitmap,
            });
            continue;
        }

        let entryAddress = descriptor.address;
        let index = 0;
        let firstSourcePtr = 0xffff;
        const nextDescriptorAddress = descriptors
            .map((entry) => entry.address)
            .filter((address) => address > descriptor.address)
            .sort((a, b) => a - b)[0];
        while (entryAddress + 6 <= memory.length) {
            if (nextDescriptorAddress != null && entryAddress >= nextDescriptorAddress) break;
            if (entryAddress >= firstSourcePtr) break;

            const collisionPtr = readWord(memory, entryAddress);
            const offsetWord = readWord(memory, entryAddress + 2);
            const sourcePtr = readWord(memory, entryAddress + 4);
            const bitmap = decodeBitmapAt(memory, sourcePtr);
            if (!bitmap) break;
            firstSourcePtr = Math.min(firstSourcePtr, sourcePtr);

            const sourceLabel = labels.get(sourcePtr) ?? `${descriptor.name}_${index.toString().padStart(2, "0")}`;
            const xOffset = readSignedByte((offsetWord >> 8) & 0xff);
            const yOffset = readSignedByte(offsetWord & 0xff);
            const xPart = xOffset === 0 ? "0" : xOffset > 0 ? `p${xOffset}` : `m${-xOffset}`;
            const yPart = yOffset === 0 ? "0" : yOffset > 0 ? `p${yOffset}` : `m${-yOffset}`;

            frames.push({
                group: descriptor.name,
                name: `${descriptor.name}_${index.toString().padStart(2, "0")}_${sourceLabel}_x${xPart}_y${yPart}`,
                collisionPtr,
                offsetWord,
                sourcePtr,
                ...bitmap,
            });

            index++;
            entryAddress += 6;
            if (singleFrameTableImages.has(descriptor.name)) break;
        }

        if (index === 0) {
            throw new Error(`${descriptor.name} did not yield any bitmap frames`);
        }
    }

    return frames;
}

function parseBackgroundRecord(
    memory: Uint8Array,
    name: string,
    address: number,
): BackgroundImage {
    const dmaControl = readWord(memory, address + 4);
    const fixed = dmaControl ^ DMAFIX;
    const widthBytes = (fixed >> 8) & 0xff;
    const height = fixed & 0xff;
    const sourcePtr = readWord(memory, address);

    return {
        name,
        sourcePtr,
        startAddress: readWord(memory, address + 2),
        dmaControl,
        widthBytes,
        height,
        rows: decodeImageRows(memory, sourcePtr, widthBytes, height),
    };
}

function parseBackgroundImages(
    memory: Uint8Array,
    descriptors: readonly ImageDescriptor[],
): BackgroundImage[] {
    const images: BackgroundImage[] = [];

    for (const descriptor of descriptors) {
        if (descriptor.shape === "direct") {
            images.push(parseBackgroundRecord(memory, descriptor.name, descriptor.address + 8));
        }
    }

    const clif5 = descriptors.find((descriptor) => descriptor.name === "CLIF5");
    if (!clif5) throw new Error("CLIF5 descriptor missing");

    images.push(parseBackgroundRecord(memory, "CLIF5_TOP", clif5.address + 8));
    images.push(parseBackgroundRecord(memory, "CLIF5_LEFT", clif5.address + 14));
    images.push(parseBackgroundRecord(memory, "CLIF5_RIGHT", clif5.address + 20));

    return images;
}

function generateDirectImages(images: readonly DirectImage[]): string {
    const rows = images
        .map((image) => {
            const fileName = `direct_${textureFileName(image.name)}`;
            const texture = writeTexturePng(fileName, image.rows);

            return `    {
        name: "${image.name}",
        widthBytes: ${image.widthBytes},
        height: ${image.height},
        width: ${texture.width},
        url: new URL("./images/${fileName}", import.meta.url).href,
    },`;
        })
        .join("\n");

    return `// Generated by scripts/extract-assets.ts. Do not edit by hand.

export interface DirectImage {
    readonly name: string;
    readonly widthBytes: number;
    readonly height: number;
    readonly width: number;
    readonly url: string;
}

export const directImages = [
${rows}
] as const satisfies readonly DirectImage[];
`;
}

function generateBackgroundImages(images: readonly BackgroundImage[]): string {
    const rows = images
        .map((image) => {
            const fileName = `background_${textureFileName(image.name)}`;
            const texture = writeTexturePng(fileName, image.rows);

            return `    {
        name: "${image.name}",
        sourcePtr: ${formatHex(image.sourcePtr, 4)},
        startAddress: ${formatHex(image.startAddress, 4)},
        dmaControl: ${formatHex(image.dmaControl, 4)},
        widthBytes: ${image.widthBytes},
        height: ${image.height},
        width: ${texture.width},
        url: new URL("./images/${fileName}", import.meta.url).href,
    },`;
        })
        .join("\n");

    return `// Generated by scripts/extract-assets.ts. Do not edit by hand.

export interface BackgroundImage {
    readonly name: string;
    readonly sourcePtr: number;
    readonly startAddress: number;
    readonly dmaControl: number;
    readonly widthBytes: number;
    readonly height: number;
    readonly width: number;
    readonly url: string;
}

export const backgroundImages = [
${rows}
] as const satisfies readonly BackgroundImage[];
`;
}

class BitReader {
    private compactBits = 0;
    private offset: number;

    constructor(
        private readonly memory: Uint8Array,
        startAddress: number,
    ) {
        this.offset = startAddress;
    }

    readBit(): number {
        let shifted = this.compactBits << 1;
        let carry = shifted & 0x100 ? 1 : 0;
        this.compactBits = shifted & 0xff;
        if (this.compactBits === 0) {
            shifted = this.memory[this.offset++] << 1;
            carry = shifted & 0x100 ? 1 : 0;
            this.compactBits = (shifted & 0xff) | 1;
        }

        return carry;
    }

    readRest(bitCount: number): number {
        let value = 1;
        for (let bit = 0; bit < bitCount; bit++) {
            value = ((value << 1) | this.readBit()) & 0xff;
        }
        return value;
    }
}

function decodeCompactClif5(memory: Uint8Array, descriptors: readonly ImageDescriptor[]): CompactClif5 {
    const descriptor = descriptors.find((entry) => entry.name === "COMCL5");
    if (!descriptor) throw new Error("COMCL5 descriptor missing");

    const startX = 0x1b * 2;
    const startY = 0xd3;
    const rows: number[][] = [[]];
    let currentRow = rows[0];
    const bits = new BitReader(memory, descriptor.address);

    while (true) {
        let lengthCodeBits = 1;
        while (bits.readBit() === 0) {
            lengthCodeBits++;
        }

        const runLength = bits.readRest(lengthCodeBits) - 2;
        let color = bits.readRest(3) & 0x07;

        if (runLength === 0) {
            if (color === 0) break;
            currentRow = [];
            rows.push(currentRow);
            continue;
        }

        if (color !== 0) color += 8 - 1;
        for (let pixel = 0; pixel < runLength; pixel++) {
            currentRow.push(color);
        }
    }

    if (rows.length > 0 && rows[rows.length - 1].length === 0) {
        rows.pop();
    }

    const width = Math.max(...rows.map((row) => row.length));
    for (const row of rows) {
        while (row.length < width) row.push(0);
    }

    return {
        name: "COMCL5",
        sourcePtr: descriptor.address,
        startX,
        startY,
        width,
        height: rows.length,
        rows,
    };
}

function generateCompactClif5(image: CompactClif5): string {
    const fileName = `compact_${textureFileName(image.name)}`;
    writeTexturePng(fileName, image.rows);

    return `// Generated by scripts/extract-assets.ts. Do not edit by hand.

export interface CompactClif5 {
    readonly name: "COMCL5";
    readonly sourcePtr: number;
    readonly startX: number;
    readonly startY: number;
    readonly width: number;
    readonly height: number;
    readonly url: string;
}

export const compactClif5 = {
    name: "COMCL5",
    sourcePtr: ${formatHex(image.sourcePtr, 4)},
    startX: ${image.startX},
    startY: ${image.startY},
    width: ${image.width},
    height: ${image.height},
    url: new URL("./images/${fileName}", import.meta.url).href,
} as const satisfies CompactClif5;
`;
}

function generateSpriteImages(images: readonly SpriteFrame[]): string {
    const rows = images
        .map((image) => {
            const fileName = `sprite_${textureFileName(image.name)}`;
            const texture = writeTexturePng(fileName, image.rows);

            return `    {
        group: "${image.group}",
        name: "${image.name}",
        collisionPtr: ${formatHex(image.collisionPtr, 4)},
        offsetWord: ${formatHex(image.offsetWord, 4)},
        sourcePtr: ${formatHex(image.sourcePtr, 4)},
        dmaControl: ${formatHex(image.dmaControl, 4)},
        widthBytes: ${image.widthBytes},
        height: ${image.height},
        width: ${texture.width},
        url: new URL("./images/${fileName}", import.meta.url).href,
    },`;
        })
        .join("\n");

    return `// Generated by scripts/extract-assets.ts. Do not edit by hand.

export interface SpriteImage {
    readonly group: string;
    readonly name: string;
    readonly collisionPtr: number;
    readonly offsetWord: number;
    readonly sourcePtr: number;
    readonly dmaControl: number;
    readonly widthBytes: number;
    readonly height: number;
    readonly width: number;
    readonly url: string;
}

export const spriteImages = [
${rows}
] as const satisfies readonly SpriteImage[];
`;
}

function parseFontGlyphs(memory: Uint8Array, labels: ReadonlyMap<number, string>): FontGlyph[] {
    const glyphs: FontGlyph[] = [];

    for (const font of ["FONT57", "FONT35"] as const) {
        const fontPtr = [...labels.entries()].find(([, label]) => label === font)?.[0];
        if (fontPtr == null) throw new Error(`${font} label missing`);
        const chars = font === "FONT57" ? glyphChars : smallGlyphChars;

        for (let index = 0; index < chars.length; index++) {
            const sourcePtr = readWord(memory, fontPtr + index * 2);
            const widthBytes = memory[sourcePtr];
            const height = memory[sourcePtr + 1];
            if (widthBytes < 1 || widthBytes > 8 || height < 1 || height > 8) {
                throw new Error(`${font} glyph ${index} has invalid size ${widthBytes}x${height}`);
            }

            const rows = decodeImageRows(memory, sourcePtr + 2, widthBytes, height);
            glyphs.push({
                font,
                name: labels.get(sourcePtr) ?? `${font}_${index}`,
                char: chars[index],
                sourcePtr,
                widthBytes,
                height,
                rows,
            });
        }
    }

    return glyphs;
}

function generateFontImages(glyphs: readonly FontGlyph[]): string {
    const rows = glyphs
        .map((glyph) => {
            const fileName = `font_${textureFileName(`${glyph.font}_${glyph.char}`)}`;
            const texture = writeTexturePng(fileName, glyph.rows);

            return `    {
        font: "${glyph.font}",
        name: "${glyph.name}",
        char: "${glyph.char}",
        sourcePtr: ${formatHex(glyph.sourcePtr, 4)},
        widthBytes: ${glyph.widthBytes},
        height: ${glyph.height},
        width: ${texture.width},
        url: new URL("./images/${fileName}", import.meta.url).href,
    },`;
        })
        .join("\n");

    return `// Generated by scripts/extract-assets.ts. Do not edit by hand.

export interface FontGlyphImage {
    readonly font: "FONT57" | "FONT35";
    readonly name: string;
    readonly char: string;
    readonly sourcePtr: number;
    readonly widthBytes: number;
    readonly height: number;
    readonly width: number;
    readonly url: string;
}

export const fontImages = [
${rows}
] as const satisfies readonly FontGlyphImage[];
`;
}

const listing = readFileSync(listingPath, "utf8");
const pointers = parseImagePointers(listing);
const labels = parseListingLabels(listing);
const memory = loadRomMemory();
const descriptors = parseImageDescriptors(memory, pointers);
const directImages = parseDirectImages(memory, descriptors);
const backgroundImages = parseBackgroundImages(memory, descriptors);
const compactClif5 = decodeCompactClif5(memory, descriptors);
const spriteImages = parseSpriteImages(memory, descriptors, labels);
const fontImages = parseFontGlyphs(memory, labels);

rmSync(imageOutputDir, { recursive: true, force: true });
mkdirSync(imageOutputDir, { recursive: true });

writeFileSync(outputPath, generateImagePointers(pointers));
writeFileSync(descriptorsOutputPath, generateImageDescriptors(descriptors));
writeFileSync(directImagesOutputPath, generateDirectImages(directImages));
writeFileSync(backgroundImagesOutputPath, generateBackgroundImages(backgroundImages));
writeFileSync(compactClif5OutputPath, generateCompactClif5(compactClif5));
writeFileSync(spriteImagesOutputPath, generateSpriteImages(spriteImages));
writeFileSync(fontImagesOutputPath, generateFontImages(fontImages));

console.log(`wrote ${pointers.length} image pointers -> ${outputPath}`);
console.log(`wrote ${descriptors.length} image descriptors -> ${descriptorsOutputPath}`);
console.log(`wrote ${directImages.length} direct images -> ${directImagesOutputPath}`);
console.log(`wrote ${backgroundImages.length} background images -> ${backgroundImagesOutputPath}`);
console.log(`wrote compact CLIF5 ${compactClif5.width}x${compactClif5.height} -> ${compactClif5OutputPath}`);
console.log(`wrote ${spriteImages.length} sprite frames -> ${spriteImagesOutputPath}`);
console.log(`wrote ${fontImages.length} font glyphs -> ${fontImagesOutputPath}`);

import { backgroundImages } from "../generated/backgroundImages";
import { compactClif5 } from "../generated/compactClif5";
import { fontImages } from "../generated/fontImages";
import { spriteImages } from "../generated/spriteImages";
import { DmaControlBit, hasDmaControl } from "./dma";
import { IndexedFramebuffer } from "./framebuffer";
import { screenAddressToXY } from "./screen";
import { loadIndexedTexture, type IndexedTexture } from "./texture";

const BACKGROUND_WRITE_CONTROL = 0x0a;
const CLIFF_BROWN = 8;

const bridgeFills = [
    { name: "BRIDGE", startAddress: 0x00d3, widthBytes: 0x1b, height: 0x03, color: CLIFF_BROWN },
    { name: "BRIDG2", startAddress: 0x78d3, widthBytes: 0x1e, height: 0x03, color: CLIFF_BROWN },
] as const;

function backgroundImage(name: string) {
    const image = backgroundImages.find((entry) => entry.name === name);
    if (!image) throw new Error(`${name} image missing`);
    return image;
}

const cliffs = [
    backgroundImage("CLIF1L"),
    backgroundImage("CLIF1R"),
    backgroundImage("CLIF2"),
    backgroundImage("CLIF3L"),
    backgroundImage("CLIF3U"),
    backgroundImage("CLIF3R"),
    backgroundImage("CLIF4"),
];

export interface LoadedBackgroundImage {
    readonly metadata: (typeof backgroundImages)[number];
    readonly texture: IndexedTexture;
}

export interface LoadedSpriteImage {
    readonly metadata: (typeof spriteImages)[number];
    readonly texture: IndexedTexture;
}

export interface LoadedFontGlyph {
    readonly metadata: (typeof fontImages)[number];
    readonly texture: IndexedTexture;
}

export interface JoustTextures {
    readonly compactClif5: IndexedTexture;
    readonly cliffs: readonly LoadedBackgroundImage[];
    readonly sprites: readonly LoadedSpriteImage[];
    readonly fonts: readonly LoadedFontGlyph[];
}

export async function loadJoustTextures(): Promise<JoustTextures> {
    const loadedCliffs = await Promise.all(
        cliffs.map(async (metadata) => ({
            metadata,
            texture: await loadIndexedTexture(metadata.url),
        })),
    );

    return {
        compactClif5: await loadIndexedTexture(compactClif5.url),
        cliffs: loadedCliffs,
        sprites: await Promise.all(
            spriteImages.map(async (metadata) => ({
                metadata,
                texture: await loadIndexedTexture(metadata.url),
            })),
        ),
        fonts: await Promise.all(
            fontImages.map(async (metadata) => ({
                metadata,
                texture: await loadIndexedTexture(metadata.url),
            })),
        ),
    };
}

export function drawStaticCliffs(fb: IndexedFramebuffer, textures: JoustTextures): void {
    fb.blitTexture(compactClif5.startX, compactClif5.startY, textures.compactClif5, {
        transparent: 0,
    });

    for (const bridge of bridgeFills) {
        const { x, y } = screenAddressToXY(bridge.startAddress);
        fb.fillRect(x, y, bridge.widthBytes * 2, bridge.height, bridge.color);
    }

    for (const { metadata: cliff, texture } of textures.cliffs) {
        const { x, y } = screenAddressToXY(cliff.startAddress);
        const transparent = hasDmaControl(BACKGROUND_WRITE_CONTROL, DmaControlBit.SuppressZeroes)
            ? 0
            : undefined;
        fb.blitTexture(x, y, texture, { transparent });
    }
}

export function hashFramebuffer(fb: IndexedFramebuffer): string {
    let hash = 0x811c9dc5;
    for (const pixel of fb.pixels) {
        hash ^= pixel;
        hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    return hash.toString(16).padStart(8, "0");
}

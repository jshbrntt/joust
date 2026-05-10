import { palette } from "./palette";

export interface IndexedTexture {
    readonly width: number;
    readonly height: number;
    readonly pixels: Uint8Array;
}

const paletteLookup = new Map<string, number>();

for (let index = 0; index < palette.length; index++) {
    const [r, g, b, a] = palette[index];
    const key = `${r},${g},${b},${a}`;
    if (!paletteLookup.has(key)) paletteLookup.set(key, index);
}

export function indexedTextureFromRgba(
    width: number,
    height: number,
    rgba: ArrayLike<number>,
): IndexedTexture {
    const pixels = new Uint8Array(width * height);

    for (let i = 0; i < pixels.length; i++) {
        const offset = i * 4;
        const key = `${rgba[offset]},${rgba[offset + 1]},${rgba[offset + 2]},${rgba[offset + 3]}`;
        const color = paletteLookup.get(key);
        if (color === undefined) {
            throw new Error(`PNG pixel does not match Joust palette: ${key}`);
        }
        pixels[i] = color;
    }

    return { width, height, pixels };
}

export async function loadIndexedTexture(url: string): Promise<IndexedTexture> {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`failed to load texture ${url}: ${response.status}`);

    const image = await createImageBitmap(await response.blob());
    const width = image.width;
    const height = image.height;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) throw new Error("2D canvas context unavailable");

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(image, 0, 0);
    const data = ctx.getImageData(0, 0, width, height).data;
    image.close();

    return indexedTextureFromRgba(width, height, data);
}

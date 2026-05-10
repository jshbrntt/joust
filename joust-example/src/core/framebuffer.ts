import { FRAMEBUFFER_HEIGHT, FRAMEBUFFER_WIDTH } from "./constants";
import { palette } from "./palette";
import type { IndexedTexture } from "./texture";

export class IndexedFramebuffer {
    readonly width = FRAMEBUFFER_WIDTH;
    readonly height = FRAMEBUFFER_HEIGHT;
    readonly pixels = new Uint8Array(this.width * this.height);
    private readonly rgba = new Uint8ClampedArray(this.width * this.height * 4);

    clear(color = 0): void {
        this.pixels.fill(color & 0x0f);
    }

    setPixel(x: number, y: number, color: number): void {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) return;
        this.pixels[y * this.width + x] = color & 0x0f;
    }

    fillRect(x: number, y: number, width: number, height: number, color: number): void {
        const x0 = Math.max(0, x);
        const y0 = Math.max(0, y);
        const x1 = Math.min(this.width, x + width);
        const y1 = Math.min(this.height, y + height);
        const c = color & 0x0f;

        for (let py = y0; py < y1; py++) {
            this.pixels.fill(c, py * this.width + x0, py * this.width + x1);
        }
    }

    blitNibbles(
        x: number,
        y: number,
        rows: readonly (readonly number[])[],
        opts: { transparent?: number } = {},
    ): void {
        const transparent = opts.transparent ?? 0;

        for (let row = 0; row < rows.length; row++) {
            const pixels = rows[row];
            for (let col = 0; col < pixels.length; col++) {
                const color = pixels[col] & 0x0f;
                if (color === transparent) continue;
                this.setPixel(x + col, y + row, color);
            }
        }
    }

    blitTexture(
        x: number,
        y: number,
        texture: IndexedTexture,
        opts: { transparent?: number; tint?: number } = {},
    ): void {
        const transparent = opts.transparent ?? 0;
        const tint = opts.tint;

        for (let row = 0; row < texture.height; row++) {
            for (let col = 0; col < texture.width; col++) {
                const color = texture.pixels[row * texture.width + col] & 0x0f;
                if (color === transparent) continue;
                this.setPixel(x + col, y + row, tint ?? color);
            }
        }
    }

    toImageData(): ImageData {
        for (let i = 0; i < this.pixels.length; i++) {
            const [r, g, b, a] = palette[this.pixels[i]];
            const j = i * 4;
            this.rgba[j] = r;
            this.rgba[j + 1] = g;
            this.rgba[j + 2] = b;
            this.rgba[j + 3] = this.pixels[i] === 0 ? 0xff : a;
        }

        return new ImageData(this.rgba, this.width, this.height);
    }
}

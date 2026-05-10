import { FRAMEBUFFER_HEIGHT, FRAMEBUFFER_WIDTH, TICK_HZ } from "./constants";
import { IndexedFramebuffer } from "./framebuffer";
import { InputBit, type InputState } from "./input";
import { drawStaticCliffs, type JoustTextures, type LoadedFontGlyph, type LoadedSpriteImage } from "./playfield";
import type { IndexedTexture } from "./texture";

const enum JoustColor {
    White = 1,
    Cyan = 2,
    Magenta = 3,
    Red = 4,
    Yellow = 5,
    Green = 7,
    Brown = 8,
    Purple = 9,
    Orange = 8,
    BlueGray = 13,
}

interface AttractLine {
    readonly text: string;
    readonly x: number;
    readonly y: number;
    readonly color: JoustColor;
    readonly font?: "FONT57" | "FONT35";
}

interface AttractPage {
    readonly lines: readonly AttractLine[];
    readonly lesson?: "fly" | "survive" | "eggs" | "enemies" | "pterodactyl" | "start" | "copyright";
}

const enum GameMode {
    Attract,
    Playing,
}

const enum AttractPhase {
    Boot,
    Leaderboard,
    Title,
    Rules,
}

const BOOT_FRAMES = TICK_HZ * 4;
const LEADERBOARD_FRAMES = TICK_HZ * 8;
const TITLE_FRAMES = TICK_HZ * 8;
const RULE_PAGE_FRAMES = TICK_HZ * 4;

const LEADERBOARD = [
    { initials: "KEN", score: "15950" },
    { initials: "JON", score: "12500" },
    { initials: "SAM", score: "10000" },
    { initials: "EJW", score: "07500" },
    { initials: "BSO", score: "05000" },
] as const;

function screenTextPosition(address: number): { x: number; y: number } {
    return {
        x: ((address >> 8) & 0xff) * 2,
        y: address & 0xff,
    };
}

function line(address: number, color: JoustColor, text: string, font?: "FONT57" | "FONT35"): AttractLine {
    return { ...screenTextPosition(address), color, text, font };
}

const ATTRACT_PAGES: readonly AttractPage[] = [
    {
        lesson: "fly",
        lines: [
            line(0x3420, JoustColor.Cyan, "WELCOME TO JOUST"),
            line(0x4230, JoustColor.White, "TO FLY,"),
            line(0x1b40, JoustColor.White, "REPEATEDLY PRESS THE 'FLAP' BUTTON"),
        ],
    },
    {
        lesson: "survive",
        lines: [
            line(0x3231, JoustColor.White, "TO SURVIVE A JOUST"),
            line(0x2e41, JoustColor.White, "THE HIGHEST LANCE WINS"),
            line(0x3851, JoustColor.White, "IN A COLLISION"),
        ],
    },
    {
        lesson: "eggs",
        lines: [
            line(0x3532, JoustColor.White, "PICK UP THE EGGS"),
            line(0x3342, JoustColor.White, "BEFORE THEY HATCH"),
        ],
    },
    {
        lesson: "enemies",
        lines: [
            line(0x3433, JoustColor.White, "MEET THY ENEMIES"),
            line(0x10b6, JoustColor.Red, "BOUNDER (500)"),
            line(0x10c6, JoustColor.BlueGray, "HUNTER (750)"),
            line(0x10d6, JoustColor.Purple, "SHADOW LORD (1500)"),
        ],
    },
    {
        lesson: "pterodactyl",
        lines: [
            line(0x1a46, JoustColor.White, "BEWARE OF THE"),
            line(0x1286, JoustColor.White, "\"UNBEATABLE?\" PTERODACTYL"),
        ],
    },
    {
        lesson: "start",
        lines: [
            line(0x2457, JoustColor.White, "PRESS "),
            line(0x3657, JoustColor.Yellow, "\"SINGLE PLAY\""),
            line(0x5a57, JoustColor.White, " TO START"),
            line(0x4977, JoustColor.White, "OR"),
            line(0x2697, JoustColor.White, "INSERT ADDITIONAL COINS FOR"),
            line(0x3da7, JoustColor.Green, "\"DUAL PLAY\""),
        ],
    },
    {
        lesson: "copyright",
        lines: [
            line(0x1030, JoustColor.White, "THIS IS JOUST"),
            line(0x1040, JoustColor.White, "DESIGNED BY WILLIAMS ELECTRONICS INC.", "FONT35"),
            line(0x1050, JoustColor.White, "(C) 1982 WILLIAMS ELECTRONICS INC.", "FONT35"),
            line(0x1060, JoustColor.White, "ALL RIGHTS RESERVED", "FONT35"),
        ],
    },
] as const;

const FONT57_CHAR: Record<string, string> = {
    " ": "space",
    "<": "back_arrow",
    "=": "equals",
    "-": "dash",
    "?": "question",
    "!": "exclamation",
    "(": "left_paren",
    ")": "right_paren",
    "'": "apostrophe",
    ",": "comma",
    ".": "period",
    "/": "slash",
    "&": "ampersand",
    "\"": "quote",
    ":": "colon",
};

const FONT35_CHAR: Record<string, string> = {
    ...FONT57_CHAR,
    "000": "000",
};

function signedByte(value: number): number {
    return value & 0x80 ? value - 0x100 : value;
}

function spriteOffset(sprite: LoadedSpriteImage): { x: number; y: number } {
    return {
        x: signedByte((sprite.metadata.offsetWord >> 8) & 0xff),
        y: signedByte(sprite.metadata.offsetWord & 0xff),
    };
}

export class JoustCore {
    readonly framebuffer = new IndexedFramebuffer();
    frame = 0;
    private accumulator = 0;
    private textures: JoustTextures | null = null;
    private mode = GameMode.Attract;
    private credits = 0;
    private score = 0;
    private previousInputBits = 0;
    private playerX = 100;
    private playerY = 168;
    private playerVx = 0;
    private playerVy = 0;
    private playerFacing: "left" | "right" = "right";

    setTextures(textures: JoustTextures): void {
        this.textures = textures;
    }

    stepSeconds(dt: number, input: InputState): boolean {
        this.accumulator += dt;
        const tick = 1 / TICK_HZ;
        let rendered = false;

        while (this.accumulator >= tick) {
            this.accumulator -= tick;
            this.tick(input);
            rendered = true;
        }

        return rendered;
    }

    tick(input: InputState): void {
        this.frame++;
        this.processInputs(input);

        if (this.mode === GameMode.Playing) {
            this.updatePlaying(input);
            this.drawPlaying();
        } else {
            this.drawAttract();
        }

        this.previousInputBits = input.bits;
    }

    private processInputs(input: InputState): void {
        if (this.wasPressed(input, InputBit.Coin)) {
            this.credits = Math.min(99, this.credits + 1);
        }

        if (this.mode === GameMode.Attract && this.credits > 0 && this.wasPressed(input, InputBit.P1Start)) {
            this.credits--;
            this.mode = GameMode.Playing;
            this.score = 0;
            this.playerX = 100;
            this.playerY = 168;
            this.playerVx = 0;
            this.playerVy = 0;
            this.playerFacing = "right";
        }
    }

    private wasPressed(input: InputState, bit: InputBit): boolean {
        return (input.bits & bit) !== 0 && (this.previousInputBits & bit) === 0;
    }

    private isDown(input: InputState, bit: InputBit): boolean {
        return (input.bits & bit) !== 0;
    }

    private updatePlaying(input: InputState): void {
        const move = (this.isDown(input, InputBit.P1Right) ? 1 : 0) - (this.isDown(input, InputBit.P1Left) ? 1 : 0);
        if (move !== 0) {
            this.playerFacing = move < 0 ? "left" : "right";
            this.playerVx = Math.max(-2.2, Math.min(2.2, this.playerVx + move * 0.45));
        } else {
            this.playerVx *= 0.82;
        }

        if (this.wasPressed(input, InputBit.P1Flap)) {
            this.playerVy = Math.min(this.playerVy, -3.8);
        }

        this.playerVy = Math.min(3.4, this.playerVy + 0.18);
        this.playerX += this.playerVx;
        this.playerY += this.playerVy;

        if (this.playerX < -20) this.playerX = FRAMEBUFFER_WIDTH + 20;
        if (this.playerX > FRAMEBUFFER_WIDTH + 20) this.playerX = -20;

        const floorY = 202;
        if (this.playerY > floorY) {
            this.playerY = floorY;
            this.playerVy = 0;
        }
        if (this.playerY < 42) {
            this.playerY = 42;
            this.playerVy = 0;
        }
    }

    private drawPlaying(): void {
        const fb = this.framebuffer;
        fb.clear(0);

        fb.fillRect(0, FRAMEBUFFER_HEIGHT - 28, FRAMEBUFFER_WIDTH, 28, JoustColor.Red);
        if (this.textures) {
            drawStaticCliffs(fb, this.textures);
            this.drawPlayer();
            this.blitSprite(`IFLAME_0${Math.floor(this.frame / 10) % 4}_FLAME${(Math.floor(this.frame / 10) % 4) + 1}_x0_ym${[14, 15, 15, 11][Math.floor(this.frame / 10) % 4]}`, 10, 230);
            this.blitSprite(`IFLAME_0${(Math.floor(this.frame / 10) + 2) % 4}_FLAME${((Math.floor(this.frame / 10) + 2) % 4) + 1}_x0_ym${[14, 15, 15, 11][(Math.floor(this.frame / 10) + 2) % 4]}`, 286, 230);
        }

        this.drawStatusText();
        this.centerText("WAVE 1", 40, JoustColor.Yellow, "FONT57");
    }

    private drawPlayer(): void {
        const flap = Math.floor(this.frame / 8) % 2;
        const horse =
            this.playerFacing === "right"
                ? ["OSTRICH_12_OFLY1R_x0_ym19", "OSTRICH_16_OFLY3R_x0_ym19"][flap]
                : ["OSTRICH_13_OFLY1L_x0_ym19", "OSTRICH_17_OFLY3L_x0_ym19"][flap];
        const rider = this.playerFacing === "right" ? "PLYR1_02_PLY1R_xp2_ym19" : "PLYR1_03_PLY1L_x0_ym19";
        const originX = Math.round(this.playerX);
        const originY = Math.round(this.playerY + 19);

        this.blitSpriteAtOrigin(horse, originX, originY);
        this.blitSpriteAtOrigin(rider, originX, originY);
    }

    private drawAttract(): void {
        const phase = this.currentAttractPhase();
        const fb = this.framebuffer;
        fb.clear(0);

        if (phase === AttractPhase.Boot) {
            this.drawBootDiagnostics();
            return;
        }

        fb.fillRect(0, FRAMEBUFFER_HEIGHT - 28, FRAMEBUFFER_WIDTH, 28, JoustColor.Red);
        if (this.textures) {
            drawStaticCliffs(fb, this.textures);
        }

        this.drawStatusText();
        switch (phase) {
            case AttractPhase.Leaderboard:
                this.drawLeaderboard();
                break;
            case AttractPhase.Title:
                this.drawTitleScreen();
                break;
            case AttractPhase.Rules:
                if (this.textures) this.drawAttractSprites();
                this.drawAttractPage();
                break;
        }
    }

    private currentAttractPhase(): AttractPhase {
        if (this.frame < BOOT_FRAMES) return AttractPhase.Boot;
        const loopFrame = (this.frame - BOOT_FRAMES) % this.attractLoopFrames();
        if (loopFrame < LEADERBOARD_FRAMES) return AttractPhase.Leaderboard;
        if (loopFrame < LEADERBOARD_FRAMES + TITLE_FRAMES) return AttractPhase.Title;
        return AttractPhase.Rules;
    }

    private attractLoopFrames(): number {
        return LEADERBOARD_FRAMES + TITLE_FRAMES + ATTRACT_PAGES.length * RULE_PAGE_FRAMES;
    }

    private rulesFrame(): number {
        const loopFrame = (this.frame - BOOT_FRAMES) % this.attractLoopFrames();
        return Math.max(0, loopFrame - LEADERBOARD_FRAMES - TITLE_FRAMES);
    }

    private drawBootDiagnostics(): void {
        this.drawText("INITIAL TESTS INDICATE", 0x30 * 2, 0x70, JoustColor.Purple, "FONT57");
        this.drawText("ALL SYSTEMS GO", 0x3a * 2, 0x90, JoustColor.Purple, "FONT57");
    }

    private drawLeaderboard(): void {
        this.centerText("DAILY BUZZARDS", 42, JoustColor.White, "FONT57");
        this.centerText("JOUST CHAMPIONS", 96, JoustColor.Cyan, "FONT57");

        for (let i = 0; i < LEADERBOARD.length; i++) {
            const entry = LEADERBOARD[i];
            const y = 116 + i * 13;
            this.drawText(`${i + 1}`, 76, y, JoustColor.Yellow, "FONT57");
            this.drawText(entry.initials, 104, y, i === 0 ? JoustColor.Yellow : JoustColor.White, "FONT57");
            this.drawText(entry.score, 172, y, i === 0 ? JoustColor.Yellow : JoustColor.White, "FONT57");
        }

        if (this.textures) {
            const flap = Math.floor(this.frame / 12) % 2;
            this.blitSprite(`BUZARD_${flap === 0 ? "12_BFLY1R_x0_ym14" : "16_BFLY3R_x0_ym19"}`, 26, 44);
            this.blitSprite(`BUZARD_${flap === 0 ? "13_BFLY1L_x0_ym14" : "17_BFLY3L_x0_ym19"}`, 246, 44);
        }
    }

    private drawTitleScreen(): void {
        this.drawScaledText("JOUST", 49, 56, 5, JoustColor.Red, "FONT57");
        this.drawScaledText("JOUST", 46, 52, 5, JoustColor.Yellow, "FONT57");
        this.centerText("THIS IS JOUST", 118, JoustColor.White, "FONT57");
        this.centerText("(C) 1982 WILLIAMS ELECTRONICS INC.", 142, JoustColor.White, "FONT35");
        this.centerText("ALL RIGHTS RESERVED", 154, JoustColor.White, "FONT35");

        if (this.textures) {
            const flap = Math.floor(this.frame / 12) % 2;
            this.blitSpriteAtOrigin(["OSTRICH_12_OFLY1R_x0_ym19", "OSTRICH_16_OFLY3R_x0_ym19"][flap], 60, 195);
            this.blitSpriteAtOrigin("PLYR1_02_PLY1R_xp2_ym19", 60, 195);
            this.blitSpriteAtOrigin(["STORK_13_SFLY1L_xp1_ym19", "STORK_17_SFLY3L_x0_ym19"][flap], 238, 195);
            this.blitSpriteAtOrigin("PLYR2_03_PLY2L_x0_ym19", 238, 195);
        }
    }

    private drawAttractSprites(): void {
        const t = this.textures;
        if (!t) return;

        const ostrichFrames = ["OSTRICH_12_OFLY1R_x0_ym19", "OSTRICH_16_OFLY3R_x0_ym19"];
        const storkFrames = ["STORK_12_SFLY1R_x0_ym19", "STORK_16_SFLY3R_x0_ym19"];
        const enemyFrames = ["BUZARD_13_BFLY1L_x0_ym14", "BUZARD_17_BFLY3L_x0_ym19"];
        const pterodactylFrames = ["IPTERO_00_PT1R_xp1_ym11", "IPTERO_02_PT2R_xp1_ym7", "IPTERO_04_PT3R_x0_ym10"];
        const flap = Math.floor(this.frame / 12) % 2;
        const page = this.currentAttractPage();
        const drift = this.frame % (FRAMEBUFFER_WIDTH + 40);
        const playerX = -24 + drift;
        const enemyX = FRAMEBUFFER_WIDTH - (drift % (FRAMEBUFFER_WIDTH + 50));
        const playerY = 114 + Math.trunc(Math.sin(this.frame / 24) * 8);
        const enemyY = 112 + Math.trunc(Math.sin(this.frame / 31) * 6);

        if (page.lesson !== "start" && page.lesson !== "copyright" && page.lesson !== "pterodactyl") {
            this.blitSpriteAtOrigin(ostrichFrames[flap], playerX, playerY + 19);
            this.blitSpriteAtOrigin("PLYR1_02_PLY1R_xp2_ym19", playerX, playerY + 19);
            this.blitSpriteAtOrigin(storkFrames[flap], 206, 159);
            this.blitSpriteAtOrigin("PLYR2_02_PLY2R_xp2_ym19", 206, 159);
            this.blitSprite(enemyFrames[flap], enemyX, enemyY);
        }
        this.blitSprite("EGGI_00_EGGUP_x0_ym6", 152, 154);
        if (page.lesson === "enemies") {
            this.blitSprite(enemyFrames[flap], 214, 172);
            this.blitSprite("BUZARD_12_BFLY1R_x0_ym14", 214, 192);
            this.blitSprite("BUZARD_16_BFLY3R_x0_ym19", 214, 212);
        }
        if (page.lesson === "pterodactyl") {
            this.blitSprite(pterodactylFrames[Math.floor(this.frame / 10) % pterodactylFrames.length], 128, 120);
        }
        this.blitSprite(`IFLAME_0${Math.floor(this.frame / 10) % 4}_FLAME${(Math.floor(this.frame / 10) % 4) + 1}_x0_ym${[14, 15, 15, 11][Math.floor(this.frame / 10) % 4]}`, 10, 230);
        this.blitSprite(`IFLAME_0${(Math.floor(this.frame / 10) + 2) % 4}_FLAME${((Math.floor(this.frame / 10) + 2) % 4) + 1}_x0_ym${[14, 15, 15, 11][(Math.floor(this.frame / 10) + 2) % 4]}`, 286, 230);
    }

    private drawStatusText(): void {
        this.drawText("1UP", 16, 8, JoustColor.White, "FONT57");
        this.drawText(String(this.score), 22, 18, JoustColor.White, "FONT57");
        this.centerText("HIGH SCORE", 8, JoustColor.White, "FONT57");
        this.centerText("15950", 18, JoustColor.Yellow, "FONT57");
        this.drawText(`CREDITS ${this.credits.toString().padStart(2, "0")}`, 108, 228, JoustColor.White, "FONT57");
    }

    private currentAttractPage(): AttractPage {
        return ATTRACT_PAGES[Math.floor(this.rulesFrame() / RULE_PAGE_FRAMES) % ATTRACT_PAGES.length];
    }

    private drawAttractPage(): void {
        for (const { text, x, y, color, font = "FONT57" } of this.currentAttractPage().lines) {
            this.drawText(text, x, y, color, font);
        }
    }

    private blitSprite(name: string, x: number, y: number): void {
        const sprite = this.sprite(name);
        if (!sprite) return;
        this.framebuffer.blitTexture(x, y, sprite.texture, { transparent: 0 });
    }

    private blitSpriteAtOrigin(name: string, originX: number, originY: number): void {
        const sprite = this.sprite(name);
        if (!sprite) return;
        const offset = spriteOffset(sprite);
        this.framebuffer.blitTexture(originX + offset.x, originY + offset.y, sprite.texture, { transparent: 0 });
    }

    private sprite(name: string): LoadedSpriteImage | undefined {
        return this.textures?.sprites.find((sprite) => sprite.metadata.name === name);
    }

    private glyph(font: "FONT57" | "FONT35", char: string): LoadedFontGlyph | undefined {
        return this.textures?.fonts.find((glyph) => glyph.metadata.font === font && glyph.metadata.char === char);
    }

    private centerText(text: string, y: number, color: number, font: "FONT57" | "FONT35"): void {
        this.drawText(text, Math.floor((FRAMEBUFFER_WIDTH - this.measureText(text, font)) / 2), y, color, font);
    }

    private drawText(text: string, x: number, y: number, color: number, font: "FONT57" | "FONT35"): void {
        let cursor = x;
        for (let i = 0; i < text.length; i++) {
            const token = this.charToken(text, i, font);
            if (!token) continue;
            if (token.advance > 1) i += token.advance - 1;
            const glyph = this.glyph(font, token.char);
            if (!glyph) {
                cursor += font === "FONT57" ? 7 : 5;
                continue;
            }
            this.framebuffer.blitTexture(cursor, y, glyph.texture, { transparent: 0, tint: color });
            cursor += glyph.texture.width + 1;
        }
    }

    private drawScaledText(text: string, x: number, y: number, scale: number, color: number, font: "FONT57" | "FONT35"): void {
        let cursor = x;
        for (let i = 0; i < text.length; i++) {
            const token = this.charToken(text, i, font);
            if (!token) continue;
            if (token.advance > 1) i += token.advance - 1;
            const glyph = this.glyph(font, token.char);
            if (!glyph) {
                cursor += (font === "FONT57" ? 7 : 5) * scale;
                continue;
            }

            for (let row = 0; row < glyph.texture.height; row++) {
                for (let col = 0; col < glyph.texture.width; col++) {
                    if ((glyph.texture.pixels[row * glyph.texture.width + col] & 0x0f) === 0) continue;
                    this.framebuffer.fillRect(cursor + col * scale, y + row * scale, scale, scale, color);
                }
            }
            cursor += (glyph.texture.width + 1) * scale;
        }
    }

    private measureText(text: string, font: "FONT57" | "FONT35"): number {
        let width = 0;
        for (let i = 0; i < text.length; i++) {
            const token = this.charToken(text, i, font);
            if (!token) continue;
            if (token.advance > 1) i += token.advance - 1;
            const glyph = this.glyph(font, token.char);
            width += (glyph?.texture.width ?? (font === "FONT57" ? 6 : 4)) + 1;
        }
        return Math.max(0, width - 1);
    }

    private charToken(text: string, index: number, font: "FONT57" | "FONT35"): { char: string; advance: number } | null {
        if (font === "FONT35" && text.slice(index, index + 3) === "000") return { char: "000", advance: 3 };
        const char = text[index].toUpperCase();
        if (/^[A-Z0-9]$/.test(char)) return { char, advance: 1 };
        const mapped = (font === "FONT57" ? FONT57_CHAR : FONT35_CHAR)[char];
        if (mapped) return { char: mapped, advance: 1 };
        return null;
    }
}

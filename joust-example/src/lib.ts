import type { Config, Plugin, State } from "@dylanebert/shallot";
import { JoustCore } from "./core/joust";
import { InputBit, InputState } from "./core/input";
import { loadJoustTextures } from "./core/playfield";

function bindKeyboard(input: InputState): () => void {
    const apply = (event: KeyboardEvent, down: boolean) => {
        switch (event.code) {
            case "ArrowLeft":
                input.set(InputBit.P1Left, down);
                event.preventDefault();
                break;
            case "ArrowRight":
                input.set(InputBit.P1Right, down);
                event.preventDefault();
                break;
            case "KeyZ":
                input.set(InputBit.P1Flap, down);
                event.preventDefault();
                break;
            case "Digit1":
                input.set(InputBit.P1Start, down);
                event.preventDefault();
                break;
            case "Digit5":
                input.set(InputBit.Coin, down);
                event.preventDefault();
                break;
        }
    };

    const keydown = (event: KeyboardEvent) => apply(event, true);
    const keyup = (event: KeyboardEvent) => apply(event, false);
    window.addEventListener("keydown", keydown);
    window.addEventListener("keyup", keyup);

    return () => {
        window.removeEventListener("keydown", keydown);
        window.removeEventListener("keyup", keyup);
    };
}

function createJoustPlugin(core: JoustCore, input: InputState, present: () => void): Plugin {
    return {
        name: "Joust",
        async initialize() {
            core.setTextures(await loadJoustTextures());
            core.tick(input);
            present();
        },
        systems: [
            {
                update(state: State) {
                    const dt = state.scheduler.time.deltaTime;
                    if (core.stepSeconds(dt, input)) present();
                },
            },
        ],
    };
}

export function config(): Config {
    const canvas = document.querySelector("canvas");
    if (!(canvas instanceof HTMLCanvasElement)) {
        throw new Error("Joust requires a canvas element");
    }

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("2D canvas context unavailable");

    const core = new JoustCore();
    const input = new InputState();
    const cleanupKeyboard = bindKeyboard(input);

    canvas.width = core.framebuffer.width;
    canvas.height = core.framebuffer.height;
    ctx.imageSmoothingEnabled = false;

    const present = () => {
        ctx.putImageData(core.framebuffer.toImageData(), 0, 0);
    };

    present();

    return {
        defaults: false,
        plugins: [createJoustPlugin(core, input, present)],
        setup(state) {
            state.onDispose(cleanupKeyboard);
        },
    };
}

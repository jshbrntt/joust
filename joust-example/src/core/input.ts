export const enum InputBit {
    P1Left = 1 << 0,
    P1Right = 1 << 1,
    P1Flap = 1 << 2,
    P1Start = 1 << 3,
    Coin = 1 << 4,
}

export class InputState {
    bits = 0;

    set(bit: InputBit, down: boolean): void {
        if (down) {
            this.bits |= bit;
        } else {
            this.bits &= ~bit;
        }
    }
}

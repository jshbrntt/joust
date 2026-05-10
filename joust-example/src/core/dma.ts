export const DMAFIX = 0x0404;

export const enum DmaControlBit {
    SuppressConstantHighNibble = 0x80,
    SuppressConstantLowNibble = 0x40,
    FlavorRight = 0x20,
    ReplaceDataWithConstant = 0x10,
    SuppressZeroes = 0x08,
    SlowForRam = 0x04,
    WriteBlock = 0x02,
    ReadBlock = 0x01,
}

export interface DmaSize {
    readonly widthBytes: number;
    readonly height: number;
}

export function decodeDmaSize(dmaControl: number): DmaSize {
    const fixed = dmaControl ^ DMAFIX;
    return {
        widthBytes: (fixed >> 8) & 0xff,
        height: fixed & 0xff,
    };
}

export function hasDmaControl(control: number, bit: DmaControlBit): boolean {
    return (control & bit) !== 0;
}

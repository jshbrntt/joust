import { directImages } from "./directImages";
import { imageDescriptors } from "./imageDescriptors";
import { imagePointers } from "./imagePointers";

export interface GeneratedAssets {
    readonly source: "placeholder" | "rom";
    readonly imagePointers: typeof imagePointers;
    readonly imageDescriptors: typeof imageDescriptors;
    readonly directImages: typeof directImages;
}

export const assets: GeneratedAssets = {
    source: "placeholder",
    imagePointers,
    imageDescriptors,
    directImages,
};

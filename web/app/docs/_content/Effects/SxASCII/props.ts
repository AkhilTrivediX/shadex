import { DocPropsType } from "@/types";

export const propsData: DocPropsType[] = [
    {
        name: "asciiChars",
        optional: true,
        type: "string",
        description: "The ASCII character set to be used.",
        default: ".:-=+*#%@"
    },
    {
        name: "pixelSize",
        optional: true,
        type: "number",
        description: "The size of blocks for ASCII characters.",
        default: "12"
    },
    {
        name: "showBlocks",
        optional: true,
        type: "boolean",
        description: "Whether to show blocks of ASCII characters.",
        default: "false"
    },
    {
        name: "backgroundColor",
        optional: true,
        type: "[number, number, number, number]",
        description: "The background color of the pixelated scene. (R, G, B, A).",
        default: "[0.0, 0.0, 0.0, 0.0]",
        note: "No need when using showBlocks."
    },
    {
        name: "minLuma",
        optional: true,
        type: "number",
        description: "The minimum luminosity of the scene.",
        default: "0.0",
        note: "Adjust if minimum luminosity is not 0."
    },
    {
        name: "maxLuma",
        optional: true,
        type: "number",
        description: "The maximum luminosity of the scene.",
        default: "1.0",
        note: "Adjust if maximum luminosity is not 1."
    }
]
import { DocPropsType } from "@/types";

export const propsData: DocPropsType[] = [
    {
        name: "pixelSize",
        optional: true,
        type: "[number, number]",
        description: "The size of pixelation on X, Y.",
        default: "[5, 5]"
    },
    {
        name: "dynamicPixelWidth",
        optional: true,
        type: "boolean",
        description: "Pixel block width depends on luminosity.",
        default: "false"
    },
    {
        name: "backgroundColor",
        optional: true,
        type: "[number, number, number, number]",
        description: "The background color of the pixelated scene. (R, G, B, A).",
        default: "[0.0, 0.0, 0.0, 0.0]",
        note: "Applied when pixelation results in transparency."
    },
    {
        name: "monochrome",
        optional: true,
        type: "boolean",
        description: "Whether to apply monochrome effect.",
        default: "false"
    },
    {
        name: "monochromeColor",
        optional: true,
        type: "[number, number, number]",
        description: "The color of the monochrome effect. (R, G, B).",
        default: "[1.0, 1.0, 1.0]",
        note: "Requires `monochrome` to work."
    },
    {
        name: "threshold",
        optional: true,
        type: "number",
        description: "The threshold for lumination to exclude pixels.",
        default: "0.0",
        note: "For Advanced Use"
    },
    {
        name: "contrast",
        optional: true,
        type: "number",
        description: "The contrast of the monochrome effect.",
        default: "2.0",
        note: "To adjust luminosity of scene."
    }
]
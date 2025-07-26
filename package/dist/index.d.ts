import * as react_jsx_runtime from 'react/jsx-runtime';
import * as THREE from 'three';
import * as react from 'react';

declare function Shadex({ src, className, style, children, controls, mesh, lightIntensity, loader, pauseRender, renderOnHidden, videoOptions }: {
    src?: string;
    className?: string;
    style?: React.CSSProperties;
    children?: React.JSX.Element | React.JSX.Element[];
    controls?: boolean;
    mesh?: React.ReactNode;
    lightIntensity?: number;
    loader?: React.ReactNode | ((progress: number) => React.ReactNode);
    pauseRender?: boolean;
    renderOnHidden?: boolean;
    videoOptions?: {
        muted?: boolean;
        loop?: boolean;
        start?: boolean;
        preload?: string;
    };
}): react_jsx_runtime.JSX.Element;

type effectOptions$3 = {
    pixelSize?: number;
    asciiChars?: string;
    backgroundColor?: [number, number, number, number];
    minLuma?: number;
    maxLuma?: number;
    showBlocks?: boolean;
};
declare function SxASCII(props: effectOptions$3): react_jsx_runtime.JSX.Element;

type effectOptions$2 = {
    subdivisions?: number | [number, number];
    elasticity?: number;
};
declare function SxDisplace({ subdivisions, elasticity }: effectOptions$2): react_jsx_runtime.JSX.Element;

type EngraveProps = {
    amplitude?: number;
    frequency?: number;
    thickness?: number;
    brightness?: number;
    monochrome?: boolean;
    backgroundColor?: [number, number, number, number];
};
declare function SxEngrave(props: EngraveProps): react_jsx_runtime.JSX.Element;

type effectOptions$1 = {
    noiseStrength?: number;
    lineStrength?: number;
    vignetteStrength?: number;
    samplesCount?: number;
    anglesCount?: number;
    backgroundColor?: [number, number, number, number];
};
declare function SxNotebook(props: effectOptions$1): react_jsx_runtime.JSX.Element;

type effectOptions = {
    pixelSize?: [number, number];
    threshold?: number;
    backgroundColor?: [number, number, number, number];
    monochrome?: boolean;
    monochromeColor?: [number, number, number];
    contrast?: number;
    dynamicPixelWidth?: boolean;
};
declare function SxPixelate(props: effectOptions): react_jsx_runtime.JSX.Element;

type ShadexContextValue = {
    mousePosition: {
        x: number;
        y: number;
    };
};
declare const useShadex: () => ShadexContextValue;
declare const ShadexProvider: ({ children }: {
    children: React.ReactNode;
}) => react_jsx_runtime.JSX.Element;

declare function useIsClient(): boolean;

type ViExtrudeProps = {
    src: string;
    depth?: number;
    bevel?: boolean;
    bevelThickness?: number;
    bevelSize?: number;
    bevelSegments?: number;
    scale?: number;
    color?: string;
    material?: THREE.Material;
    metalness?: number;
    roughness?: number;
};
declare function ExtrudeSVG(props: ViExtrudeProps): react_jsx_runtime.JSX.Element;

declare function ImagePlane({ url, material, width, height, zoom }: {
    url: string;
    material?: THREE.Material;
    width: number;
    height: number;
    zoom: number;
}): react_jsx_runtime.JSX.Element;
declare function VideoPlane({ url, width, height, zoom, unmuted, loop, autoplay, }: {
    url: string;
    width: number;
    height: number;
    zoom: number;
    unmuted?: boolean;
    loop?: boolean;
    autoplay?: boolean;
}): react_jsx_runtime.JSX.Element;
declare function isSrcVideo(src: string | undefined): boolean;
declare function useElementSize<T extends HTMLElement>(): readonly [react.RefObject<T>, {
    width: number;
    height: number;
}];
declare function getNormalizedPosition(position: {
    x: number;
    y: number;
}, container: HTMLElement, previousNormalizedPosition?: {
    x: number;
    y: number;
}): {
    x: number;
    y: number;
};
declare const clamp: (value: number, min: number, max: number) => number;

export { ExtrudeSVG, ImagePlane, Shadex, ShadexProvider, SxASCII, SxDisplace, SxEngrave, SxNotebook, SxPixelate, VideoPlane, clamp, getNormalizedPosition, isSrcVideo, useElementSize, useIsClient, useShadex };

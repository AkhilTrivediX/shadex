// src/components/Shadex.tsx
import { Canvas } from "@react-three/fiber";

// src/utils/utils.tsx
import { useLoader } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useVideoTexture } from "@react-three/drei";
import { jsx, jsxs } from "react/jsx-runtime";
function ImagePlane({
  url,
  material,
  width,
  height,
  zoom
}) {
  const texture = useLoader(THREE.TextureLoader, url);
  const planeWidth = width / zoom;
  const planeHeight = height / zoom;
  return /* @__PURE__ */ jsxs("mesh", { children: [
    /* @__PURE__ */ jsx("planeGeometry", { args: [planeWidth, planeHeight] }),
    material ? /* @__PURE__ */ jsx("primitive", { object: material, attach: "material" }) : /* @__PURE__ */ jsx("meshBasicMaterial", { map: texture, toneMapped: false, side: THREE.DoubleSide })
  ] });
}
function VideoPlane({
  url,
  width,
  height,
  zoom,
  unmuted,
  loop = true,
  autoplay = true
}) {
  const texture = useVideoTexture(url, {
    muted: !unmuted,
    loop,
    start: autoplay,
    preload: "auto"
  });
  const planeWidth = width / zoom;
  const planeHeight = height / zoom;
  useEffect(() => {
    texture.source.data.muted = !unmuted;
    texture.source.data.play();
    return () => {
      texture.source.data.pause();
    };
  }, [texture, unmuted]);
  return /* @__PURE__ */ jsxs("mesh", { children: [
    /* @__PURE__ */ jsx("planeGeometry", { args: [planeWidth, planeHeight] }),
    /* @__PURE__ */ jsx(
      "meshBasicMaterial",
      {
        map: texture,
        toneMapped: false,
        side: THREE.DoubleSide
      }
    )
  ] });
}
function isSrcVideo(src) {
  return src && /\.(mp4|webm|ogg)$/i.test(src);
}
function useElementSize() {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, size];
}
function getNormalizedPosition(position, container, previousNormalizedPosition) {
  const { left, top, bottom, right, width, height } = container.getBoundingClientRect();
  let x = position.x < left ? 0 : position.x > right ? width : position.x - left;
  x = x / width;
  let y = position.y < top ? 0 : position.y > bottom ? height : position.y - top;
  y = y / height;
  x = y == 0 || y == 1 ? -1 : x;
  y = x == 0 || x == 1 ? -1 : y;
  if (previousNormalizedPosition && previousNormalizedPosition.x === x && previousNormalizedPosition.y === y) return previousNormalizedPosition;
  return { x, y };
}
var clamp = (value, min, max) => Math.max(min, Math.min(value, max));

// src/components/Shadex.tsx
import { Html, OrbitControls, useProgress } from "@react-three/drei";
import { Suspense, useEffect as useEffect4, useState as useState4 } from "react";
import { EffectComposer } from "@react-three/postprocessing";

// src/hooks/ShadexContext.tsx
import { createContext, useContext, useEffect as useEffect2, useState as useState2 } from "react";
import { jsx as jsx2 } from "react/jsx-runtime";
var ShadexContext = createContext(null);
var useShadex = () => {
  const ctx = useContext(ShadexContext);
  return ctx;
};
var ShadexProvider = ({ children }) => {
  const [mousePosition, setMousePosition] = useState2({ x: 0, y: 0 });
  useEffect2(() => {
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  return /* @__PURE__ */ jsx2(ShadexContext.Provider, { value: { mousePosition }, children });
};

// src/hooks/useOutOfViewport.ts
import { useState as useState3, useEffect as useEffect3 } from "react";
function useOutOfViewport(ref) {
  const [isOutOfViewport, setIsOutOfViewport] = useState3(false);
  useEffect3(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsOutOfViewport(!entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1
        // Trigger when 10% is visible
      }
    );
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, [ref]);
  return isOutOfViewport;
}

// src/components/Shadex.tsx
import { Fragment, jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
function Shadex({
  src,
  width,
  height,
  children,
  controls,
  mesh,
  lightIntensity = 1,
  loader,
  pauseRender,
  playWhenHidden,
  videoOptions
}) {
  if (!src && !mesh) throw new Error("src or mesh props are required for effect to be applied.");
  const [containerRef, { width: pxWidth, height: pxHeight }] = useElementSize();
  const zoom = 100;
  const is3DMode = !src;
  const shadexCtx = useShadex();
  const { progress: sceneProgress } = useProgress();
  const isOutOfViewport = useOutOfViewport(containerRef);
  const [readyToPause, setReadyToPause] = useState4(false);
  const [videoUnmuted, setVideoUnmuted] = useState4(false);
  if (!shadexCtx && process.env.NODE_ENV === "development") {
    console.warn("We recommend wrapping children in ShadexProvider in root layout.tsx for better performance.");
  }
  useEffect4(() => {
    if (sceneProgress === 100) setReadyToPause(true);
  }, [sceneProgress]);
  const content = /* @__PURE__ */ jsx3("div", { className: "Shadex", ref: containerRef, style: { width: typeof width === "string" ? width : `${width}px`, height: typeof height === "string" ? height : `${height}px` }, onClick: () => {
    if (isSrcVideo(src) && !videoUnmuted) {
      setVideoUnmuted(true);
    }
  }, children: /* @__PURE__ */ jsxs2(Canvas, { orthographic: !is3DMode, camera: is3DMode ? { position: [0, 0, 5], fov: 75 } : { position: [0, 0, 5], zoom }, gl: { alpha: true }, style: { width: "100%", height: "100%" }, frameloop: readyToPause && (pauseRender || !playWhenHidden && isOutOfViewport) ? "never" : isSrcVideo(src) ? "always" : "demand", children: [
    controls && /* @__PURE__ */ jsx3(OrbitControls, { enablePan: false }),
    /* @__PURE__ */ jsxs2(Suspense, { fallback: /* @__PURE__ */ jsx3(Html, { center: true, className: "w-full h-full", children: !loader ? /* @__PURE__ */ jsxs2("div", { children: [
      "Loading... ",
      sceneProgress,
      "%"
    ] }) : typeof loader === "function" ? loader(sceneProgress) : loader }), children: [
      /* @__PURE__ */ jsxs2(Fragment, { children: [
        /* @__PURE__ */ jsx3("ambientLight", { intensity: lightIntensity }),
        /* @__PURE__ */ jsx3("directionalLight", { position: [5, 10, 5], intensity: 1.5 })
      ] }),
      src ? !isSrcVideo(src) ? /* @__PURE__ */ jsx3(ImagePlane, { url: src, width: pxWidth, height: pxHeight, zoom }) : /* @__PURE__ */ jsx3(VideoPlane, { url: src, width: pxWidth, height: pxHeight, zoom, unmuted: !videoOptions?.muted && videoUnmuted, loop: videoOptions?.loop, autoplay: videoOptions?.start }) : null,
      mesh,
      children && /* @__PURE__ */ jsx3(EffectComposer, { children })
    ] })
  ] }) });
  if (shadexCtx) return content;
  else return /* @__PURE__ */ jsx3(ShadexProvider, { children: content });
}

// src/components/SxASCII.tsx
import { useThree } from "@react-three/fiber";
import { BlendFunction, Effect, EffectPass } from "postprocessing";
import { useMemo } from "react";
import * as THREE2 from "three";
import { jsx as jsx4 } from "react/jsx-runtime";
var ASCIIEffectImpl = class extends Effect {
  constructor({
    pixelSize = 12,
    asciiChars = ".:-=+*#%@",
    // Default ASCII set
    backgroundColor = [0, 0, 0, 0],
    // Default transparent
    minLuma = 0,
    maxLuma = 1
  }) {
    const fragmentShader = `
    uniform float uPixelSize;
    uniform sampler2D uAsciiTexture;
    uniform vec2 uCharCount;
    uniform vec4 uBackgroundColor;
    uniform float uMinLuma;
    uniform float uMaxLuma;
    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        vec2 normalizedPixelSize = uPixelSize / resolution;
        vec2 uvPixel = normalizedPixelSize * floor(uv / normalizedPixelSize);
        vec4 color = texture2D(inputBuffer, uvPixel);

        vec2 pix = uv * resolution.xy;

        float luma = dot(vec3(0.2126, 0.7152, 0.0722), color.rgb);
        float normalizedLuma = (luma - uMinLuma) / (uMaxLuma - uMinLuma);
        vec2 cellUV = fract(uv / normalizedPixelSize);

        float charIndex = clamp(
            floor(normalizedLuma * (uCharCount.x - 1.0)),
            0.0,
            uCharCount.x - 1.0
        );
        
        vec2 asciiUV = vec2(
            (charIndex + cellUV.x) / uCharCount.x,
            cellUV.y
        );
      
        float character = texture2D(uAsciiTexture, asciiUV).r;

        
        outputColor = vec4(character * color.rgb * (normalizedLuma + 0.01), 1.0); 
        if(outputColor == vec4(0.0, 0.0, 0.0, 1.0)) {
            outputColor = uBackgroundColor;
        }
    }

    `;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const charSize = 64;
    canvas.width = charSize * asciiChars.length;
    canvas.height = charSize;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = `${charSize}px monospace`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    asciiChars.split("").forEach((char, i) => {
      ctx.fillText(char, (i + 0.5) * charSize, charSize / 2);
    });
    const asciiTexture = new THREE2.CanvasTexture(canvas);
    asciiTexture.minFilter = THREE2.NearestFilter;
    asciiTexture.magFilter = THREE2.NearestFilter;
    const uniforms = /* @__PURE__ */ new Map([
      ["uPixelSize", new THREE2.Uniform(pixelSize)],
      ["uAsciiTexture", new THREE2.Uniform(asciiTexture)],
      ["uCharCount", new THREE2.Uniform(new THREE2.Vector2(asciiChars.length, 1))],
      ["uBackgroundColor", new THREE2.Uniform(new THREE2.Vector4(...backgroundColor))],
      ["uMinLuma", new THREE2.Uniform(minLuma)],
      ["uMaxLuma", new THREE2.Uniform(maxLuma)]
    ]);
    super("ASCIIEffect", fragmentShader, { uniforms, blendFunction: BlendFunction.NORMAL });
  }
  update(_renderer, _inputBuffer, _deltaTime) {
  }
};
function SxASCII(props) {
  const { camera } = useThree();
  const asciiEffect = useMemo(() => new ASCIIEffectImpl(props), [props]);
  return /* @__PURE__ */ jsx4(
    "primitive",
    {
      object: new EffectPass(camera, asciiEffect),
      attachArray: "passes"
    }
  );
}

// src/components/SxDisplace.tsx
import { useThree as useThree2 } from "@react-three/fiber";
import { BlendFunction as BlendFunction2, Effect as Effect2, EffectPass as EffectPass2 } from "postprocessing";
import { useMemo as useMemo2, useRef as useRef2 } from "react";
import * as THREE3 from "three";
import { jsx as jsx5 } from "react/jsx-runtime";
var DisplaceEffectImpl = class extends Effect2 {
  elasticity = 10;
  constructor(mousePosition, subdivisions = 20, elasticity = 5) {
    const fragmentShader = `
      uniform vec2 uMousePosition;
      uniform vec2 uPrevMousePosition;
      uniform float uSubdivisionsX;
      uniform float uSubdivisionsY;

      void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
          vec2 gridUV = floor(uv * vec2(uSubdivisionsX, uSubdivisionsY)) / vec2(uSubdivisionsX, uSubdivisionsY);
          vec2 centerOfPixel = gridUV + vec2(1.0/uSubdivisionsX, 1.0/uSubdivisionsY);

          vec2 mouseDirection = uMousePosition - uPrevMousePosition;

          vec2 pixelToMouseDirection = centerOfPixel - uMousePosition;
          float pixelDistanceToMouse = length(pixelToMouseDirection);
          float strength = smoothstep(0.3, 0.0, pixelDistanceToMouse);

          vec2 uvOffset = strength * -mouseDirection * 0.3;
          vec2 xuv = uv - uvOffset;

          vec4 color = texture2D(inputBuffer, xuv);
          outputColor = color;
      }
    `;
    const uniforms = /* @__PURE__ */ new Map([
      ["uMousePosition", new THREE3.Uniform(new THREE3.Vector2(mousePosition.x, 1 - mousePosition.y))],
      ["uPrevMousePosition", new THREE3.Uniform(new THREE3.Vector2(0.5, 0.5))],
      ["uSubdivisionsX", new THREE3.Uniform(clamp(Array.isArray(subdivisions) ? subdivisions[0] : subdivisions, 1, 512))],
      ["uSubdivisionsY", new THREE3.Uniform(clamp(Array.isArray(subdivisions) ? subdivisions[1] : subdivisions, 1, 512))]
    ]);
    super("DisplaceEffect", fragmentShader, {
      uniforms,
      blendFunction: BlendFunction2.NORMAL
    });
    this.elasticity = elasticity;
  }
  update(_renderer, _inputBuffer, _deltaTime) {
    const prev = this.uniforms.get("uPrevMousePosition").value;
    const curr = this.uniforms.get("uMousePosition").value;
    const lerpFactor = 1 - Math.exp(-this.elasticity * _deltaTime);
    prev.lerp(curr, lerpFactor);
  }
};
function SxDisplace({ subdivisions, elasticity }) {
  const { camera } = useThree2();
  const { gl } = useThree2();
  const { mousePosition: globalMousePosition } = useShadex();
  const prevMouseRef = useRef2({ x: 0, y: 0 });
  const mousePosition = useMemo2(() => {
    const normalized = getNormalizedPosition(globalMousePosition, gl.domElement, prevMouseRef.current);
    prevMouseRef.current = normalized;
    return normalized;
  }, [gl, globalMousePosition]);
  const displaceEffectRef = useRef2(null);
  if (!displaceEffectRef.current) {
    displaceEffectRef.current = new DisplaceEffectImpl(mousePosition, subdivisions, elasticity);
  }
  const displaceEffect = displaceEffectRef.current;
  displaceEffect.uniforms.get("uMousePosition").value.set(mousePosition.x, 1 - mousePosition.y);
  displaceEffect.uniforms.get("uSubdivisionsX").value = clamp(subdivisions ? Array.isArray(subdivisions) ? subdivisions[0] : subdivisions : 20, 1, 512);
  displaceEffect.uniforms.get("uSubdivisionsY").value = clamp(subdivisions ? Array.isArray(subdivisions) ? subdivisions[1] : subdivisions : 20, 1, 512);
  displaceEffect.elasticity = elasticity !== void 0 ? elasticity : 10;
  return /* @__PURE__ */ jsx5(
    "primitive",
    {
      object: new EffectPass2(camera, displaceEffect),
      attachArray: "passes"
    }
  );
}

// src/components/SxEngrave.tsx
import { useThree as useThree3 } from "@react-three/fiber";
import { BlendFunction as BlendFunction3, Effect as Effect3, EffectPass as EffectPass3 } from "postprocessing";
import { useMemo as useMemo3 } from "react";
import * as THREE4 from "three";
import { jsx as jsx6 } from "react/jsx-runtime";
var EngraveEffectImpl = class extends Effect3 {
  constructor({
    amplitude = 0.03,
    frequency = 10,
    thickness = 0.2,
    brightness = 0.75,
    monochrome = true,
    backgroundColor = [0, 0, 0, 0]
  }) {
    const fragmentShader = `
      uniform float uAmplitude;
      uniform float uFrequency;
      uniform float uThickness;
      uniform float uBrightness;
      uniform bool uMonochrome;
      uniform vec4 uBackgroundColor;


      const int numPatterns = 6;

      void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {

        float divisor = 4.8 / resolution.y;
        float baseThickness = divisor * uThickness;

        vec3 patternData[numPatterns];
        patternData[0] = vec3(-0.7071, 0.7071, 3.0); // -45\xB0
        patternData[1] = vec3(0.0, 1.0, 0.6);        // 0\xB0
        patternData[2] = vec3(0.0, 1.0, 0.5);        // 0\xB0
        patternData[3] = vec3(1.0, 0.0, 0.4);        // 90\xB0
        patternData[4] = vec3(1.0, 0.0, 0.3);        // 90\xB0
        patternData[5] = vec3(0.0, 1.0, 0.2);        // 0\xB0

        vec4 color = texture2D(inputBuffer, vUv);
        float gray = 1.0;

        for (int i = 0; i < numPatterns; i++) {
          float cosine = patternData[i].x;
          float sine = patternData[i].y;

          // Rotate the pattern
          vec2 point = vec2(
            uv.x * cosine - uv.y * sine,
            uv.x * sine + uv.y * cosine
          );

          float lineThickness = baseThickness * float(i + 1);
          float dist = mod(point.y + lineThickness * 0.5 - sin(point.x * uFrequency) * uAmplitude, divisor);
          float brightnessFactor = dot(color.rgb, vec3(0.3, 0.4, 0.3));

          if (dist < lineThickness && brightnessFactor < uBrightness - 0.12 * float(i)) {
            // Smooth the edges
            float k = patternData[i].z;
            float x = (lineThickness - dist) / lineThickness;
            float smoothStep = abs((x - 0.5) / k) - (0.5 - k) / k;
            gray = min(smoothStep, gray);
          }
        }

        vec3 finalColor = mix(color.rgb, vec3(gray), 1.0 - step(uMonochrome?0.5:0.0, 0.5));
        if(finalColor == vec3(0.0))
            outputColor =  uBackgroundColor;
        else
            outputColor = vec4(finalColor * gray, 1.0);
      }
    `;
    const uniforms = /* @__PURE__ */ new Map([
      ["uAmplitude", new THREE4.Uniform(amplitude)],
      ["uFrequency", new THREE4.Uniform(frequency)],
      ["uThickness", new THREE4.Uniform(thickness)],
      ["uBrightness", new THREE4.Uniform(brightness)],
      ["uMonochrome", new THREE4.Uniform(monochrome)],
      ["uBackgroundColor", new THREE4.Uniform(new THREE4.Vector4(...backgroundColor))]
    ]);
    super("EngraveEffect", fragmentShader, {
      uniforms,
      blendFunction: BlendFunction3.NORMAL
    });
  }
  update(renderer) {
  }
};
function SxEngrave(props) {
  const { camera } = useThree3();
  const engraveEffect = useMemo3(() => new EngraveEffectImpl(props), [props]);
  return /* @__PURE__ */ jsx6(
    "primitive",
    {
      object: new EffectPass3(camera, engraveEffect),
      attachArray: "passes",
      ...null
    }
  );
}

// src/components/SxNotebook.tsx
import { useThree as useThree4 } from "@react-three/fiber";
import { BlendFunction as BlendFunction4, Effect as Effect4, EffectPass as EffectPass4 } from "postprocessing";
import { useMemo as useMemo4 } from "react";
import * as THREE5 from "three";
import { jsx as jsx7 } from "react/jsx-runtime";
var NotebookEffectImpl = class extends Effect4 {
  constructor({
    noiseStrength = 0.5,
    lineStrength = 1,
    vignetteStrength = 1,
    samplesCount = 10,
    anglesCount = 3,
    backgroundColor = [0, 0, 0, 0]
  }) {
    const fragmentShader = `
      uniform float uNoiseStrength;
      uniform float uLineStrength;
      uniform float uVignetteStrength;
      uniform int uSamplesCount;
      uniform int uAnglesCount;
      uniform vec4 uBackgroundColor;


      float rand(vec2 co) {
          return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
      }

      vec4 getCol(vec2 pos) {
          vec4 c1 = texture2D(inputBuffer, pos / resolution);
          float d = clamp(dot(c1.rgb, vec3(-0.5, 1.0, -0.5)), 0.0, 1.0);
          vec4 paperColor = vec4(0.7);
          return min(mix(c1, paperColor, 1.8 * d), 0.7);
      }

      float getVal(vec2 pos) {
          vec4 c = getCol(pos);
          return pow(dot(c.rgb, vec3(0.333)), 1.0);
      }

      vec2 getGrad(vec2 pos, float eps) {
          vec2 d = vec2(eps, 0);
          return vec2(
              getVal(pos + d.xy) - getVal(pos - d.xy),
              getVal(pos + d.yx) - getVal(pos - d.yx)
          ) / (2.0 * eps);
      }

      void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
          vec2 pos = vUv * resolution + 4.0 * sin(1.0 * vec2(1.0, 1.7)) * resolution.y / 400.0;

          vec3 col = vec3(0);
          vec3 col2 = vec3(0);
          float sum = 0.0;


          #pragma unroll
          for (int i = 0; i < uAnglesCount; i++) {
              float ang = PI2 / float(uAnglesCount) * (float(i) + 0.8);
              vec2 v = vec2(cos(ang), sin(ang));

              for (int j = 0; j < uSamplesCount; j++) {
                  vec2 dpos = v.yx * vec2(1, -1) * float(j) * resolution.y / 400.0;
                  vec2 dpos2 = v.xy * float(j * j) / float(uSamplesCount) * 0.5 * resolution.y / 400.0;

                  for (float s = -1.0; s <= 1.0; s += 2.0) {
                      vec2 pos2 = pos + s * dpos + dpos2;
                      vec2 pos3 = pos + (s * dpos + dpos2).yx * vec2(1, -1) * 2.0;

                      vec2 g = getGrad(pos2, 0.4);
                      float fact = dot(g, v) - 0.5 * abs(dot(g, v.yx * vec2(1, -1)));
                      float fact2 = abs(dot(normalize(g + vec2(0.0001)), v.yx * vec2(1, -1)));

                      fact = clamp(fact, 0.0, 0.05);
                      fact *= 1.0 - float(j) / float(uSamplesCount);

                      col += fact;
                      col2 += fact2 * getCol(pos3).rgb;
                      sum += fact2;
                  }
              }
          }

          col /= float(uSamplesCount * uAnglesCount) * 0.75 / sqrt(resolution.y);
          col2 /= sum;

          col.x *= uLineStrength * (0.6 + uNoiseStrength * rand(pos * 0.7));

          col.x = 1.0 - col.x;
          col.x *= col.x * col.x;

          vec2 dist = vUv - 0.5;
          float vignette = 1.0 - dot(dist, dist) * uVignetteStrength * 2.0;

          vec3 finalColor = col.x * col2 * vignette;

          if(finalColor == vec3(0.0)) outputColor = uBackgroundColor;
          else outputColor = vec4(finalColor, 1.0);
      }
    `;
    const uniforms = /* @__PURE__ */ new Map([
      ["uNoiseStrength", { value: noiseStrength }],
      ["uLineStrength", { value: lineStrength }],
      ["uVignetteStrength", { value: vignetteStrength }],
      ["uSamplesCount", { value: samplesCount }],
      ["uAnglesCount", { value: anglesCount }],
      ["uBackgroundColor", { value: new THREE5.Vector4(...backgroundColor) }]
    ]);
    super("NotebookEffect", fragmentShader, { uniforms, blendFunction: BlendFunction4.NORMAL });
  }
  update(_renderer, _inputBuffer, _deltaTime) {
  }
};
function SxNotebook(props) {
  const { camera } = useThree4();
  const notebookEffect = useMemo4(() => new NotebookEffectImpl(props), [props]);
  return /* @__PURE__ */ jsx7(
    "primitive",
    {
      object: new EffectPass4(camera, notebookEffect),
      attachArray: "passes"
    }
  );
}

// src/components/SxPixelate.tsx
import { useThree as useThree5 } from "@react-three/fiber";
import { BlendFunction as BlendFunction5, Effect as Effect5, EffectPass as EffectPass5 } from "postprocessing";
import { useMemo as useMemo5 } from "react";
import * as THREE6 from "three";
import { jsx as jsx8 } from "react/jsx-runtime";
var PixelateEffectImpl = class extends Effect5 {
  constructor({
    pixelSize = [5, 10],
    threshold = 0,
    backgroundColor = [0, 0, 0, 0],
    monochrome = false,
    monochromeColor = [1, 1, 1],
    contrast = 2
  }) {
    const fragmentShader = `
      uniform vec2 pixelSize;
      uniform float threshold;
      uniform vec4 backgroundColor;
      uniform bool monochrome;
      uniform vec3 monochromeColor;
      uniform float contrast;


      void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
          vec2 blockUV = pixelSize / resolution;
          vec2 snappedUV = blockUV * floor(uv / blockUV);
          vec4 color = texture2D(inputBuffer, snappedUV);

          float luma = dot(color.rgb, vec3(0.2126, 0.7152, 0.0722));
          float lineWidth = smoothstep(1.0, 0.0, pow(1.0 - luma, contrast));

          vec2 cellUV = fract(uv / blockUV);
          bool showBar = cellUV.y > 0.05 && cellUV.y < 0.95 && cellUV.x < lineWidth && luma > threshold;

          outputColor = showBar ? (monochrome ? vec4(monochromeColor * luma,1.0) : color) : backgroundColor;
      }
    `;
    const uniforms = /* @__PURE__ */ new Map([
      ["pixelSize", new THREE6.Uniform(new THREE6.Vector2(...pixelSize))],
      ["threshold", new THREE6.Uniform(threshold)],
      ["backgroundColor", new THREE6.Uniform(new THREE6.Vector4(...backgroundColor))],
      ["monochrome", new THREE6.Uniform(monochrome)],
      ["monochromeColor", new THREE6.Uniform(new THREE6.Vector3(...monochromeColor))],
      ["contrast", new THREE6.Uniform(contrast)]
    ]);
    super("PixelateEffect", fragmentShader, { uniforms, blendFunction: BlendFunction5.NORMAL });
  }
  update(_renderer, _inputBuffer, _deltaTime) {
  }
};
function SxPixelate(props) {
  const { camera } = useThree5();
  const pixelateEffect = useMemo5(() => new PixelateEffectImpl(props), [props]);
  return /* @__PURE__ */ jsx8(
    "primitive",
    {
      object: new EffectPass5(camera, pixelateEffect),
      attachArray: "passes"
    }
  );
}

// src/hooks/useIsClient.ts
import { useEffect as useEffect6, useState as useState5 } from "react";
function useIsClient() {
  const [isClient, setIsClient] = useState5(false);
  useEffect6(() => {
    setIsClient(true);
  }, []);
  return isClient;
}

// src/utils/ExtrudeSVG.tsx
import { useMemo as useMemo6 } from "react";
import { useLoader as useLoader2, useThree as useThree6 } from "@react-three/fiber";
import * as THREE7 from "three";
import { SVGLoader } from "three/examples/jsm/Addons.js";
import { jsx as jsx9 } from "react/jsx-runtime";
function ViExtrudeMesh({
  shapes,
  bevel = false,
  bevelThickness = 0.02,
  bevelSize = 0.02,
  bevelSegments = 2,
  scale = 1,
  color = "white",
  material,
  metalness = 0.2,
  roughness = 0.4,
  depth = 5
}) {
  const { viewport } = useThree6();
  const geometry = useMemo6(() => {
    const geom = new THREE7.ExtrudeGeometry(shapes, {
      depth: depth ?? viewport.width * 0.5,
      bevelEnabled: bevel,
      bevelThickness,
      bevelSize,
      bevelSegments
    });
    geom.center();
    const bbox = new THREE7.Box3().setFromBufferAttribute(
      geom.getAttribute("position")
    );
    const size = new THREE7.Vector3();
    bbox.getSize(size);
    const fitSize = 5;
    const normalizationScale = fitSize / Math.max(size.x, size.y);
    geom.scale(normalizationScale, normalizationScale, normalizationScale);
    geom.rotateX(Math.PI);
    return geom;
  }, [shapes, depth, bevel, bevelThickness, bevelSize, bevelSegments, viewport]);
  const finalMaterial = material || new THREE7.MeshStandardMaterial({ color, roughness, metalness, side: THREE7.DoubleSide });
  return /* @__PURE__ */ jsx9("mesh", { geometry, scale, children: /* @__PURE__ */ jsx9("primitive", { object: finalMaterial, attach: "material" }) });
}
function ExtrudeSVG(props) {
  const { src, ...rest } = props;
  const { paths } = useLoader2(SVGLoader, src);
  const shapes = useMemo6(() => {
    const allShapes = [];
    paths.forEach((path) => {
      const shape = SVGLoader.createShapes(path);
      allShapes.push(...shape);
    });
    return allShapes;
  }, [paths]);
  return /* @__PURE__ */ jsx9(ViExtrudeMesh, { shapes, ...rest });
}
export {
  ExtrudeSVG,
  ImagePlane,
  Shadex,
  ShadexProvider,
  SxASCII,
  SxDisplace,
  SxEngrave,
  SxNotebook,
  SxPixelate,
  VideoPlane,
  clamp,
  getNormalizedPosition,
  isSrcVideo,
  useElementSize,
  useIsClient,
  useShadex
};

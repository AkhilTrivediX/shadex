'use client'

import { useThree } from '@react-three/fiber';
import { wrapEffect } from '@react-three/postprocessing';
import { BlendFunction, Effect, EffectPass } from 'postprocessing';
import { useMemo } from 'react';
import * as THREE from 'three';

type effectOptions = {
  pixelSize?: number; // Size of ASCII grid cells
  asciiChars?: string; // Characters to use
  backgroundColor?: [number, number, number, number]; // RGBA background color
  minLuma?: number; // Minimum luminance threshold
  maxLuma?: number; // Maximum luminance threshold
};

/**
 * ASCII Effect
 * Adapted from "Post-Processing Shaders as a Creative Medium" by Maxime Heckel
 * Original: https://blog.maximeheckel.com/posts/post-processing-as-a-creative-medium
 */

class ASCIIEffectImpl extends Effect {
  constructor({
    pixelSize = 12.0,
    asciiChars = '.:-=+*#%@', // Default ASCII set
    backgroundColor = [0.0, 0.0, 0.0, 0.0], // Default transparent
    minLuma = 0.0,
    maxLuma = 1.0
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

    // Generate ASCII texture
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const charSize = 64;

    canvas.width = charSize * asciiChars.length;
    canvas.height = charSize;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = `${charSize}px monospace`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    asciiChars.split('').forEach((char, i) => {
      ctx.fillText(char, (i + 0.5) * charSize, charSize / 2);
    });

    const asciiTexture = new THREE.CanvasTexture(canvas);
    asciiTexture.minFilter = THREE.NearestFilter;
    asciiTexture.magFilter = THREE.NearestFilter;

    const uniforms = new Map<string, THREE.Uniform<any>>([
      ['uPixelSize', new THREE.Uniform(pixelSize)],
      ['uAsciiTexture', new THREE.Uniform(asciiTexture)],
      ['uCharCount', new THREE.Uniform(new THREE.Vector2(asciiChars.length, 1))],
      ['uBackgroundColor', new THREE.Uniform(new THREE.Vector4(...backgroundColor))],
      ['uMinLuma', new THREE.Uniform(minLuma)],
      ['uMaxLuma', new THREE.Uniform(maxLuma)],
    ]);

    super('ASCIIEffect', fragmentShader, { uniforms, blendFunction: BlendFunction.NORMAL });
  }

  update(_renderer: THREE.WebGLRenderer, _inputBuffer: any, _deltaTime: number) {
    // Dynamic updates can go here if needed
  }
}

export { ASCIIEffectImpl as SxASCIIEffectImpl };

export default function SxASCII(props: effectOptions) {
  const {camera} = useThree();
  const asciiEffect = useMemo(() => new ASCIIEffectImpl(props), [props]);
  return (
    <primitive
      object={new EffectPass(camera, asciiEffect)}
      attachArray="passes"
    />
  );
}


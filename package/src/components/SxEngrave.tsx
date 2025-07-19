'use client';

import { useThree } from '@react-three/fiber';
import { wrapEffect } from '@react-three/postprocessing';
import { BlendFunction, Effect, EffectPass } from 'postprocessing';
import { useMemo } from 'react';
import * as THREE from 'three';


type EngraveProps = {
  amplitude?: number;  // Wavy distortion strength
  frequency?: number;  // Frequency of the wave patterns
  thickness?: number;  // Base thickness of the engraving lines
  brightness?: number; // Brightness threshold for line intensity
  monochrome?: boolean;
  backgroundColor?: [number, number, number, number];
};

/**
 * Money Engrave Effect
 * Adapted from "Money filter" shader by Giacomo Preciado
 * Original: https://www.shadertoy.com/view/XlsXDN
 * License: CC BY-NC-SA 3.0
 */
class EngraveEffectImpl extends Effect {
  constructor({
    amplitude = 0.03,
    frequency = 10.0,
    thickness = 0.2,
    brightness = 0.75,
    monochrome = true,
    backgroundColor = [0.0, 0.0, 0.0, 0.0],
  }: EngraveProps) {
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
        patternData[0] = vec3(-0.7071, 0.7071, 3.0); // -45°
        patternData[1] = vec3(0.0, 1.0, 0.6);        // 0°
        patternData[2] = vec3(0.0, 1.0, 0.5);        // 0°
        patternData[3] = vec3(1.0, 0.0, 0.4);        // 90°
        patternData[4] = vec3(1.0, 0.0, 0.3);        // 90°
        patternData[5] = vec3(0.0, 1.0, 0.2);        // 0°

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

    const uniforms = new Map<string, THREE.Uniform<any>>([
        ['uAmplitude', new THREE.Uniform(amplitude)],
        ['uFrequency', new THREE.Uniform(frequency)],
        ['uThickness', new THREE.Uniform(thickness)],
        ['uBrightness', new THREE.Uniform(brightness)],
        ['uMonochrome', new THREE.Uniform(monochrome)],
        ['uBackgroundColor', new THREE.Uniform(new THREE.Vector4(...backgroundColor))],
        ]);

    super('EngraveEffect', fragmentShader, {
      uniforms,
      blendFunction: BlendFunction.NORMAL,
    });
  }

  update(renderer: THREE.WebGLRenderer) {
  }
}

export { EngraveEffectImpl as SxEngraveEffectImpl };

export default function SxEngrave(props: EngraveProps) {
  const { camera } = useThree();
  const engraveEffect = useMemo(() => new EngraveEffectImpl(props), [props]);

  return (
    <primitive
      object={new EffectPass(camera, engraveEffect)}
      attachArray="passes"
      {...(null as any)}
    />
  );
}

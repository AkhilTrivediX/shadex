'use client'
// created by florian berger (flockaroo) - 2016
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

import { useThree } from '@react-three/fiber';
import { wrapEffect } from '@react-three/postprocessing';
import { BlendFunction, Effect, EffectPass } from 'postprocessing';
import { useMemo } from 'react';
import * as THREE from 'three';


type effectOptions = {
  noiseStrength?: number;
  lineStrength?: number;
  vignetteStrength?: number;
  samplesCount?: number;
  anglesCount?: number;
  backgroundColor?: [number, number, number, number];
}

/**
 * Notebook Effect
 * Adapted from "notebook drawings" by florian berger (flockaroo)
 * Original: https://www.shadertoy.com/view/XtVGD1
 */

class NotebookEffectImpl extends Effect {
  constructor({
    noiseStrength = 0.5,
    lineStrength = 1.0,
    vignetteStrength = 1.0,
    samplesCount = 10,
    anglesCount = 3,
    backgroundColor = [0.0, 0.0, 0.0, 0.0]
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

const uniforms = new Map<string, THREE.IUniform>([
  ['uNoiseStrength', { value: noiseStrength}],
  ['uLineStrength', { value:lineStrength }],
  ['uVignetteStrength', { value: vignetteStrength}],
  ['uSamplesCount', { value: samplesCount }],
  ['uAnglesCount', { value: anglesCount }],
  ['uBackgroundColor', { value: new THREE.Vector4(...backgroundColor) }],
]);

    super('NotebookEffect', fragmentShader, { uniforms: uniforms as Map<string, THREE.Uniform<any>>, blendFunction: BlendFunction.NORMAL });
    //this.uniforms = uniforms;
  }

  update(_renderer: THREE.WebGLRenderer, _inputBuffer: any, _deltaTime: number) {
  }
}
export { NotebookEffectImpl as SxNotebookEffectImpl };

export default function SxNotebook(props: effectOptions) {
  const { camera } = useThree();
  const notebookEffect = useMemo(() => new NotebookEffectImpl(props), [props]);
  return (
    <primitive
      object={new EffectPass(camera, notebookEffect)}
      attachArray="passes"
    />
  );
}




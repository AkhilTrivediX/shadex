'use client'

import { useThree } from '@react-three/fiber';
import { wrapEffect } from '@react-three/postprocessing';
import { BlendFunction, Effect, EffectPass } from 'postprocessing';
import { useMemo } from 'react';
import * as THREE from 'three';

type effectOptions = {
    pixelSize?:[number, number],
    threshold?:number,
    backgroundColor?: [number, number, number, number],
    monochrome?:boolean, 
    monochromeColor?:[number, number, number]
    contrast?:number,
    dynamicPixelWidth?:boolean
}

 class PixelateEffectImpl extends Effect {
  constructor({
    pixelSize = [5, 10],
    threshold = 0.0,
    backgroundColor = [0.0, 0.0, 0.0, 0.0],
    monochrome = false,
    monochromeColor = [1.0, 1.0, 1.0],
    contrast = 2.0,
    dynamicPixelWidth = false
  }) {
    const fragmentShader = `
      uniform vec2 pixelSize;
      uniform float threshold;
      uniform vec4 backgroundColor;
      uniform bool monochrome;
      uniform vec3 monochromeColor;
      uniform float contrast;
      uniform bool dynamicPixelWidth;


      void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
          vec2 blockUV = pixelSize / resolution;
          vec2 snappedUV = blockUV * floor(uv / blockUV);
          vec4 color = texture2D(inputBuffer, snappedUV);

          float luma = dot(color.rgb, vec3(0.2126, 0.7152, 0.0722));
          float lineWidth = dynamicPixelWidth ? smoothstep(1.0, 0.0, pow(1.0 - luma, contrast)) : 1.0;

          vec2 cellUV = fract(uv / blockUV);
          bool showBar = cellUV.y > 0.05 && cellUV.y < 0.95 && cellUV.x < lineWidth && luma > threshold;

          outputColor = showBar ? (monochrome ? vec4(monochromeColor * luma,1.0) : color) : backgroundColor;
      }
    `;

    const uniforms = new Map<string, THREE.IUniform>([
      ['pixelSize', new THREE.Uniform(new THREE.Vector2(...pixelSize))],
      ['threshold', new THREE.Uniform(threshold)],
      ['backgroundColor', new THREE.Uniform(new THREE.Vector4(...backgroundColor))],
      ['monochrome', new THREE.Uniform(monochrome)],
      ['monochromeColor', new THREE.Uniform(new THREE.Vector3(...monochromeColor))],
      ['contrast', new THREE.Uniform(contrast)],
      ['dynamicPixelWidth', new THREE.Uniform(dynamicPixelWidth)],
    ]);

    super('PixelateEffect', fragmentShader, { uniforms: uniforms as Map<string, THREE.Uniform<any>>,blendFunction: BlendFunction.NORMAL });
    //this.uniforms = uniforms;
  }

  update(_renderer: THREE.WebGLRenderer, _inputBuffer: any, _deltaTime: number) {
  }
}
export { PixelateEffectImpl as SxPixelateEffectImpl };

export default function SxPixelate(props:effectOptions) {
  const {camera} = useThree();
  const asciiEffect = useMemo(() => new PixelateEffectImpl(props), [props]);
  return (
    <primitive
      object={new EffectPass(camera, asciiEffect)}
      attachArray="passes"
    />
  );
}




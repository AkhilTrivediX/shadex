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
      uniform vec2 uPixelSize;
      uniform float uThreshold;
      uniform vec4 uBackgroundColor;
      uniform bool uMonochrome;
      uniform vec3 uMonochromeColor;
      uniform float uContrast;
      uniform bool uDynamicPixelWidth;


      void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
          vec2 blockUV = uPixelSize / resolution;
          vec2 snappedUV = blockUV * floor(uv / blockUV);
          vec4 color = texture2D(inputBuffer, snappedUV);

          float luma = dot(color.rgb, vec3(0.2126, 0.7152, 0.0722));
          float lineWidth = uDynamicPixelWidth ? smoothstep(1.0, 0.0, pow(1.0 - luma, uContrast)) : 1.0;

          vec2 cellUV = fract(uv / blockUV);
          bool showBar = cellUV.y > 0.05 && cellUV.y < 0.95 && cellUV.x < lineWidth && luma > uThreshold;

          outputColor = showBar ? (uMonochrome ? vec4(uMonochromeColor * luma,1.0) : color) : uBackgroundColor;
      }
    `;

    const uniforms = new Map<string, THREE.IUniform>([
      ['uPixelSize', new THREE.Uniform(new THREE.Vector2(...pixelSize))],
      ['uThreshold', new THREE.Uniform(threshold)],
      ['uBackgroundColor', new THREE.Uniform(new THREE.Vector4(...backgroundColor))],
      ['uMonochrome', new THREE.Uniform(monochrome)],
      ['uMonochromeColor', new THREE.Uniform(new THREE.Vector3(...monochromeColor))],
      ['uContrast', new THREE.Uniform(contrast)],
      ['uDynamicPixelWidth', new THREE.Uniform(dynamicPixelWidth)],
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




'use client';

import { useThree } from '@react-three/fiber';
import { BlendFunction, Effect, EffectPass} from 'postprocessing';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useShadex } from '../hooks/ShadexContext'; 
import { getNormalizedPosition } from '../utils/utils';
import { clamp } from '../utils/utils';


type effectOptions = {
  subdivisions?: number | [number, number];
  elasticity?: number;
};

/**
 * Displace Effect
 * Inspired from Zajno Creatives Website
 * Original: https://zajno.com/
 */
class DisplaceEffectImpl extends Effect {
  elasticity = 10;
  constructor(mousePosition: { x: number; y: number }, subdivisions: number | [number, number] = 20, elasticity: number = 5) {
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

    const uniforms = new Map<string, THREE.IUniform>([
      ['uMousePosition', new THREE.Uniform(new THREE.Vector2(mousePosition.x, 1 - mousePosition.y))],
      ['uPrevMousePosition', new THREE.Uniform(new THREE.Vector2(0.5,0.5))],
      ['uSubdivisionsX', new THREE.Uniform(clamp(Array.isArray(subdivisions) ? subdivisions[0] : subdivisions, 1, 512))],
      ['uSubdivisionsY', new THREE.Uniform(clamp(Array.isArray(subdivisions) ? subdivisions[1] : subdivisions, 1, 512))],
    ]);

    super('DisplaceEffect', fragmentShader, {
      uniforms: uniforms as Map<string, THREE.Uniform<any>>,
      blendFunction: BlendFunction.NORMAL,
    });

    this.elasticity = elasticity
  }

  

  update(_renderer: THREE.WebGLRenderer, _inputBuffer: any, _deltaTime: number) {
    const prev = this.uniforms.get('uPrevMousePosition')!.value;
    const curr = this.uniforms.get('uMousePosition')!.value;

    const lerpFactor = 1.0 - Math.exp(-this.elasticity* _deltaTime);

    prev.lerp(curr, lerpFactor);
  }
}
export { DisplaceEffectImpl as SxDisplaceEffectImpl };

export default function SxDisplace({subdivisions, elasticity}: effectOptions) {
  const { camera } = useThree();
  const {gl} = useThree();
  const { mousePosition: globalMousePosition } = useShadex(); 
  const prevMouseRef = useRef({ x: 0, y: 0 });

  const mousePosition = useMemo(() => {
    const normalized = getNormalizedPosition(globalMousePosition, gl.domElement, prevMouseRef.current);
    prevMouseRef.current = normalized;
    return normalized
  }, [gl, globalMousePosition]);

  const displaceEffectRef = useRef<DisplaceEffectImpl>(null);

  if (!displaceEffectRef.current) {
  displaceEffectRef.current = new DisplaceEffectImpl(mousePosition, subdivisions, elasticity);
}
const displaceEffect = displaceEffectRef.current;

  displaceEffect.uniforms.get('uMousePosition')!.value.set(mousePosition.x, 1 - mousePosition.y);
  displaceEffect.uniforms.get('uSubdivisionsX')!.value = clamp(subdivisions?Array.isArray(subdivisions)?subdivisions[0]:subdivisions:20, 1, 512);
  displaceEffect.uniforms.get('uSubdivisionsY')!.value = clamp(subdivisions?Array.isArray(subdivisions)?subdivisions[1]:subdivisions:20, 1, 512);
  displaceEffect.elasticity = elasticity !== undefined ? elasticity : 10;

  

  return (
    <primitive
      object={new EffectPass(camera, displaceEffect)}
      attachArray="passes"
    />
  );
}

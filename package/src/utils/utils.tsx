'use client'

import { useLoader } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three'

export function ImagePlane({
  url,
  material,
  width,
  height,
  zoom
}: {
  url: string;
  material?: THREE.Material;
  width: number;
  height: number;
  zoom: number
}) {
  const texture = useLoader(THREE.TextureLoader, url);
  const planeWidth = width / zoom;
  const planeHeight = height / zoom;

  return (
    <mesh>
      <planeGeometry args={[planeWidth, planeHeight]} />
      {material ? (
        <primitive object={material} attach="material" />
      ) : (
        <meshBasicMaterial map={texture} toneMapped={false} side={THREE.DoubleSide}/>
      )}
    </mesh>
  );
}


import { useVideoTexture } from "@react-three/drei";

export function VideoPlane({
  url,
  width,
  height,
  zoom,
  unmuted,
  loop = true,
  autoplay = true,
}: {
  url: string;
  width: number;
  height: number;
  zoom: number;
  unmuted?: boolean;
  loop?: boolean;
  autoplay?: boolean;
}) {
  const texture = useVideoTexture(url, {
    muted: !unmuted,
    loop,
    start: autoplay,
    preload: "auto",
  });

  const planeWidth = width / zoom;
  const planeHeight = height / zoom;

  useEffect(()=>{
    texture.source.data.muted = !unmuted
    texture.source.data.play();
    return () => {
    texture.source.data.pause();
  };
  },[texture, unmuted])

  return (
    <mesh>
      <planeGeometry args={[planeWidth, planeHeight]} />
      <meshBasicMaterial
        map={texture}
        toneMapped={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}


export function isSrcVideo(src: string | undefined) {
  return src && /\.(mp4|webm|ogg)$/i.test(src);
}


export function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
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

  return [ref, size] as const;
}

export function getNormalizedPosition(position: {x: number, y: number}, container: HTMLElement, previousNormalizedPosition?: {x: number, y: number}) : {x: number, y: number} {
    const { left, top, bottom, right, width, height} = container.getBoundingClientRect();
    let x = position.x < left ? 0 : position.x > right ? width : position.x - left;
    x = x / width;
    let y = position.y < top ? 0 : position.y > bottom ? height : position.y - top;
    y = y / height;
    x = y == 0 || y == 1?-1:x;
    y = x == 0 || x == 1 ?-1:y;
    if(previousNormalizedPosition && previousNormalizedPosition.x === x && previousNormalizedPosition.y === y) return previousNormalizedPosition;
    return { x, y };
}

export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max));


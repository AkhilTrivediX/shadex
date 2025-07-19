"use client";
import { useMemo } from "react";
import { useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/Addons.js";

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
  depth=5,
}: {
  shapes: THREE.Shape[];
} & Omit<ViExtrudeProps, "src">) {
  const { viewport } = useThree();

  const geometry = useMemo(() => {
    const geom = new THREE.ExtrudeGeometry(shapes, {
      depth: depth ?? viewport.width * 0.5,
      bevelEnabled: bevel,
      bevelThickness,
      bevelSize,
      bevelSegments: bevelSegments,
    });

    geom.center();

    const bbox = new THREE.Box3().setFromBufferAttribute(
      geom.getAttribute("position")  as THREE.BufferAttribute
    );
    const size = new THREE.Vector3();
    bbox.getSize(size);

    const fitSize = 5;
    const normalizationScale = fitSize / Math.max(size.x, size.y);
    geom.scale(normalizationScale, normalizationScale, normalizationScale);

    geom.rotateX(Math.PI); // Flip Y-axis for SVG

    return geom;
  }, [shapes, depth, bevel, bevelThickness, bevelSize, bevelSegments, viewport]);

  const finalMaterial =
    material || new THREE.MeshStandardMaterial({ color, roughness, metalness, side: THREE.DoubleSide });

  return (
    <mesh geometry={geometry} scale={scale}>
      <primitive object={finalMaterial} attach="material" />
    </mesh>
  );
}

export default function ExtrudeSVG(props: ViExtrudeProps) {
  const { src, ...rest } = props;
  const { paths } = useLoader(SVGLoader, src);

  const shapes = useMemo(() => {
    const allShapes: THREE.Shape[] = [];
    paths.forEach((path) => {
      const shape = SVGLoader.createShapes(path);
      allShapes.push(...shape);
    });
    return allShapes;
  }, [paths]);

  return (
      <ViExtrudeMesh shapes={shapes} {...rest} />
  );
}

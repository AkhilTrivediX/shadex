'use client'
import { Canvas } from "@react-three/fiber";
import { ImagePlane, useElementSize } from "../utils/utils";
import { Html, OrbitControls, useProgress } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import { EffectComposer } from "@react-three/postprocessing";
import { ShadexProvider, useShadex } from "../hooks/ShadexContext";
import { useOutOfViewport } from "../hooks/useOutOfViewport";


export default function Shadex({src, width, height, children, controls, mesh, lightIntensity = 1.0, loader, pauseRender, playWhenHidden}:{src?:string, width:number | string, height:number | string, children?: React.JSX.Element | React.JSX.Element[], controls?:boolean, mesh?: React.ReactNode, lightIntensity?:number, loader?: React.ReactNode | ((progress: number) => React.ReactNode), pauseRender?: boolean, playWhenHidden?: boolean}) {
    if(!src && !mesh) throw new Error('src or mesh props are required for effect to be applied.')
    const [containerRef, { width: pxWidth, height: pxHeight }] = useElementSize<HTMLDivElement>();
    const zoom = 100;
    const is3DMode = !src;
    const shadexCtx = useShadex();
    const {progress: sceneProgress} = useProgress();
    const isOutOfViewport = useOutOfViewport(containerRef);
    const [readyToPause, setReadyToPause] = useState(false);
    if(!shadexCtx && process.env.NODE_ENV === 'development') {
        console.warn("We recommend wrapping children in ShadexProvider in root layout.tsx for better performance.")
    }

    useEffect(()=>{
        if(sceneProgress === 100) setReadyToPause(true)
    },[sceneProgress])

    const content = (<div className="Shadex" ref={containerRef} style={{width: (typeof width === 'string' ? width : `${width}px`), height: (typeof height === 'string' ? height : `${height}px`)}}>
                <Canvas orthographic={!is3DMode} camera={is3DMode ? { position: [0, 0, 5], fov: 75 } : { position: [0, 0, 5], zoom }} gl={{alpha: true}} style={{width:'100%', height:'100%'}} frameloop={(readyToPause && (pauseRender || (!playWhenHidden && isOutOfViewport)))?"never":"demand"}>
                    {controls && <OrbitControls enablePan={false} />}
                    <Suspense fallback={<Html center className="w-full h-full">
                        {!loader?<div>Loading... {sceneProgress}%</div>:typeof loader === 'function'?loader(sceneProgress):loader}
                    </Html>}>
                        <>
                            <ambientLight intensity={lightIntensity} />
                            <directionalLight position={[5, 10, 5]} intensity={1.5} />
                        </>
                        {src ? (
                        <ImagePlane url={src} width={pxWidth} height={pxHeight} zoom={zoom} />
                        ) : null}
                        {mesh}
                        {children && <EffectComposer>{children}</EffectComposer>}
                    </Suspense>
                </Canvas>
            </div>)

    if(shadexCtx) return content;
    else return (<ShadexProvider>{content}</ShadexProvider>)
}
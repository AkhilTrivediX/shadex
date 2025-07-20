'use client'
import { Canvas } from "@react-three/fiber";
import { ImagePlane, isSrcVideo, useElementSize, VideoPlane } from "../utils/utils";
import { Html, OrbitControls, useProgress } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import { EffectComposer } from "@react-three/postprocessing";
import { ShadexProvider, useShadex } from "../hooks/ShadexContext";
import { useOutOfViewport } from "../hooks/useOutOfViewport";


export default function Shadex({src,className, style,
                                children, controls, mesh,
                                lightIntensity = 1.0, loader, pauseRender,
                                playWhenHidden, videoOptions
                            }:{src?:string, className?:string, style?: React.CSSProperties,
                               children?: React.JSX.Element | React.JSX.Element[],
                               controls?:boolean, mesh?: React.ReactNode, lightIntensity?:number,
                               loader?: React.ReactNode | ((progress: number) => React.ReactNode),
                               pauseRender?: boolean, playWhenHidden?: boolean,
                               videoOptions?: {muted?: boolean, loop?: boolean, start?: boolean, preload?: string}}) {
    if(!src && !mesh) throw new Error('src or mesh props are required for effect to be applied.')
    const [containerRef, { width: pxWidth, height: pxHeight }] = useElementSize<HTMLDivElement>();
    const zoom = 100;
    const is3DMode = !src;
    const shadexCtx = useShadex();
    const {progress: sceneProgress} = useProgress();
    const isOutOfViewport = useOutOfViewport(containerRef);
    const [readyToPause, setReadyToPause] = useState(false);
    const [videoUnmuted, setVideoUnmuted] = useState(false);
    if(!shadexCtx && process.env.NODE_ENV === 'development') {
        console.warn("We recommend wrapping children in ShadexProvider in root layout.tsx for better performance.")
    }

    useEffect(()=>{
        if(sceneProgress === 100) setReadyToPause(true)
    },[sceneProgress])

    const content = (<div className={"Shadex "+className} style={style} ref={containerRef} onClick={()=>{
        if(isSrcVideo(src) && !videoUnmuted) {
            setVideoUnmuted(true);
        }
    }}>
                <Canvas orthographic={!is3DMode} camera={is3DMode ? { position: [0, 0, 5], fov: 75 } : { position: [0, 0, 5], zoom }} gl={{alpha: true}} style={{width:'100%', height:'100%'}} frameloop={(readyToPause && (pauseRender || (!playWhenHidden && isOutOfViewport)))?"never":isSrcVideo(src)?"always":"demand"}>
                    {controls && <OrbitControls enablePan={false}/>}
                    <Suspense fallback={<Html center className="w-full h-full">
                        {!loader?<div>Loading... {sceneProgress}%</div>:typeof loader === 'function'?loader(sceneProgress):loader}
                    </Html>}>
                        <>
                            <ambientLight intensity={lightIntensity} />
                            <directionalLight position={[5, 10, 5]} intensity={1.5} />
                        </>
                        {src ? (
                        !isSrcVideo(src)?<ImagePlane url={src} width={pxWidth} height={pxHeight} zoom={zoom}  />:
                        <VideoPlane url={src} width={pxWidth} height={pxHeight} zoom={zoom} unmuted={!videoOptions?.muted && videoUnmuted} loop={videoOptions?.loop} autoplay={videoOptions?.start}/>
                        ) : null}
                        {mesh}
                        {children && <EffectComposer>{children}</EffectComposer>}
                    </Suspense>
                </Canvas>
            </div>)

    if(shadexCtx) return content;
    else return (<ShadexProvider>{content}</ShadexProvider>)
}
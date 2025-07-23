'use client'
import { Canvas } from "@react-three/fiber";
import { ImagePlane, isSrcVideo, useElementSize, VideoPlane } from "../utils/utils";
import { OrbitControls, useProgress } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import { EffectComposer } from "@react-three/postprocessing";
import { ShadexProvider, useShadex } from "../hooks/ShadexContext";
import { useOutOfViewport } from "../hooks/useOutOfViewport";


export default function Shadex({src,className, style,
                                children, controls, mesh,
                                lightIntensity = 1.0, loader, pauseRender,
                                renderOnHidden, videoOptions
                            }:{src?:string, className?:string, style?: React.CSSProperties,
                               children?: React.JSX.Element | React.JSX.Element[],
                               controls?:boolean, mesh?: React.ReactNode, lightIntensity?:number,
                               loader?: React.ReactNode | ((progress: number) => React.ReactNode),
                               pauseRender?: boolean, renderOnHidden?: boolean,
                               videoOptions?: {muted?: boolean, loop?: boolean, start?: boolean, preload?: string}}) {
    if(!src && !mesh) throw new Error('src or mesh props are required for effect to be applied.')
    const [containerRef, { width: pxWidth, height: pxHeight }] = useElementSize<HTMLDivElement>();
    const [canvasReady, setCanvasReady] = useState(false);
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

    useEffect(()=>{
        if(isOutOfViewport) setCanvasReady(false);
    },[isOutOfViewport])

    const content = (<div className={"Shadex "+className} style={{...style, position: "relative"}} ref={containerRef} onClick={()=>{
        if(isSrcVideo(src) && !videoUnmuted) {
            setVideoUnmuted(true);
        }
    }}>
                {(isOutOfViewport || !canvasReady) && <div style={{
                    width: "100%", height: "100%", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                    justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column", gap: "10px", opacity: 0.5
                }}
                className="text-foreground fill-foreground"
                >
                    <div className="font-bold uppercase text-xl">Shadex</div>
                    <svg width={"50px"} height={"50px"} version="1.1" id="L9" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                    viewBox="0 0 100 100" enableBackground="new 0 0 0 0" xmlSpace="preserve">
                        <path d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
                        <animateTransform 
                            attributeName="transform" 
                            attributeType="XML" 
                            type="rotate"
                            dur="1s" 
                            from="0 50 50"
                            to="360 50 50" 
                            repeatCount="indefinite" />
                    </path>
                    </svg>
                    {sceneProgress!=100 && <p style={{fontSize: "20px", fontFamily: "monospace"}}>{sceneProgress}%</p>}
                </div>}
                {(renderOnHidden || !isOutOfViewport) && <Canvas orthographic={!is3DMode} camera={is3DMode ? { position: [0, 0, 5], fov: 75 } : { position: [0, 0, 5], zoom }} gl={{alpha: true}} style={{width:'100%', height:'100%'}} frameloop={(readyToPause && (pauseRender))?"never":isSrcVideo(src)?"always":"demand"} onCreated={({gl})=>{
                    requestAnimationFrame(()=>{setCanvasReady(true)})
                }}>
                    {controls && <OrbitControls enablePan={false}/>}
                    <Suspense fallback={null}>
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
                </Canvas>}
            </div>)

    if(shadexCtx) return content;
    else return (<ShadexProvider>{content}</ShadexProvider>)
}
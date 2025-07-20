"use client"

import ComponentPreview from "@/components/docTemplates/ComponentPreview"
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { IoImage, IoShapes, IoVideocam } from "react-icons/io5";
import { ExtrudeSVG, Shadex, SxPixelate } from "shadex"
import { motion } from "motion/react";

function Demo({pixelSize, src, mesh}:{pixelSize: [number, number], src?: string, mesh?: React.ReactNode}){
    return (
        <Shadex width={500} height={350} src={src} mesh={mesh} controls={!!mesh} videoOptions={{muted: true}}>
            <SxPixelate pixelSize={pixelSize}/>
        </Shadex>
    )
}

export default function BasicUsageExample(){

    const [pixelSize, setPixelSize] = useState<[number, number]>([5, 5]);
    const [mediaSource, setMediaSource] = useState<"image" | "video" | "mesh">("image");
    const media = {
        image: "cat.jpg",
        video: "cat_video.mp4",
        mesh: {element:<ExtrudeSVG src="/next.svg" depth={10}/> as React.ReactNode & {text:string}, text: `<ExtrudeSVG src="/next.svg" depth={10}/>`}
    }
    return <ComponentPreview codes={{
        "Demo.tsx": `import { Shadex, SxPixelate } from "shadex"
function BasicUsageDemo(){
    return (
        <Shadex width={500} height={350} ${mediaSource!=="mesh"?"src=\"/"+media[mediaSource]+"\"":"mesh={"+media.mesh.text+"}"} ${mediaSource=="mesh"?"controls":""}>
            <SxPixelate pixelSize={[${pixelSize.join(", ")}]}/>
        </Shadex> )
}`
    }}>
        <div className="flex flex-col gap-2 items-center">
            <div className="p-2"><Demo pixelSize={pixelSize} {...(mediaSource!=="mesh"?{src: "/"+media[mediaSource]}:{mesh: media.mesh.element})}/></div>
            <div className="flex wrap gap-4 items-center p-2 bg-muted/20 w-[80%] mb-2 rounded-md">
                <div className=" text-sm text-muted-foreground flex flex-col gap-1">
                    <div className="">Media</div>
                    <div className="flex gap-2">
                        <div className={`p-1 px-2 bg-muted/80 rounded-md cursor-pointer relative`} onClick={()=>setMediaSource("image")}>
                            {mediaSource=="image" && <motion.div layoutId="mediaIndicator" className="w-full h-full absolute bg-accent-foreground top-0 left-0 z-[1] rounded-md"/>}
                            <IoImage className={`z-[2] relative ${mediaSource=="image"?"text-accent":""}`}/>
                        </div>
                        <div className={`p-1 px-2 bg-muted/80 rounded-md cursor-pointer relative`} onClick={()=>setMediaSource("video")}>
                            {mediaSource=="video" && <motion.div layoutId="mediaIndicator" className="w-full h-full absolute bg-accent-foreground top-0 left-0 z-[1] rounded-md"/>}
                            <IoVideocam className={`z-[2] relative ${mediaSource=="video"?"text-accent":""}`}/>
                        </div>
                        <div className={`p-1 px-2 bg-muted/80 rounded-md cursor-pointer relative`} onClick={()=>setMediaSource("mesh")}>
                            {mediaSource=="mesh" && <motion.div layoutId="mediaIndicator" className="w-full h-full absolute bg-accent-foreground top-0 left-0 z-[1] rounded-md"/>}
                            <IoShapes className={`z-[2] relative ${mediaSource=="mesh"?"text-accent":""}`}/>
                        </div>
                    </div>
                </div>
                <div className="w-full text-sm text-muted-foreground flex flex-col gap-1">
                    <div className="">Pixel Size X</div>
                    <div className="flex gap-2">
                        <div className="p-1 px-2 bg-muted/80 rounded-md">{pixelSize[0]}</div>
                        <Slider min={1} max={100} step={1} value={[pixelSize[0]]} onValueChange={(value)=>setPixelSize([value[0], pixelSize[1]])}/>
                    </div>
                </div>
                <div className="w-full text-sm text-muted-foreground flex flex-col gap-1">
                    <div className="">Pixel Size Y</div>
                    <div className="flex gap-2">
                        <div className="p-1 px-2 bg-muted/80 rounded-md">{pixelSize[1]}</div>
                        <Slider min={1} max={100} step={1} value={[pixelSize[1]]} onValueChange={(value)=>setPixelSize([pixelSize[0], value[0]])}/>
                    </div>
                </div>
            </div>
        </div>
    </ComponentPreview>
}
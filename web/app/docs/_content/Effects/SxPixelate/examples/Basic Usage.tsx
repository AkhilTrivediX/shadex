import ComponentPreview from "@/components/docTemplates/ComponentPreview"
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { Shadex, SxPixelate } from "shadex"

function Demo({pixelSize}:{pixelSize: [number, number]}){
    return (
        <Shadex width={500} height={350} src="/cat.jpg">
            <SxPixelate pixelSize={pixelSize}/>
        </Shadex>
    )
}

export default function BasicUsageExample(){

    const [pixelSize, setPixelSize] = useState<[number, number]>([5, 5]);

    return <ComponentPreview codes={{
        "Demo.tsx": `import { Shadex, SxPixelate } from "shadex"
function BasicUsageDemo(){
    return (
        <Shadex width={500} height={350} src="/cat.jpg">
            <SxPixelate pixelSize={[${pixelSize.join(", ")}]}/>
        </Shadex> )
}`
    }}>
        <div className="">
            <div><Demo pixelSize={pixelSize}/></div>
            <div className="flex wrap gap-4 items-center p-2 bg-muted/20">
                <div className="w-[50%] text-sm text-muted-foreground flex flex-col gap-1">
                    <div className="">Pixel Count X</div>
                    <div className="flex gap-2">
                        <div className="p-1 px-2 bg-muted/80 rounded-md">{pixelSize[0]}</div>
                        <Slider min={1} max={100} step={1} value={[pixelSize[0]]} onValueChange={(value)=>setPixelSize([value[0], pixelSize[1]])}/>
                    </div>
                </div>
                <div className="w-[50%] text-sm text-muted-foreground flex flex-col gap-1">
                    <div className="">Pixel Count Y</div>
                    <div className="flex gap-2">
                        <div className="p-1 px-2 bg-muted/80 rounded-md">{pixelSize[1]}</div>
                        <Slider min={1} max={100} step={1} value={[pixelSize[1]]} onValueChange={(value)=>setPixelSize([pixelSize[0], value[0]])}/>
                    </div>
                </div>
            </div>
        </div>
    </ComponentPreview>
}
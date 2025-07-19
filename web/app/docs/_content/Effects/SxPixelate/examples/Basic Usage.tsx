import ComponentPreview from "@/components/docTemplates/ComponentPreview"
import { Shadex, SxPixelate } from "shadex"

function Demo(){
    return (
        <Shadex width={500} height={350} src="/cat.jpg">
            <SxPixelate />
        </Shadex>
    )
}

export default function BasicUsageExample(){
    return <ComponentPreview codes={{
        "Demo.tsx": `function BasicUsageDemo(){
    return (
        <Shadex width={500} height={350} src="/cat.jpg">
            <SxPixelate />
        </Shadex>
    )
}`
    }}><Demo /></ComponentPreview>
}
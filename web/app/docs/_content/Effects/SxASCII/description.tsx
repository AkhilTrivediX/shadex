import TopicDescription from "@/components/docTemplates/TopicDescription";
import Link from "next/link";
import BasicUsageExample from "./examples/Basic Usage";
import { CodeEditor } from "@/components/animate-ui/components/code-editor";
import PropsTable from "@/components/docTemplates/PropsTable";
import { propsData } from "./props";
import DocFooter from "@/components/docTemplates/DocFooter";
import DistancePixelationExample from "./examples/Distance Pixelation";
import ScrollPixelationDemo from "./examples/Scroll Pixelation";

export default function Description(){
    return <main className="">
        <TopicDescription>Converts your scene into dynamic ASCII art, recreating visuals using characters like @, #, and +.</TopicDescription>
        <p className="text-sm mt-2 mb-4 italic text-muted-foreground/80">Inspired by <Link target="_blank" href="https://blog.maximeheckel.com/posts/post-processing-as-a-creative-medium/" className="underline text-foreground">Maxime Heckel's Article</Link></p>
        <div className="w-[650px]">
            <BasicUsageExample/>
            <h2 className="text-2xl font-bold mt-6 mb-2">Usage</h2>
            <CodeEditor lang="js" header={false} writing={false} className="h-[max-content] w-full" copyButton>
                {`<Shadex {...}>
    <SxASCII/>
</Shadex>`}
            </CodeEditor>
            <h2 className="text-2xl font-bold mt-6 mb-2">Examples</h2>
            <h3 className="text-xl font-bold mb-1 text-muted-foreground">Scroll Pixelation</h3>
            <p className="text-sm text-muted-foreground/60 mb-2">Pixelation based on entry and exit of component from scene.</p>
            <ScrollPixelationDemo/>
            <h3 className="text-xl font-bold mb-1 text-muted-foreground">Distance Pixelation</h3>
            <p className="text-sm text-muted-foreground/60 mb-2">Pixelate the scene based on the distance of mouse from the scene.</p>
            <DistancePixelationExample/>
            
            <h2 className="text-2xl font-bold mt-6 mb-2">Props</h2>
            <PropsTable data={propsData}/>
        </div>
        
            <DocFooter/>
    </main>
}
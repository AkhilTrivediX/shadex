import TopicDescription from "@/components/docTemplates/TopicDescription";
import Link from "next/link";
import BasicUsageExample from "./examples/Basic Usage";

export default function Description(){
    return <main>
        <TopicDescription>Transforms your scene into a blocky, pixelated aesthetic inspired by retro displays and glitch art. Perfect for stylized visuals or creative transitions.</TopicDescription>
        <p className="text-sm mt-2 mb-4 italic text-muted-foreground/80">Inspired by <Link target="_blank" href="https://blog.maximeheckel.com/posts/post-processing-as-a-creative-medium/" className="underline text-foreground">Maxime Heckel's Article</Link></p>
        <BasicUsageExample/>
    </main>
}
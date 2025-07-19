"use client"
import { useDocRoute } from "@/hooks/DocRoute";
import { docsRegistry } from "@/utils/effectsRegistry";
import { AnimatePresence, motion } from "motion/react";
import {  useRouter } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
  const {currentTopic} = useDocRoute();
  return (
    <main className="flex flex-col p-4 font-sans text-sm w-sm border-e border-muted h-full">
      <AnimatePresence>
        {docsRegistry.map(category=><div className="my-2" key={category.name}>
          <div className="p-2 text-sm font-medium">{category.name}</div>
          {category.topics.map(topic=><SidebarLink key={topic.name} current={currentTopic==topic.name} text={topic.name} href={`/docs/${topic.name}`} />)}
        </div>)}
        {/* {effectsRegistry.map(effect=><SidebarLink key={effect.name} current={currentTopic==effect.name} text={effect.name} href={`/docs/${effect.name}`} />)} */}
      </AnimatePresence>
    </main>
  );
}

function SidebarLink({ text, href, current }: { text: string; href: string, current?: boolean }) {

  const [hovering, setHovering] = useState(false);
  const router = useRouter();
  return (
    <motion.button
      onClick={()=>router.push(href)}
      className={`flex items-center relative rounded-md p-2 text-start   w-full cursor-pointer ${current?"font-medium":"text-muted-foreground hover:text-accent-foreground/80"}`}
      key={text}
      onHoverStart={() => setHovering(true)}
      onHoverEnd={() => setHovering(false)}
    >
      {current && <motion.div layoutId="currentTopicIndicator" className="w-full h-full border-accent/70 border-2 bg-accent/70 absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-md"/>}
      {hovering && <motion.div layoutId="sidebarIndicator" className={`w-full h-full border-foreground/20 border-2 border-r-2  rounded-md absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 ${current?"":" bg-foreground/10"}`}/>}
      <span>{text}</span>
    </motion.button>
  );
}

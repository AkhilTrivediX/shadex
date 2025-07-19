"use client"

import { useDocRoute } from "@/hooks/DocRoute"
import { Topic } from "@/utils/effectsRegistry";
import { AnimatePresence, motion } from "motion/react";
import dynamic from "next/dynamic";
import {  ComponentType, useEffect, useState } from "react";

export default function Page(){
    const [count, setCount] = useState(0)
    const {currentTopic, previousTopic, pageDetails} = useDocRoute();
    return <main className="w-full px-6 py-8">
        <DocHeading current={currentTopic} previous={previousTopic}/>
        <DocTabs pageDetails={pageDetails}/>
    </main>
}

function DocHeading({current, previous}:{current: string, previous: string | null}){

    return <div className="relative text-4xl font-bold overflow-clip leading-none w-full mb-4">
                {previous && <motion.div key={"previous-"+previous} className="absolute top-0">{previous.split("").map((char, i)=><motion.span key={char+i} className="inline-block" initial={{y:0, opacity: 1}} animate={{y:-40, opacity: 0}} transition={{delay: 0.05+i*0.01}}>{char}</motion.span>)}</motion.div>}               
                <motion.div key={"current-"+current}>{current.split("").map((char, i)=><motion.span key={char+i} className="inline-block" initial={{y:40, opacity: 0}} animate={{y:0, opacity: 1}} transition={{ delay: 0.05+i*0.01, ease: "easeInOut"}}>{char}</motion.span>)}</motion.div>
            </div>
}

function DocTabs({pageDetails}:{pageDetails: Topic}){
    const [currentTab, setCurrentTab] = useState<number>(0);
    return(
        <main >
            {pageDetails.tabs && <div className="flex w-[max-content] mb-4 text-xs">
                    <button className={`h-6 px-2 cursor-pointer relative ${currentTab!=0?"opacity-60":""}`} onClick={()=>setCurrentTab(0)}>
                        {currentTab==0 && <motion.div layoutId="currentTabIndicator" className="w-full h-full bg-foreground/10 absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full"/>}
                        Overview
                    </button>
                    {pageDetails.tabs.map((tab, i)=><button key={tab.name} className={`h-6 px-2 relative cursor-pointer ${currentTab!=i+1?"opacity-60":""}`} onClick={()=>setCurrentTab(i+1)}>
                        {currentTab==i+1 && <motion.div layoutId="currentTabIndicator" className="w-full h-full bg-foreground/10 absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full"/>}
                        {tab.name}
                    </button>)}
                </div>}

            <div className="w-full relative">
                <AnimatePresence mode="wait">
                    {currentTab==0 && <motion.div key={"Overview"} className="[transform-origin:top_center]" initial={{y: 50, opacity: 0}} animate={{y: 0, opacity: 1}} exit={{y: 50, opacity: 0}} transition={{duration: 0.1}}><ComponentLoader loader={pageDetails.descriptionPath}/></motion.div>}
                    {pageDetails.tabs && pageDetails.tabs.map((tab, i)=>currentTab==i+1 && <motion.div key={"Tab"+i} className="[transform-origin:top_center]" initial={{y: 50, opacity: 0}} animate={{y: 0, opacity: 1}} exit={{y:50, opacity: 0}} transition={{duration: 0.1}}>
                        {tab.renders.map((render, j)=>(
                            <div className="" key={render.name+j}>
                                <div className="font-semibold text-xs opacity-60 mb-0.5">{render.name}</div>
                                <ComponentLoader key={render.name} loader={render.componentPath}/>
                            </div>
                        ))}
                    </motion.div>)}
                </AnimatePresence>

            </div>
        </main>
    )
}

function ComponentLoader({loader}:{loader:()=>Promise<{default: ComponentType}>}){

    const [Component, setComponent] = useState<ComponentType | null>(null);
    useEffect(()=>{
        const importDescription = async () => {
            try{
            if(!loader) return;
            console.log("Loader:", loader)
            const mod = await loader();
            setComponent(()=>mod.default);
            } catch(e){
                console.error("❌ Failed to load content for doc of this page.", e)
                setComponent(() => () => <p>Error loading content.</p>);
            }
        };
        importDescription();
    },[loader])
    return(
        <motion.main initial={{y: 40, opacity: 0}} animate={{y: 0, opacity: 1}}>
            {Component && <Component />}
        </motion.main>
    )
}
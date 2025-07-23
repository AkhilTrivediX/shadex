"use client"

import { useState } from "react";
import { CodeTabs } from "../animate-ui/components/code-tabs";
import {AnimatePresence, LayoutGroup, motion} from "motion/react"
import { CodeEditor } from "../animate-ui/components/code-editor";

export default function ComponentPreview({children, codes, title, lang="tsx", id}:{children: React.ReactNode, codes: string | {[key:string]:string}, title?: string, lang?: string, id:string}){
    const [currentTab, setCurrentTab] = useState(0);
    return <div className="flex flex-col gap-4 w-full h-full">
        <div >
            <LayoutGroup id={"tabSwitcher-"+id}>
                <button className={`h-8 px-3 cursor-pointer relative ${currentTab!=0?"opacity-60":""}`} onClick={()=>setCurrentTab(0)}>
                    {currentTab==0 && <motion.div layoutId="currentTabIndicator" className="w-full h-full bg-foreground/10 absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-md"/>}
                    Preview
                </button>
                <button className={`h-8 px-3 cursor-pointer relative ${currentTab==0?"opacity-60":""}`} onClick={()=>setCurrentTab(1)}>
                    {currentTab!=0 && <motion.div layoutId="currentTabIndicator" className="w-full h-full bg-foreground/10 absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-md"/>}
                    Code
                </button>
            </LayoutGroup>
        </div>
            <motion.div key="preview" style={{display: currentTab==0?"block":"none"}} initial={{y: -50, opacity: 0}} animate={{y: 0, opacity: 1}} exit={{y: -50, opacity: 0}} transition={{duration: 0.1}} className="rounded-lg border-2 border-muted flex items-center overflow-clip w-full h-full">{children}</motion.div>
            <motion.div key="code" className="h-full w-full" style={{display: currentTab==1?"block":"none"}} initial={{y: -50, opacity: 0}} animate={{y: 0, opacity: 1}} exit={{y: -50, opacity: 0}} transition={{duration: 0.1}}>
                {typeof codes != "string"?<CodeTabs lang="tsx" codes={codes} className="h-full w-full"/>:
                <CodeEditor writing={false} title={title} lang={lang} header={!!title} dots={false} copyButton className="h-full w-full">{codes}</CodeEditor>}
            </motion.div>
    </div>
}
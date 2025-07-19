"use client"

import { docsRegistry, Topic } from "@/utils/effectsRegistry";
import { usePathname } from "next/navigation"
import { createContext, useContext, useEffect, useState } from "react"

const DocRouteContext = createContext<{currentTopic: string, previousTopic: string | null, pageDetails: Topic}>({
    currentTopic: "",
    previousTopic: null,
    pageDetails: {name: '', descriptionPath: ''}
})

export default function DocRouteProvider({children}:{children: React.ReactNode}){
    const currentPath = usePathname()?.split("/").slice(-1)[0];
    const [current, setCurrent] = useState("");
    const [previous, setPrevious] = useState<string | null>(null);
    const [pageDetails, setPageDetails] = useState<Topic>({name: '', descriptionPath: ''});

    useEffect(()=>{
        if(currentPath!==current){
            const val = currentPath=="docs" ? "Installation" : currentPath;
            setPrevious(current);
            setCurrent(val);
            const details = docsRegistry.find(category=>category.topics.find(topic=>topic.name===val))?.topics.find(topic=>topic.name===val);
            if(details){
                setPageDetails(details);
            }
        }
    }, [currentPath])

    return <DocRouteContext.Provider value={{currentTopic: current, previousTopic: previous, pageDetails}}>
        {children}
    </DocRouteContext.Provider>;
}

export function useDocRoute(){
    return useContext(DocRouteContext);
}
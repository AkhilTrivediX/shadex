import { DocPropsType } from "@/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../animate-ui/components/tooltip";
import { MdInfoOutline, MdOutlineWarningAmber } from "react-icons/md";

export default function PropsTable({data}:{data: DocPropsType[]}){
    return <TooltipProvider openDelay={400}>
        <main className="w-full rounded-lg text-sm border border-muted">
            <div className="flex font-bold bg-muted/20">
                <div className="w-full px-4 py-2 border-r border-muted">Prop</div>
                <div className="w-full px-4 py-2 border-r border-muted">Type</div>
                <div className="w-full px-4 py-2">Default</div>
            </div>
            {data.map((prop, i)=>(
                <div className={`grid grid-cols-3 ${i!=0 && "border-t border-muted"}`} key={prop.name}>
                    <div className="w-full px-4 py-2 border-r border-muted flex gap-1 items-center">
                        <div className="px-2 py-1 bg-accent/60 text-accent-foreground w-[max-content] rounded-lg border border-muted font-mono text-xs">{prop.name}{prop.optional && "?"}</div>
                        <Tooltip>
                            <TooltipTrigger><MdInfoOutline className="cursor-pointer opacity-70"/></TooltipTrigger>
                            <TooltipContent>{prop.description}</TooltipContent>
                        </Tooltip>
                        {prop.note && <Tooltip>
                            <TooltipTrigger><MdOutlineWarningAmber className="cursor-pointer opacity-70"/></TooltipTrigger>
                            <TooltipContent>{prop.note}</TooltipContent>
                        </Tooltip>}
                    </div>
                    <div className="w-full px-4 py-2 border-r border-muted">
                        <div className="inline-block px-2 py-1 bg-accent/40 text-accent-foreground/80 rounded-lg border border-muted font-mono text-xs break-words">{prop.type}</div>
                    </div>
                    <div className="w-full px-4 py-2 border-r border-muted">
                        <div className="px-2 py-1 text-accent-foreground/80 font-mono text-xs">{prop.default || "-"}</div>
                    </div>
            </div>
            ))}
        </main>
    </TooltipProvider>
}
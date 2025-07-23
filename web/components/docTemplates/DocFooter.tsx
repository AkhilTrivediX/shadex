import Link from "next/link";

export default function DocFooter(){
    return (<div className="mt-4 p-4 pb-0 opacity-70 text-right text-xs border-t border-muted">Made by <Link className="font-bold text-accent-foreground underline" href="https://github.com/AkhilTrivediX" target="_blank">Akhil Trivedi</Link></div>)
}
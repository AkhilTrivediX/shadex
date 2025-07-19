import Link from "next/link";
import { GitHubStarsButton } from "./animate-ui/buttons/github-stars";

export default function Navbar(){
    return (
        <header className="sticky top-0 z-[50] w-full border-b border-muted">
            {/* Desktop Navbar */}
                <div className="mx-auto flex h-16 max-w-[88rem] items-center px-8 justify-between">
                    <div className="text-2xl font-black">Shadex</div>
                    <div className="items-center hidden lg:flex">
                        <nav className="flex items-center gap-2">
                            <Link href={"/docs"}>Docs</Link>
                            <GitHubStarsButton username="AkhilTrivediX" repo="shadex"/>
                        </nav>
                    </div>
                </div>
        </header>
    )
}
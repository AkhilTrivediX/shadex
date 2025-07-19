import Sidebar from "@/components/Sidebar";
import DocRouteProvider from "@/hooks/DocRoute";

export default async function Layout({children}:{children:React.ReactNode}){

    
    return (
        <DocRouteProvider>
            <main className="flex h-full">
                <Sidebar key="Sidebar"/>
                {children}
            </main>
        </DocRouteProvider>
    )
}
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import "@fontsource/bodoni-moda"
import { Key, LogIn } from "lucide-react"
export default function NavBar(){
    return(
        <header className="sticky top-0 z-50 flex flex-row p-2 pr-3 justify-between  backdrop-filter bg-opacity-10 backdrop-blur-md">
            <Link className="flex flex-row items-center" to="/"> 
                <svg width="40" height="40" viewBox="0 0 48 48" className="ml-3">
                    <g
                    fill="none"
                    stroke="currentColor"
                    stroke-width="4"
                    stroke-linecap="round"
                    >
                    <path
                        d="M18 23.937V10a6 6 0 0 1 12 0v2.006m0 11.997V38a6 6 0 0 1-12 0v-2.03"
                    ></path>
                    <path
                        d="M24 30H9.984C6.68 30 4 27.314 4 24s2.68-6 5.984-6h2.005M24 18h13.989A6.006 6.006 0 0 1 44 24c0 3.314-2.691 6-6.011 6h-1.923"
                    ></path>
                    </g>
                </svg>
                <div className="ml-4 text-lg font-bold font-mono">CiteGeist</div>
            </Link>
            <div className="flex flex-row space-x-5 flex-wrap">
                <Button variant="ghost" className="size-min" asChild><Link to="/signup"><Key></Key>Sign up</Link></Button>
                <Button className="size-min" asChild><Link to="/login"><LogIn></LogIn>Log in</Link></Button>
            </div>
        </header>
    )
}
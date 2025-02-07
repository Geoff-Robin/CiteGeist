import { LoginForm } from "@/components/login-form"
import NavBar from "@/components/NavBar"

export default function Login() {
    return (
        <>
            <NavBar />
            <div className="text-foreground bg-background border-secondary">
                <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-900 p-6 md:p-10">
                    <div className="w-full max-w-sm md:max-w-3xl">
                        <LoginForm />
                    </div>
                </div>
            </div>
        </>
    )
}

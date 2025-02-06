import { SignInForm } from "@/components/sign-in"
import NavBar from "@/components/NavBar"

export default function SignUp() {
  return (
    <>
    <NavBar/>
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10 bg-background text-foreground">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignInForm/>
          </div>
        </div>
      </div>
      <div className="relative hidden lg:block">
        <img
          src="https://cdn.resfu.com/media/img_news/wolfsburg-s-van-de-ven-joins-tottenham--screenshot-tottenhamhotspur-com.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.6] dark:grayscale"
        />
      </div>
    </div>
    </>
  )
}

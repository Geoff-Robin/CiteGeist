import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import React, { useState, useContext } from 'react'
import { useNavigate } from "react-router-dom"
import { axiosInstance } from "@/axios"
import { AuthContext } from "@/store/auth-context"

export function LoginForm({ className, ...props }) {
  const navigate = useNavigate()
  const [email_username, setID] = useState("")
  const [password, setPass] = useState("")
  const [showAlertUE, setShowAlertUE] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { setAccessToken, setRefreshToken } = useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await axiosInstance.post('login', {
        email_username,
        password
      })
      setAccessToken(response?.data?.access)
      setRefreshToken(response?.data?.refresh)
      setPass("")
      setID("")
      setShowAlertUE(false)
      navigate('/home')
    } catch (error) {
      console.error(error)
      setShowAlertUE(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6 bg-background text-foreground mt-6", className)} {...props}>
      <Card className="overflow-hidden border-secondary">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Login Form */}
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your CiteGeist account
                </p>
              </div>

              {showAlertUE && (
                <div className="mt-4 px-4 py-2 text-sm text-white bg-red-500 rounded">
                  Username/Email or password is incorrect
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="email_username">Email/Username</Label>
                <Input 
                  id="email_username" 
                  type="text" 
                  placeholder="m@example.com" 
                  value={email_username}
                  onChange={e => setID(e.target.value)} 
                  required 
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <button 
                    type="button"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                    onClick={() => alert("Forgot password flow here")}
                  >
                    Forgot your password?
                  </button>
                </div>
                <Input 
                  id="password" 
                  type="password"
                  value={password}
                  onChange={e => setPass(e.target.value)} 
                  required 
                />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Login"
                )}
              </Button>

              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="/signup" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </div>
          </form>

          {/* Side Image */}
          <div className="relative hidden bg-muted md:block">
            <img
              src="https://i.guim.co.uk/img/media/f364a68ccfd6181285044fd486966d66ce2a43bc/0_124_3216_1930/master/3216.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=1cf12135a14d620a549e1020ddadb03b"
              alt="Login Visual"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.9] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React,{useState,useContext} from "react"
import { useNavigate } from "react-router-dom"
import {AuthContext} from "@/store/auth-context"
import { axiosInstance } from "@/axios"
export function SignInForm({
  className,
  ...props
}){
  const navigate = useNavigate()
  const [alert,showAlert]=useState(false)
  const [username,setUsername]=useState("")
  const [email,setEmail]=useState("")
  const[password,setPass]=useState("")
  const[interests,setInt]=useState("")
  const {setAccessToken,setRefreshToken}=useContext(AuthContext)
  const handleSubmit=async(e)=>{
    e.preventDefault();
    try{
      response=await axiosInstance.post('register',{
        email,
        username,
        password,
        interests
      })
      setAccessToken(response?.data?.access)
      setRefreshToken(response?.data?.refresh)
      showAlert(false)
      setPass()
      setInt()
      setEmail()
      setUsername()
      navigate('/home')
    }
    catch(error){
      showAlert(true)
    }
  }
  return (
    (<form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmit}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Sign up to get your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your details below to sign up
        </p>
      </div>
      {alert && (
            <div className="mt-4 px-4 py-2 text-sm text-white bg-red-500 rounded">
              Something went wrong
            </div>
          )}
      <div className="grid gap-6">
      <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" type="text" onChangeCapture={e=>setUsername(e.currentTarget.value)} required/>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="email@example.com"  onChangeCapture={e=>setEmail(e.currentTarget.value)} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" onChangeCapture={e=>setPass(e.currentTarget.value)} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="interests">Enter Your Research Interests</Label>
          <Input
              id="interests"
              type="text"
              placeholder="E.g., Machine Learning, Quantum Physics"
              onChangeCapture={e=>setInt(e.currentTarget.value)}
              required
            />
      </div>
        <Button type="submit" className="w-full">
          Sign up
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <a href="/login" className="underline underline-offset-4">
          Log In
        </a>
      </div>
    </form>)
  );
}
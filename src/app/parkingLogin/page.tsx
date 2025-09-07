"use client"

import type React from "react"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, Zap, Star } from "lucide-react"
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast"


// import "../../../Components/ArtClub/home"


export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false)
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })


  const router = useRouter();


  const GotoDashBoard = () => {
   
  }


  const postData = () => {


        //sending data to server
        fetch("http://127.0.0.1:8000/api/parking-login/", {
            method: "POST",
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: formData.username,
                password: formData.password,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    // notifyA(data.error);
                    // toast.error('Signup failed!');
                    alert("Invalid Credentials!")
                } else {
                    // notifyB("Signed In successfullly");
                    toast
                    // alert('Signup success!');
                    console.log(data);
                    const parkingId = data.parking_id;
                    localStorage.setItem("parking_id", parkingId);
                    router.push(`/parkingRegister?parking_id=${parkingId}`);
                }

                console.log(data);
            });
    };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-orange-300 via-white-500 to-green-300">

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <Card className="backdrop-blur-sm bg-white/95 shadow-2xl border-0">
            <CardHeader className="space-y-1 text-center pb-8">
              <CardTitle className="text-2xl font-bold text-red-900">PARK-EYE</CardTitle>
              <CardDescription className="text-gray-600">Sign in to control room account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Username
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="username"
                      type="username"
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="pl-10 h-12 border-gray-200 focus:border-red-500 focus:ring-red-500"
                      required
                    />
                  </div>
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {/* <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Forgot password?
                  </Link> */}

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                    onClick={() => {postData()}}
                    > 
                    Login
                  </Button>

                  {/* <p className="text-sm text-gray-600">
                    {"Don't have an account? "}
                    <span onClick={() => {handleClick1()}} style={{cursor : "pointer"}} className="text-blue-600 hover:text-blue-700 font-medium">
                      login
                    </span>
                  </p> */}
              </form>
            </CardContent>
          </Card>
      </div>
    </div>
  )
}

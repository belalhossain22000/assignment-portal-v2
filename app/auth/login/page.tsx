"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, Mail, Lock, ArrowRight, Sparkles, User, GraduationCap } from "lucide-react"
import { useUser } from "@/lib/user-context"
import { useDispatch } from "react-redux"
import { setUser } from "@/redux/features/authSlice"
import { useLoginMutation } from "@/redux/api/authApi"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, isLoading } = useUser()
  const router = useRouter()
  const dispatch = useDispatch()
  const [loginFn,{isLoading: loginLoading}] = useLoginMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const res = await loginFn({ email, password }).unwrap()

      if (res.success) {
        dispatch(setUser({ token: res?.data?.token }))
        login(res.data.user)
        router.push("/")
      } else {
        setError(res?.error || "Login failed. Please try again.")
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.")
    }
  }

  // const handleDemoLogin = async (userType: "INSTRUCTOR" | "STUDENT") => {
  //   const demoEmail = userType === "INSTRUCTOR" ? "sarah.johnson@university.edu" : "alex.chen@student.edu"

  //   setEmail(demoEmail)
  //   setError("")

  //   try {
  //     const result = await login(demoEmail, "demo")
  //     if (result.success) {
  //       router.push("/")
  //     } else {
  //       setError(result.error || "Demo login failed.")
  //     }
  //   } catch (err: any) {
  //     setError(err.message || "Demo login failed.")
  //   }
  // }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-600 to-blue-600 shadow-lg shadow-green-500/25">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-blue-100 text-green-700 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Welcome to Assignment Portal
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-2">
            Sign In
          </h1>
          <p className="text-gray-600">Access your assignment portal</p>
        </div>

        {/* Demo Login Buttons */}
        {/* <div className="mb-6 space-y-3">
          <p className="text-sm text-center text-gray-600 mb-3">Quick Demo Access:</p>
          <div className="grid grid-cols-2 gap-3">
            <Button
              // onClick={() => handleDemoLogin("INSTRUCTOR")}
              variant="outline"
              className="flex items-center justify-center space-x-2 bg-white/60 backdrop-blur-sm border-blue-200 hover:bg-blue-50"
              disabled={isLoading}
            >
              <GraduationCap className="h-4 w-4" />
              <span>Instructor</span>
            </Button>
            <Button
              // onClick={() => handleDemoLogin("STUDENT")}
              variant="outline"
              className="flex items-center justify-center space-x-2 bg-white/60 backdrop-blur-sm border-green-200 hover:bg-green-50"
              disabled={isLoading}
            >
              <User className="h-4 w-4" />
              <span>Student</span>
            </Button>
          </div>
        </div> */}

        {/* Divider */}
        {/* <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-2 text-gray-500">
              Or continue with email
            </span>
          </div>
        </div> */}

        {/* Login Form */}
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-bold text-gray-900">Login to Your Account</CardTitle>
            <CardDescription>Enter your credentials to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                  className="h-12 bg-white/60 backdrop-blur-sm border-white/20 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center text-sm font-medium text-gray-700">
                  <Lock className="w-4 h-4 mr-2" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                  className="h-12 bg-white/60 backdrop-blur-sm border-white/20 focus:bg-white transition-all"
                />
              </div>

              {error && (
                <Alert variant="destructive" className="bg-red-50 border-red-200">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg shadow-green-500/25 text-white font-semibold"
                disabled={isLoading || loginLoading}
              >
                {isLoading || loginLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/auth/register" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                  Sign Up
                </Link>
              </p>
            </div>
            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</p>
              <div className="text-xs text-gray-600 space-y-1">
                <p>
                  <strong>Instructor:</strong> instructor-1@gmail.com
                </p>
                <p>
                  <strong>Student:</strong> user@gmail4.com
                </p>
                <p className="text-gray-500"> password: 12345678</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

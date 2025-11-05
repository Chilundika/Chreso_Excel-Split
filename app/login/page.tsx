"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      router.push("/dashboard")
    } catch (error: unknown) {
      console.error("[v0] Login error:", error)
      setError(error instanceof Error ? error.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F8FAFC] p-6">
      <div className="w-full max-w-md">
        <Card className="border-[#E2E8F0]">
          <CardHeader className="space-y-1">
            <div className="mb-2 flex justify-center">
              <Image src="/assets/Excel Split Logo.ico" alt="Chreso Excel-Split" width={64} height={64} />
            </div>
            <CardTitle className="text-2xl font-extrabold text-[#61CE70]">Welcome to Chreso Excel-Split</CardTitle>
            <CardDescription className="text-black">Login to Chreso Excel-Split</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#334155]">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-[#CBD5E1]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#334155]">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-[#CBD5E1] pr-10"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-2 my-auto inline-flex h-6 w-6 items-center justify-center text-[#64748B] hover:text-[#334155]"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}

              <Button type="submit" className="w-full !bg-[#61CE70] hover:!bg-[#4FB85F] !text-white" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>

              <div className="text-center text-sm text-black">
                Don't have an account?{" "}
                <Link href="/register" className="font-medium text-[#61CE70] hover:underline">
                  Register
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

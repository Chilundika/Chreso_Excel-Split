"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { validateCuId, validatePassword, hashPassword } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

export default function RegisterPage() {
  const [cuId, setCuId] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validate CU ID
    if (!validateCuId(cuId)) {
      setError("CU ID must match format: CU followed by 3-8 digits (e.g., CU12345)")
      setIsLoading(false)
      return
    }

    // Validate password
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      setError(passwordValidation.message!)
      setIsLoading(false)
      return
    }

    // Check password match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()

      // First, create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            cu_id: cuId,
          },
        },
      })

      if (authError) throw authError

      if (authData.user) {
        // Hash password for our custom users table
        const passwordHash = await hashPassword(password)

        // Store user data in our custom users table
        const { error: dbError } = await supabase.from("users").insert({
          id: authData.user.id,
          cu_id: cuId,
          email,
          password_hash: passwordHash,
        })

        if (dbError) throw dbError

        // Check if email confirmation is required
        if (authData.session) {
          // User is automatically logged in
          router.push("/dashboard")
        } else {
          // Email confirmation required
          router.push("/register-success")
        }
      }
    } catch (error: unknown) {
      console.error("[v0] Registration error:", error)
      setError(error instanceof Error ? error.message : "Registration failed")
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
            <CardTitle className="text-2xl font-bold text-[#61CE70]">Create Account</CardTitle>
            <CardDescription className="text-black">Register for Chreso Excel-Split</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cuId" className="text-[#334155]">
                  Enter your CU Staff ID
                </Label>
                <Input
                  id="cuId"
                  type="text"
                  placeholder="CU12345"
                  required
                  value={cuId}
                  onChange={(e) => setCuId(e.target.value)}
                  className="border-[#CBD5E1] text-black caret-black placeholder:text-gray-400"
                />
                <p className="text-xs text-[#64748B]">Format: CU followed by 3-8 digits</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#334155]">
                  Email Address (Gmail only)
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-[#CBD5E1] text-black caret-black placeholder:text-gray-400"
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
                    className="border-[#CBD5E1] text-black caret-black placeholder:text-gray-400"
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
                <p className="text-xs text-[#64748B]">5-8 characters with uppercase, lowercase, and numbers</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[#334155]">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border-[#CBD5E1] text-black caret-black placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute inset-y-0 right-2 my-auto inline-flex h-6 w-6 items-center justify-center text-[#64748B] hover:text-[#334155]"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}

              <Button type="submit" className="w-full !bg-[#61CE70] hover:!bg-[#4FB85F] !text-white" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Register"}
              </Button>

              <div className="text-center text-sm text-black">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-[#61CE70] hover:underline">
                  Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

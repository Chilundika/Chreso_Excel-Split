import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function RegisterSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F8FAFC] p-6">
      <div className="w-full max-w-md">
        <Card className="border-[#E2E8F0]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-[#0047AB]">Check Your Email</CardTitle>
            <CardDescription className="text-[#64748B]">Verify your account to continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-[#334155]">
              We've sent you a confirmation email. Please check your inbox and click the verification link to activate
              your account.
            </p>
            <Button asChild className="w-full">
              <Link href="/login">Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

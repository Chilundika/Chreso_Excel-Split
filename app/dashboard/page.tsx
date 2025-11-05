import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import DashboardClient from "@/components/dashboard-client"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/login")
  }

  // Fetch user's CU ID from our custom users table
  const { data: userData } = await supabase.from("users").select("cu_id").eq("id", data.user.id).single()

  return <DashboardClient cuId={userData?.cu_id || "Unknown"} />
}

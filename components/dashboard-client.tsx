"use client"

import React, { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { Upload, Download, LogOut, FileSpreadsheet } from "lucide-react"
import Image from "next/image"
// Processing handled server-side

interface DashboardClientProps {
  cuId: string
}

export default function DashboardClient({ cuId }: DashboardClientProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (
        selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        selectedFile.type === "application/vnd.ms-excel"
      ) {
        setFile(selectedFile)
        setError(null)
        setDownloadUrl(null)
      } else {
        setError("Please upload a valid Excel file (.xlsx or .xls)")
        setFile(null)
      }
    }
  }

  const processExcelFile = async () => {
    if (!file) return

    setIsProcessing(true)
    setError(null)
    setDownloadUrl(null)

    try {
      const form = new FormData()
      form.append("file", file)
      const res = await fetch("/api/process-excel", {
        method: "POST",
        body: form,
      })
      if (!res.ok) {
        const msg = await res.json().catch(() => ({}))
        throw new Error(msg?.error || "Failed to process file")
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      setDownloadUrl(url)
    } catch (error: unknown) {
      console.error("[v0] Excel processing error:", error)
      setError(error instanceof Error ? error.message : "Failed to process Excel file")
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadProcessedFile = () => {
    if (!downloadUrl) return
    const a = document.createElement("a")
    a.href = downloadUrl
    const base = file?.name.replace(/\.[^/.]+$/, "") || "processed"
    a.download = `${base}_cleaned.xlsx`
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Image src="/assets/Excel Split Logo.ico" alt="Chreso Excel-Split" width={32} height={32} />
            <h1 className="text-2xl font-bold text-[#61CE70]">Chreso Excel-Split</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-[#64748B]">Logged in as</p>
              <p className="font-semibold text-[#0047AB]">{cuId}</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#61CE70]">Process Excel File</CardTitle>
            <CardDescription className="text-black">
              Upload an Excel file to split the "Student" column into "Name" and "Student Number"
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="file" className="font-bold text-black">
                Select Excel File
              </Label>
              <div className="flex items-center gap-4">
                <Input
                  id="file"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="text-black file:text-black"
                />
                {file && (
                  <Button
                    onClick={processExcelFile}
                    disabled={isProcessing}
                    variant="default"
                    className="!bg-[#61CE70] hover:!bg-[#4FB85F] !text-white !border-transparent"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {isProcessing ? "Processing..." : "Process"}
                  </Button>
                )}
              </div>
              {file && <p className="text-sm text-muted-foreground">Selected: {file.name}</p>}
            </div>

            {/* Error Message */}
            {error && <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}

            {/* Success Message and Download */}
            {downloadUrl && (
              <div className="space-y-4 rounded-md border border-primary/30 bg-primary/5 p-4">
                <div className="flex items-center gap-2 text-black">
                  <FileSpreadsheet className="h-5 w-5" />
                  <p className="font-medium text-black">File processed successfully!</p>
                </div>
                <p className="text-sm text-black">
                  The "Student" column has been split into "Name" and "Student Number". Click below to download the
                  cleaned file.
                </p>
                <Button onClick={downloadProcessedFile}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Cleaned File
                </Button>
              </div>
            )}

            {/* Instructions */}
            <div className="rounded-md bg-muted p-4">
              <h3 className="mb-2 font-semibold text-foreground">How it works:</h3>
              <ol className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
                <li>Upload an Excel file containing a "Student" column</li>
                <li>The column should contain data like "John Doe 12345"</li>
                <li>Click "Process" to split the data</li>
                <li>Download the cleaned file with separate columns</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

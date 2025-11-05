import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Excel-Adjust - Process Excel Files",
  description: "Upload and process Excel files with ease",
  icons: {
    icon: "/assets/Excel Split Logo.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          {children}
          <footer className="mt-12 border-t border-border bg-card">
            <div className="mx-auto max-w-7xl px-6 py-6 text-center text-sm text-muted-foreground">
              Developed by DeZignBlu-Print ZM (Chipo Chilundika)
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}

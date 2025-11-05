"use client"

import * as React from "react"
import { twMerge } from "tailwind-merge"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline"
}

export function Button({ className = "", variant = "default", ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
  const styles =
    variant === "outline"
      ? "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
      : "bg-primary text-primary-foreground hover:bg-primary/90"
  const merged = twMerge(`${base} ${styles} ${className}`)
  return <button className={merged} {...props} />
}

export default Button



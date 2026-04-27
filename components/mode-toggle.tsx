"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Wait until mounted to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="p-2 h-9 w-9" />

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
    >
      {/* Logic-based icon switching */}
      {theme === "dark" ? (
        <Moon className="h-5 w-5 text-amber-400 transition-all" />
      ) : (
        <Sun className="h-5 w-5 text-slate-900 transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
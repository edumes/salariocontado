"use client"

import { useTheme } from '@/lib/theme-context'
import { cn } from '@/lib/utils'
import { Moon, Sun } from 'lucide-react'

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative p-2 rounded-full transition-all duration-200",
        "bg-background/5 border border-border backdrop-blur-lg",
        "hover:bg-background/10 hover:scale-105",
        "focus:outline-none focus:ring-2 focus:ring-primary/50",
        className
      )}
      aria-label={`Alternar para tema ${theme === 'light' ? 'escuro' : 'claro'}`}
    >
      <div className="relative w-5 h-5">
        <Sun
          className={cn(
            "absolute inset-0 w-5 h-5 transition-all duration-300",
            "text-yellow-500",
            theme === 'light'
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 rotate-90 scale-0"
          )}
        />
        <Moon
          className={cn(
            "absolute inset-0 w-5 h-5 transition-all duration-300",
            "text-gray-400 dark:text-gray-300",
            theme === 'dark'
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 -rotate-90 scale-0"
          )}
        />
      </div>
    </button>
  )
} 
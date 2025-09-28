"use client"

import { useState, useEffect } from "react"
import LoadingScreen from "@/components/loading-screen"
import Dashboard from "@/components/dashboard"
import FanControls from "@/components/fan-controls"
import { useTheme } from "@/components/theme-provider"
import { ErrorBoundary } from "@/components/error-boundary"
import FanControl from './components/FanControl'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (!mounted) {
    return null
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <ErrorBoundary>
      <main className={`min-h-screen bg-gradient-to-br from-black via-red-950 to-red-900 p-4 md:p-8 transition-colors duration-300 ${theme === 'dark' ? 'dark' : 'light'} flex items-center justify-center`}>
        <div className="max-w-4xl w-full mx-auto px-4">
          <div className="flex flex-col items-center justify-center space-y-8">
            <ErrorBoundary>
              <Dashboard />
            </ErrorBoundary>
            <ErrorBoundary>
              <FanControls />
            </ErrorBoundary>
            <ErrorBoundary>
              <FanControl />
            </ErrorBoundary>
          </div>
        </div>
      </main>
    </ErrorBoundary>
  )
}

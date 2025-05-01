"use client"

import { useState } from "react"
import LoadingScreen from "@/components/loading-screen"
import Dashboard from "@/components/dashboard"
import FanControls from "@/components/fan-controls"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading
  setTimeout(() => {
    setIsLoading(false)
  }, 1000)

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-red-950 to-red-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Dashboard />
        <div className="mt-8">
          <FanControls />
        </div>
      </div>
    </main>
  )
}

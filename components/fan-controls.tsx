"use client"

import { Button } from "@/components/ui/button"
import { Fan, Power, Zap } from "lucide-react"
import { useState, useEffect } from 'react'
import { ref, set, onValue } from 'firebase/database'
import { db } from '@/lib/firebase'
import { useToast } from "@/hooks/use-toast"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Gauge } from "@/components/ui/gauge"

export default function FanControls() {
  const [fanStatus, setFanStatus] = useState(false)
  const [fanSpeed, setFanSpeed] = useState(50)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (!db) {
      setIsLoading(false)
      return
    }

    const fanRef = ref(db, '/FanControl')
    const unsubscribe = onValue(fanRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        setFanStatus(data.status || false)
        setFanSpeed(data.speed || 50)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const toggleFan = async (status: boolean) => {
    if (!db) {
      toast({
        title: "Error",
        description: "Database not initialized",
        variant: "destructive"
      })
      return
    }

    try {
      const fanRef = ref(db, '/FanControl')
      await set(fanRef, {
        status,
        speed: fanSpeed
      })
      setFanStatus(status)
      toast({
        title: status ? "Fan turned on" : "Fan turned off",
        description: status ? "Your fan is now running." : "Your fan has been stopped.",
      })
    } catch (error) {
      console.error('Error toggling fan:', error)
      toast({
        title: "Error",
        description: "Failed to update fan status",
        variant: "destructive"
      })
    }
  }

  const updateFanSpeed = async (speed: number) => {
    if (!db) {
      toast({
        title: "Error",
        description: "Database not initialized",
        variant: "destructive"
      })
      return
    }

    try {
      const fanRef = ref(db, '/FanControl')
      await set(fanRef, {
        status: fanStatus,
        speed
      })
      setFanSpeed(speed)
      toast({
        title: "Fan speed updated",
        description: `Fan speed set to ${speed}%`,
      })
    } catch (error) {
      console.error('Error updating fan speed:', error)
      toast({
        title: "Error",
        description: "Failed to update fan speed",
        variant: "destructive"
      })
    }
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl bg-black/40 backdrop-blur-md border-red-900/40 shadow-xl">
        <CardContent className="flex items-center justify-center p-6">
          <p className="text-white">Loading fan controls...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-4xl bg-black/40 backdrop-blur-md border-red-900/40 shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-white">
          <Fan className="h-5 w-5 text-red-500" />
          Fan Control
        </CardTitle>
        <CardDescription className="text-red-300/70">
          Control your fan's power and speed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Power Control Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={() => toggleFan(true)}
              className={`px-8 py-4 rounded-lg transition-all duration-200 text-lg ${
                fanStatus
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-gray-600 hover:bg-gray-700'
              } text-white`}
            >
              <Power className="h-6 w-6 mr-2" />
              Turn ON
            </Button>
            <Button
              onClick={() => toggleFan(false)}
              className={`px-8 py-4 rounded-lg transition-all duration-200 text-lg ${
                !fanStatus
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-600 hover:bg-gray-700'
              } text-white`}
            >
              <Zap className="h-6 w-6 mr-2" />
              Turn OFF
            </Button>
          </div>

          {/* Speed Control */}
          <div className="w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-white">Fan Speed</Label>
              <Badge variant="outline" className="text-white">
                {fanSpeed}%
              </Badge>
            </div>
            <Slider
              value={[fanSpeed]}
              onValueChange={(value) => updateFanSpeed(value[0])}
              max={100}
              step={1}
              className="w-full"
            />
            <Gauge value={fanSpeed} />
          </div>

          {/* Status Badge */}
          <Badge
            variant="outline"
            className={`px-4 py-2 text-lg ${
              fanStatus
                ? "bg-red-600/20 text-red-400 border-red-600"
                : "bg-gray-800/20 text-gray-400 border-gray-700"
            }`}
          >
            {fanStatus ? "FAN IS RUNNING" : "FAN IS OFF"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

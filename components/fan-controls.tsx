"use client"

import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Fan, Power, Gauge, Thermometer, Moon, Zap } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
import { useState } from 'react';
import { ref, set } from 'firebase/database';
import { db } from '@/lib/firebase';

export default function FanControls() {
  const [fanStatus, setFanStatus] = useState(false);

  const toggleFan = async (status: boolean) => {
    try {
      const fanRef = ref(db, '/FanControl');
      await set(fanRef, status);
      setFanStatus(status);
    } catch (error) {
      console.error('Error toggling fan:', error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-gray-800 rounded-lg">
      <h2 className="text-xl font-semibold text-white">Fan Control</h2>
      <div className="flex gap-4">
        <button
          onClick={() => toggleFan(true)}
          className={`px-4 py-2 rounded-lg ${
            fanStatus
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-gray-500 hover:bg-gray-600'
          } text-white transition-colors`}
        >
          Turn Fan ON
        </button>
        <button
          onClick={() => toggleFan(false)}
          className={`px-4 py-2 rounded-lg ${
            !fanStatus
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-gray-500 hover:bg-gray-600'
          } text-white transition-colors`}
        >
          Turn Fan OFF
        </button>
      </div>
      <p className="text-white">
        Current Status: {fanStatus ? 'ON' : 'OFF'}
      </p>
    </div>
  );
}

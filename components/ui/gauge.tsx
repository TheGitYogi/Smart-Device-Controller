import { cn } from "@/lib/utils"

interface GaugeProps {
  value: number
  className?: string
}

export function Gauge({ value, className }: GaugeProps) {
  const percentage = Math.min(Math.max(value, 0), 100)
  const rotation = (percentage / 100) * 180

  return (
    <div className={cn("relative w-full h-4 bg-gray-800 rounded-full overflow-hidden", className)}>
      <div
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-1 h-4 bg-white rounded-full transform origin-bottom"
          style={{ transform: `rotate(${rotation}deg)` }}
        />
      </div>
    </div>
  )
} 
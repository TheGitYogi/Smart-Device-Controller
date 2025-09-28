"use client"

import { Fan } from "lucide-react"
import { useLanguage } from "./language-provider"
import { motion } from "framer-motion"

export default function LoadingScreen() {
  const { t } = useLanguage()

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-red-950 to-red-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Fan className="h-16 w-16 text-red-500 mx-auto mb-4" />
        </motion.div>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl font-bold text-white mb-2"
        >
          fan<span className="text-red-500">C</span>
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-red-300/70"
        >
          {t("app.loading")}
        </motion.p>
      </motion.div>
    </div>
  )
}

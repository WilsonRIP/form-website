"use client"

import { motion } from "framer-motion"

interface DropIndicatorProps {
  isActive: boolean
}

export function DropIndicator({ isActive }: DropIndicatorProps) {
  if (!isActive) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="h-1 bg-blue-500 rounded-full my-2 shadow-lg shadow-blue-500/50"
    />
  )
} 
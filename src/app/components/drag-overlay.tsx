"use client"

import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { motion } from "framer-motion"
import { GripVertical, X } from "lucide-react"
import { FormField } from "@/lib/types"

interface DragOverlayProps {
  field: FormField
}

export function DragOverlay({ field }: DragOverlayProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="group relative p-4 rounded-lg border-2 bg-zinc-800/90 backdrop-blur-sm border-blue-500 shadow-2xl shadow-blue-500/30 cursor-grabbing"
      style={{
        width: "100%",
        maxWidth: "400px",
      }}
    >
      {/* Drag Handle */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 p-1 text-blue-400">
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Field Content */}
      <div className="ml-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-blue-400 uppercase tracking-wide font-medium">
            {field.type}
          </span>
        </div>
        
        <div className="text-white font-medium mb-1">{field.label}</div>
        
        {field.placeholder && (
          <div className="text-gray-400 text-sm mb-1">
            Placeholder: "{field.placeholder}"
          </div>
        )}
        
        {field.required && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
            Required
          </span>
        )}
        
        {field.options && field.options.length > 0 && (
          <div className="mt-2">
            <span className="text-gray-400 text-xs">Options:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {field.options.slice(0, 3).map((option, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded text-xs bg-zinc-700/50 text-gray-300"
                >
                  {option}
                </span>
              ))}
              {field.options.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-zinc-700/50 text-gray-400">
                  +{field.options.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Dragging Indicator */}
      <div className="absolute inset-0 bg-blue-500/10 border-2 border-blue-500 rounded-lg" />
    </motion.div>
  )
} 
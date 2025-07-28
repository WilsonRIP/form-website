"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { motion } from "framer-motion"
import { GripVertical, X } from "lucide-react"
import { FormField } from "@/lib/types"

interface SortableFieldProps {
  field: FormField
  isSelected: boolean
  onSelect: (field: FormField) => void
  onDelete: (fieldId: string) => void
}

export function SortableField({ field, isSelected, onSelect, onDelete }: SortableFieldProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: isDragging ? 0.5 : 1, 
        scale: isDragging ? 1.05 : 1,
        rotate: isDragging ? 2 : 0
      }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`group relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
        isSelected
          ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20"
          : "border-zinc-700 bg-zinc-800/30 hover:border-zinc-600 hover:bg-zinc-800/50"
      } ${isDragging ? "z-50 shadow-2xl" : ""}`}
      onClick={() => onSelect(field)}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-300 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Field Content */}
      <div className="ml-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400 uppercase tracking-wide font-medium">
            {field.type}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(field.id)
            }}
            className="text-red-400 hover:text-red-300 transition-colors p-1 hover:bg-red-500/10 rounded"
          >
            <X className="w-4 h-4" />
          </button>
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

      {/* Drag Overlay Effect */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-500/10 border-2 border-blue-500 rounded-lg" />
      )}
    </motion.div>
  )
} 
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Trash2, Plus, X } from "lucide-react"
import { FormField } from "@/lib/types"

interface FieldEditorProps {
  field: FormField
  onUpdate: (fieldId: string, updates: Partial<FormField>) => void
  onDelete: (fieldId: string) => void
}

export function FieldEditor({ field, onUpdate, onDelete }: FieldEditorProps) {
  const [newOption, setNewOption] = useState("")

  const addOption = () => {
    if (newOption.trim() && field.options) {
      onUpdate(field.id, {
        options: [...field.options, newOption.trim()]
      })
      setNewOption("")
    }
  }

  const removeOption = (index: number) => {
    if (field.options) {
      const newOptions = field.options.filter((_, i) => i !== index)
      onUpdate(field.id, { options: newOptions })
    }
  }

  const needsOptions = field.type === "select" || field.type === "radio" || field.type === "checkbox"

  return (
    <motion.div 
      className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Field Properties</h3>
        <button
          onClick={() => onDelete(field.id)}
          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Field Type */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Field Type
          </label>
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2 text-white">
            {field.type.charAt(0).toUpperCase() + field.type.slice(1)}
          </div>
        </div>

        {/* Label */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Label
          </label>
          <input
            type="text"
            value={field.label}
            onChange={(e) => onUpdate(field.id, { label: e.target.value })}
            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Field label"
          />
        </div>

        {/* Placeholder */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Placeholder
          </label>
          <input
            type="text"
            value={field.placeholder || ""}
            onChange={(e) => onUpdate(field.id, { placeholder: e.target.value })}
            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Placeholder text"
          />
        </div>

        {/* Required */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="required"
            checked={field.required}
            onChange={(e) => onUpdate(field.id, { required: e.target.checked })}
            className="w-4 h-4 text-blue-600 bg-zinc-800 border-zinc-700 rounded focus:ring-blue-500 focus:ring-2"
          />
          <label htmlFor="required" className="text-sm font-medium text-gray-300">
            Required field
          </label>
        </div>

        {/* Options for select, radio, checkbox */}
        {needsOptions && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Options
            </label>
            <div className="space-y-2">
              {field.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...(field.options || [])]
                      newOptions[index] = e.target.value
                      onUpdate(field.id, { options: newOptions })
                    }}
                    className="flex-1 bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => removeOption(index)}
                    className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addOption()}
                  className="flex-1 bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add new option"
                />
                <button
                  onClick={addOption}
                  className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
} 
"use client"

import { motion } from "framer-motion"
import { 
  Type, 
  MessageSquare, 
  Mail, 
  Hash, 
  List, 
  CheckSquare, 
  CircleDot, 
  Calendar 
} from "lucide-react"
import { FieldType } from "@/lib/types"

interface FieldPaletteProps {
  onAddField: (type: FieldType) => void
}

const fieldTypes = [
  { type: "text" as FieldType, label: "Text Input", icon: Type, description: "Single line text input" },
  { type: "textarea" as FieldType, label: "Text Area", icon: MessageSquare, description: "Multi-line text input" },
  { type: "email" as FieldType, label: "Email", icon: Mail, description: "Email address input" },
  { type: "number" as FieldType, label: "Number", icon: Hash, description: "Numeric input" },
  { type: "select" as FieldType, label: "Dropdown", icon: List, description: "Select from options" },
  { type: "checkbox" as FieldType, label: "Checkbox", icon: CheckSquare, description: "Multiple choice selection" },
  { type: "radio" as FieldType, label: "Radio Buttons", icon: CircleDot, description: "Single choice selection" },
  { type: "date" as FieldType, label: "Date Picker", icon: Calendar, description: "Date selection" },
]

export function FieldPalette({ onAddField }: FieldPaletteProps) {
  return (
    <motion.div 
      className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-6 h-full overflow-y-auto"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-white font-semibold text-lg mb-4">Field Types</h3>
      <div className="space-y-3">
        {fieldTypes.map((fieldType, index) => {
          const Icon = fieldType.icon
          return (
            <motion.button
              key={fieldType.type}
              onClick={() => onAddField(fieldType.type)}
              className="w-full p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg hover:bg-zinc-700/50 hover:border-zinc-600 transition-all duration-200 text-left group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                  <Icon className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium">{fieldType.label}</div>
                  <div className="text-gray-400 text-sm">{fieldType.description}</div>
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
} 
"use client"

import { motion } from "framer-motion"
import { FormField } from "@/lib/types"

interface FormPreviewProps {
  title: string
  description: string
  fields: FormField[]
}

export function FormPreview({ title, description, fields }: FormPreviewProps) {
  const renderField = (field: FormField) => {
    const baseClasses = "w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    
    switch (field.type) {
      case "text":
      case "email":
      case "number":
        return (
          <input
            type={field.type}
            placeholder={field.placeholder}
            className={baseClasses}
            disabled
          />
        )
      
      case "textarea":
        return (
          <textarea
            placeholder={field.placeholder}
            className={`${baseClasses} resize-none`}
            rows={3}
            disabled
          />
        )
      
      case "select":
        return (
          <select className={baseClasses} disabled>
            <option value="">{field.placeholder || "Select an option"}</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        )
      
      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-zinc-800 border-zinc-700 rounded focus:ring-blue-500 focus:ring-2"
                  disabled
                />
                <span className="text-white">{option}</span>
              </label>
            ))}
          </div>
        )
      
      case "radio":
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={`radio-${field.id}`}
                  className="w-4 h-4 text-blue-600 bg-zinc-800 border-zinc-700 focus:ring-blue-500 focus:ring-2"
                  disabled
                />
                <span className="text-white">{option}</span>
              </label>
            ))}
          </div>
        )
      
      case "date":
        return (
          <input
            type="date"
            className={baseClasses}
            disabled
          />
        )
      
      default:
        return null
    }
  }

  return (
    <motion.div 
      className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-white font-semibold text-lg mb-4">Form Preview</h3>
      
      <div className="bg-zinc-800/30 rounded-lg p-4 space-y-4">
        {/* Form Header */}
        <div className="text-center pb-4 border-b border-zinc-700">
          <h2 className="text-white text-xl font-semibold mb-2">{title || "Untitled Form"}</h2>
          {description && (
            <p className="text-gray-400 text-sm">{description}</p>
          )}
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <label className="block text-sm font-medium text-white">
                {field.label}
                {field.required && <span className="text-red-400 ml-1">*</span>}
              </label>
              {renderField(field)}
            </div>
          ))}
          
          {fields.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <p className="text-sm">No fields added yet</p>
              <p className="text-xs mt-1">Add fields from the palette to see them here</p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        {fields.length > 0 && (
          <div className="pt-4 border-t border-zinc-700">
            <button
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2 px-4 rounded-lg opacity-50 cursor-not-allowed"
              disabled
            >
              Submit Form
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
} 
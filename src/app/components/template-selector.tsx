"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, X } from "lucide-react"
import { formTemplates, FormTemplate, getAllCategories } from "@/lib/form-templates"
import Tabs, { TabItem } from "@/components/ui/tabs"
import { getDefaultTheme } from "@/lib/constants/themes"

interface TemplateSelectorProps {
  onSelectTemplate: (template: FormTemplate) => void
  onClose: () => void
}

export function TemplateSelector({ onSelectTemplate, onClose }: TemplateSelectorProps) {
  const categories = ["All", ...getAllCategories()]
  const defaultTheme = getDefaultTheme()

  // Create tab items for each category
  const tabItems: TabItem[] = categories.map(category => {
    const filteredTemplates = category === "All" 
      ? formTemplates 
      : formTemplates.filter(template => template.category === category)

    const templatesContent = (
      <div className="space-y-4">
        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <motion.div
              key={template.id}
              className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 hover:border-zinc-600 hover:bg-zinc-800/70 transition-all cursor-pointer group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectTemplate(template)}
            >
              <div className="flex items-start space-x-3">
                <div 
                  className="text-2xl p-2 rounded-lg"
                  style={{ backgroundColor: `${template.color}20` }}
                >
                  {template.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-semibold mb-1 group-hover:text-purple-400 transition-colors">
                    {template.name}
                  </h4>
                  <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                    {template.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 bg-zinc-700/50 px-2 py-1 rounded">
                      {template.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {template.fields.length} fields
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Preview of fields */}
              <div className="mt-3 pt-3 border-t border-zinc-700">
                <div className="flex flex-wrap gap-1">
                  {template.fields.slice(0, 3).map((field, index) => (
                    <span
                      key={index}
                      className="text-xs bg-zinc-700/50 text-gray-300 px-2 py-1 rounded"
                    >
                      {field.type}
                    </span>
                  ))}
                  {template.fields.length > 3 && (
                    <span className="text-xs bg-zinc-700/50 text-gray-400 px-2 py-1 rounded">
                      +{template.fields.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No templates found</div>
            <p className="text-gray-500">Try selecting a different category</p>
          </div>
        )}
      </div>
    )

    return {
      id: category,
      name: category,
      content: templatesContent
    }
  })

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        className="bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 rounded-xl p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white text-xl font-semibold">Choose a Template</h3>
              <p className="text-gray-400 text-sm">Start with a pre-built form template</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs Component */}
        <div className="mb-6">
          <Tabs items={tabItems} className="w-full" theme={defaultTheme} />
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-zinc-700">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              Templates are customizable - you can modify fields after selection
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
            >
              Start from Scratch
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 
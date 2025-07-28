// Form duplication component for copying existing forms

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, X, Edit3 } from 'lucide-react'
import { Button } from './Button'
import { Form } from '@/lib/types'

interface FormDuplicatorProps {
  form: Form
  onDuplicate: (duplicatedForm: Partial<Form>) => void
  onCancel: () => void
}

export function FormDuplicator({ form, onDuplicate, onCancel }: FormDuplicatorProps) {
  const [formData, setFormData] = useState({
    title: `${form.title} (Copy)`,
    description: form.description || '',
    duplicateFields: true,
    duplicateSettings: true,
    duplicateWebhook: false,
  })

  const [isDuplicating, setIsDuplicating] = useState(false)

  const handleDuplicate = async () => {
    setIsDuplicating(true)
    
    try {
      const duplicatedForm: Partial<Form> = {
        title: formData.title,
        description: formData.description,
        fields: formData.duplicateFields ? form.fields : [],
        webhookUrl: formData.duplicateWebhook ? form.webhookUrl : undefined,
        webhookEnabled: formData.duplicateWebhook ? form.webhookEnabled : false,
      }
      
      onDuplicate(duplicatedForm)
    } catch (error) {
      console.error('Error duplicating form:', error)
    } finally {
      setIsDuplicating(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div className="bg-zinc-900/95 backdrop-blur-sm border border-zinc-800 rounded-xl p-6 max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Copy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white text-xl font-semibold">Duplicate Form</h3>
              <p className="text-gray-400 text-sm">Create a copy of "{form.title}"</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Configuration */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              New Form Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter form title..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="Enter form description..."
            />
          </div>

          {/* Duplication Options */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold">What to duplicate:</h4>
            
            <label className="flex items-center space-x-3 p-3 bg-zinc-800/30 border border-zinc-700 rounded-lg cursor-pointer hover:bg-zinc-800/50 transition-colors">
              <input
                type="checkbox"
                checked={formData.duplicateFields}
                onChange={(e) => setFormData({ ...formData, duplicateFields: e.target.checked })}
                className="w-4 h-4 text-blue-500 bg-zinc-700 border-zinc-600 rounded focus:ring-blue-500 focus:ring-2"
              />
              <div className="flex-1">
                <div className="text-white font-medium">Form Fields</div>
                <div className="text-gray-400 text-sm">{form.fields.length} fields</div>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-3 bg-zinc-800/30 border border-zinc-700 rounded-lg cursor-pointer hover:bg-zinc-800/50 transition-colors">
              <input
                type="checkbox"
                checked={formData.duplicateSettings}
                onChange={(e) => setFormData({ ...formData, duplicateSettings: e.target.checked })}
                className="w-4 h-4 text-blue-500 bg-zinc-700 border-zinc-600 rounded focus:ring-blue-500 focus:ring-2"
              />
              <div className="flex-1">
                <div className="text-white font-medium">Form Settings</div>
                <div className="text-gray-400 text-sm">Theme, layout, and preferences</div>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-3 bg-zinc-800/30 border border-zinc-700 rounded-lg cursor-pointer hover:bg-zinc-800/50 transition-colors">
              <input
                type="checkbox"
                checked={formData.duplicateWebhook}
                onChange={(e) => setFormData({ ...formData, duplicateWebhook: e.target.checked })}
                className="w-4 h-4 text-blue-500 bg-zinc-700 border-zinc-600 rounded focus:ring-blue-500 focus:ring-2"
              />
              <div className="flex-1">
                <div className="text-white font-medium">Webhook Configuration</div>
                <div className="text-gray-400 text-sm">URL and settings</div>
              </div>
            </label>
          </div>

          {/* Summary */}
          <div className="bg-zinc-800/30 border border-zinc-700 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">Summary</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Original Form:</span>
                <span className="text-white">{form.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">New Form:</span>
                <span className="text-white">{formData.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Fields to copy:</span>
                <span className="text-white">{formData.duplicateFields ? form.fields.length : 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 mt-6">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isDuplicating}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleDuplicate}
            loading={isDuplicating}
            icon={isDuplicating ? undefined : <Copy className="w-4 h-4" />}
          >
            {isDuplicating ? 'Duplicating...' : 'Duplicate Form'}
          </Button>
        </div>
      </div>
    </motion.div>
  )
} 
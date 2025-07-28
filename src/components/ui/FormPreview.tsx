// Form preview component with different device views

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  X,
  RotateCcw,
  Maximize,
  Minimize
} from 'lucide-react'
import { Button } from './Button'
import { FormField } from '@/lib/types'

interface FormPreviewProps {
  title: string
  description?: string
  fields: FormField[]
  theme?: string
  onClose: () => void
}

type DeviceType = 'mobile' | 'tablet' | 'desktop'

export function FormPreview({ 
  title, 
  description, 
  fields, 
  theme = 'modern-dark',
  onClose 
}: FormPreviewProps) {
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>('desktop')
  const [isFullscreen, setIsFullscreen] = useState(false)

  const devices = [
    {
      id: 'mobile' as DeviceType,
      name: 'Mobile',
      icon: Smartphone,
      width: 'w-80',
      height: 'h-[600px]',
      maxWidth: 'max-w-80'
    },
    {
      id: 'tablet' as DeviceType,
      name: 'Tablet',
      icon: Tablet,
      width: 'w-96',
      height: 'h-[700px]',
      maxWidth: 'max-w-96'
    },
    {
      id: 'desktop' as DeviceType,
      name: 'Desktop',
      icon: Monitor,
      width: 'w-full',
      height: 'h-[800px]',
      maxWidth: 'max-w-2xl'
    }
  ]

  const selectedDeviceConfig = devices.find(d => d.id === selectedDevice)!

  const renderField = (field: FormField) => {
    const baseClasses = "w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'url':
      case 'password':
        return (
          <input
            key={field.id}
            type={field.type}
            placeholder={field.placeholder}
            className={baseClasses}
            disabled
          />
        )
      
      case 'textarea':
        return (
          <textarea
            key={field.id}
            placeholder={field.placeholder}
            className={`${baseClasses} resize-none`}
            rows={4}
            disabled
          />
        )
      
      case 'number':
        return (
          <input
            key={field.id}
            type="number"
            placeholder={field.placeholder}
            className={baseClasses}
            disabled
          />
        )
      
      case 'select':
        return (
          <select key={field.id} className={baseClasses} disabled>
            <option value="">{field.placeholder || 'Select an option'}</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        )
      
      case 'checkbox':
        return (
          <div key={field.id} className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-500 bg-zinc-700 border-zinc-600 rounded focus:ring-blue-500 focus:ring-2"
                  disabled
                />
                <span className="text-white">{option}</span>
              </label>
            ))}
          </div>
        )
      
      case 'radio':
        return (
          <div key={field.id} className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={field.id}
                  className="w-4 h-4 text-blue-500 bg-zinc-700 border-zinc-600 focus:ring-blue-500 focus:ring-2"
                  disabled
                />
                <span className="text-white">{option}</span>
              </label>
            ))}
          </div>
        )
      
      case 'date':
        return (
          <input
            key={field.id}
            type="date"
            className={baseClasses}
            disabled
          />
        )
      
      case 'time':
        return (
          <input
            key={field.id}
            type="time"
            className={baseClasses}
            disabled
          />
        )
      
      case 'datetime':
        return (
          <input
            key={field.id}
            type="datetime-local"
            className={baseClasses}
            disabled
          />
        )
      
      case 'color':
        return (
          <input
            key={field.id}
            type="color"
            className="w-full h-12 bg-zinc-800/50 border border-zinc-700 rounded-lg cursor-pointer"
            disabled
          />
        )
      
      case 'range':
        return (
          <input
            key={field.id}
            type="range"
            min="0"
            max="100"
            className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
            disabled
          />
        )
      
      case 'rating':
        return (
          <div key={field.id} className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className="text-2xl text-gray-400 hover:text-yellow-400 transition-colors"
                disabled
              >
                ⭐
              </button>
            ))}
          </div>
        )
      
      case 'file':
        return (
          <div key={field.id} className="border-2 border-dashed border-zinc-700 rounded-lg p-6 text-center">
            <div className="text-gray-400 mb-2">📎</div>
            <p className="text-gray-400 text-sm">Click to upload or drag and drop</p>
            <p className="text-gray-500 text-xs mt-1">PDF, DOC, or image files (max 10MB)</p>
          </div>
        )
      
      default:
        return (
          <input
            key={field.id}
            type="text"
            placeholder={field.placeholder}
            className={baseClasses}
            disabled
          />
        )
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 ${
        isFullscreen ? 'p-0' : ''
      }`}
    >
      <div className={`bg-zinc-900/95 backdrop-blur-sm border border-zinc-800 rounded-xl ${
        isFullscreen ? 'w-full h-full rounded-none' : 'max-w-7xl w-full max-h-[90vh]'
      } flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div className="flex items-center space-x-4">
            <h3 className="text-white text-xl font-semibold">Form Preview</h3>
            
            {/* Device Selector */}
            <div className="flex items-center space-x-2 bg-zinc-800/50 rounded-lg p-1">
              {devices.map((device) => (
                <button
                  key={device.id}
                  onClick={() => setSelectedDevice(device.id)}
                  className={`p-2 rounded-md transition-colors ${
                    selectedDevice === device.id
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-zinc-700'
                  }`}
                  title={device.name}
                >
                  <device.icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              icon={isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            >
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              icon={<RotateCcw className="w-4 h-4" />}
            >
              Refresh
            </Button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 flex items-center justify-center p-6 overflow-auto">
          <div className={`${selectedDeviceConfig.maxWidth} w-full`}>
            {/* Device Frame */}
            <div className={`mx-auto ${selectedDeviceConfig.width} ${selectedDeviceConfig.height} bg-zinc-800/30 border border-zinc-700 rounded-lg overflow-hidden`}>
              {/* Device Header */}
              <div className="bg-zinc-900/50 border-b border-zinc-700 px-4 py-2 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-xs text-gray-400">{selectedDeviceConfig.name}</div>
              </div>
              
              {/* Form Content */}
              <div className="p-6 h-full overflow-y-auto">
                <div className="space-y-6">
                  {/* Form Header */}
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
                    {description && (
                      <p className="text-gray-400">{description}</p>
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
                  </div>

                  {/* Submit Button */}
                  <Button
                    variant="primary"
                    className="w-full"
                    disabled
                  >
                    Submit Form
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
} 
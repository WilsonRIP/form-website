// Multi-step form component for creating forms with multiple steps

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Edit3,
  Eye,
  Check
} from 'lucide-react'
import Button from './Button'
import { FormField } from '@/lib/types'

interface FormStep {
  id: string
  title: string
  description?: string
  fields: FormField[]
}

interface MultiStepFormProps {
  steps: FormStep[]
  currentStep: number
  onStepChange: (stepIndex: number) => void
  onStepUpdate: (stepIndex: number, step: FormStep) => void
  onStepAdd: () => void
  onStepDelete: (stepIndex: number) => void
  onStepReorder: (fromIndex: number, toIndex: number) => void
}

export function MultiStepForm({
  steps,
  currentStep,
  onStepChange,
  onStepUpdate,
  onStepAdd,
  onStepDelete,
  onStepReorder
}: MultiStepFormProps) {
  const [isEditing, setIsEditing] = useState(false)

  const handleStepTitleChange = (stepIndex: number, title: string) => {
    const currentStep = steps[stepIndex]
    if (currentStep) {
      const updatedStep = { ...currentStep, title }
      onStepUpdate(stepIndex, updatedStep)
    }
  }

  const handleStepDescriptionChange = (stepIndex: number, description: string) => {
    const currentStep = steps[stepIndex]
    if (currentStep) {
      const updatedStep = { ...currentStep, description }
      onStepUpdate(stepIndex, updatedStep)
    }
  }

  return (
    <div className="space-y-6">
      {/* Step Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-white text-lg font-semibold">Form Steps</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            iconLeft={isEditing ? <Eye className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          >
            {isEditing ? 'Preview' : 'Edit'}
          </Button>
        </div>
        
        <Button
          variant="default"
          size="sm"
          onClick={onStepAdd}
          iconLeft={<Plus className="w-4 h-4" />}
        >
          Add Step
        </Button>
      </div>

      {/* Step Progress */}
      <div className="flex items-center space-x-2">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => onStepChange(index)}
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                index === currentStep
                  ? 'border-blue-500 bg-blue-500 text-white'
                  : index < currentStep
                  ? 'border-green-500 bg-green-500 text-white'
                  : 'border-zinc-600 bg-zinc-800 text-gray-400 hover:border-zinc-500'
              }`}
            >
              {index < currentStep ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </button>
            
            {index < steps.length - 1 && (
              <div className={`w-8 h-0.5 mx-2 ${
                index < currentStep ? 'bg-green-500' : 'bg-zinc-600'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-6"
        >
          {isEditing ? (
            steps[currentStep] && (
              <StepEditor
                step={steps[currentStep]}
                stepIndex={currentStep}
                onTitleChange={handleStepTitleChange}
                onDescriptionChange={handleStepDescriptionChange}
                onDelete={() => onStepDelete(currentStep)}
                canDelete={steps.length > 1}
              />
            )
          ) : (
            steps[currentStep] && <StepPreview step={steps[currentStep]} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => onStepChange(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          iconLeft={<ChevronLeft className="w-4 h-4" />}
        >
          Previous
        </Button>

        <div className="text-sm text-gray-400">
          Step {currentStep + 1} of {steps.length}
        </div>

        <Button
          variant="default"
          onClick={() => onStepChange(Math.min(steps.length - 1, currentStep + 1))}
          disabled={currentStep === steps.length - 1}
          iconLeft={<ChevronRight className="w-4 h-4" />}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

interface StepEditorProps {
  step: FormStep
  stepIndex: number
  onTitleChange: (stepIndex: number, title: string) => void
  onDescriptionChange: (stepIndex: number, description: string) => void
  onDelete: () => void
  canDelete: boolean
}

function StepEditor({
  step,
  stepIndex,
  onTitleChange,
  onDescriptionChange,
  onDelete,
  canDelete
}: StepEditorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-white text-lg font-semibold">Step {stepIndex + 1}</h4>
        {canDelete && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            iconLeft={<Trash2 className="w-4 h-4" />}
          >
            Delete Step
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Step Title
          </label>
          <input
            type="text"
            value={step.title}
            onChange={(e) => onTitleChange(stepIndex, e.target.value)}
            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter step title..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Step Description (Optional)
          </label>
          <textarea
            value={step.description || ''}
            onChange={(e) => onDescriptionChange(stepIndex, e.target.value)}
            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            placeholder="Enter step description..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Fields in this step: {step.fields.length}
          </label>
          <div className="bg-zinc-800/30 border border-zinc-700 rounded-lg p-4">
            {step.fields.length === 0 ? (
              <p className="text-gray-400 text-sm">No fields in this step yet. Add fields from the field palette.</p>
            ) : (
              <div className="space-y-2">
                {step.fields.map((field) => (
                  <div key={field.id} className="flex items-center justify-between p-2 bg-zinc-800/50 rounded">
                    <span className="text-white text-sm">{field.label}</span>
                    <span className="text-gray-400 text-xs">{field.type}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface StepPreviewProps {
  step: FormStep
}

function StepPreview({ step }: StepPreviewProps) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-white text-lg font-semibold mb-2">{step.title}</h4>
        {step.description && (
          <p className="text-gray-400 text-sm">{step.description}</p>
        )}
      </div>

      <div className="space-y-3">
        {step.fields.map((field) => (
          <div key={field.id} className="p-3 bg-zinc-800/30 border border-zinc-700 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">{field.label}</span>
              <span className="text-gray-400 text-xs">{field.type}</span>
            </div>
            {field.required && (
              <span className="text-red-400 text-xs">Required</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 
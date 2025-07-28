"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  DndContext, 
  DragEndEvent, 
  DragStartEvent,
  DragOverEvent,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay as DndDragOverlay
} from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useMutation } from "@tanstack/react-query"
import { Undo, Redo } from "lucide-react"
import { FieldPalette } from "./field-palette"
import { FormPreview } from "./form-preview"
import { FieldEditor } from "./field-editor"
import { WebhookSettings } from "./webhook-settings"
import { SortableField } from "./sortable-field"
import { DragOverlay } from "./drag-overlay"
import { TemplateSelector } from "./template-selector"
import { FormField, FieldType } from "@/lib/types"
import { formApi } from "@/lib/api"
import { useUndoRedo } from "@/lib/hooks/useUndoRedo"

interface FormBuilderProps {
  initialForm?: any
  isEditing?: boolean
}

export function FormBuilder({ initialForm, isEditing = false }: FormBuilderProps) {
  const [fields, setFields] = useState<FormField[]>(() => {
    if (initialForm?.fields) {
      return initialForm.fields.map((field: any) => ({
        id: field.id.toString(),
        type: field.type as FieldType,
        label: field.label,
        placeholder: field.placeholder || "",
        required: field.required || false,
        options: field.options ? JSON.parse(field.options) : undefined,
        order: field.order
      }))
    }
    return []
  })
  const [selectedField, setSelectedField] = useState<FormField | null>(null)
  const [formTitle, setFormTitle] = useState(initialForm?.title || "Untitled Form")
  const [formDescription, setFormDescription] = useState(initialForm?.description || "")
  const [webhookUrl, setWebhookUrl] = useState(initialForm?.webhookUrl || "")
  const [webhookEnabled, setWebhookEnabled] = useState(initialForm?.webhookEnabled || false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)

  // Initialize undo/redo functionality
  const initialFormState = {
    fields: fields,
    formTitle: formTitle,
    formDescription: formDescription,
    webhookUrl: webhookUrl,
    webhookEnabled: webhookEnabled
  }

  const { canUndo, canRedo, undo, redo, saveToHistory, getCurrentState } = useUndoRedo(initialFormState)

  // Handle undo/redo state restoration
  const handleUndo = () => {
    const previousState = getCurrentState()
    if (previousState) {
      setFields(previousState.fields)
      setFormTitle(previousState.formTitle)
      setFormDescription(previousState.formDescription)
      setWebhookUrl(previousState.webhookUrl)
      setWebhookEnabled(previousState.webhookEnabled)
    }
    undo()
  }

  const handleRedo = () => {
    redo()
    const nextState = getCurrentState()
    if (nextState) {
      setFields(nextState.fields)
      setFormTitle(nextState.formTitle)
      setFormDescription(nextState.formDescription)
      setWebhookUrl(nextState.webhookUrl)
      setWebhookEnabled(nextState.webhookEnabled)
    }
  }

  // Save form state to history whenever it changes
  useEffect(() => {
    const currentState = {
      fields: fields,
      formTitle: formTitle,
      formDescription: formDescription,
      webhookUrl: webhookUrl,
      webhookEnabled: webhookEnabled
    }
    saveToHistory(currentState)
  }, [fields, formTitle, formDescription, webhookUrl, webhookEnabled, saveToHistory])

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        if (event.key === 'z' && !event.shiftKey) {
          event.preventDefault()
          handleUndo()
        } else if ((event.key === 'y') || (event.key === 'z' && event.shiftKey)) {
          event.preventDefault()
          handleRedo()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleUndo, handleRedo])

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (over && active.id !== over.id) {
      const activeField = fields.find(field => field.id === active.id)
      if (activeField) {
        const oldIndex = fields.findIndex(field => field.id === active.id)
        const newIndex = fields.findIndex(field => field.id === over.id)
        
        const newFields = [...fields]
        newFields.splice(oldIndex, 1)
        newFields.splice(newIndex, 0, activeField)
        
        // Update order property for all fields
        const updatedFields = newFields.map((field, index) => ({
          ...field,
          order: index
        }))
        
        setFields(updatedFields)
      }
    }
  }

  const addField = (type: FieldType) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type,
      label: `New ${type} field`,
      placeholder: "",
      required: false,
      options: type === "select" || type === "radio" || type === "checkbox" ? ["Option 1", "Option 2"] : undefined,
      order: fields.length
    }
    setFields([...fields, newField])
    setSelectedField(newField)
  }

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFields(fields.map(field => 
      field.id === fieldId ? { ...field, ...updates } : field
    ))
    if (selectedField?.id === fieldId) {
      setSelectedField({ ...selectedField, ...updates })
    }
  }

  const deleteField = (fieldId: string) => {
    setFields(fields.filter(field => field.id !== fieldId))
    if (selectedField?.id === fieldId) {
      setSelectedField(null)
    }
  }

  const handleTemplateSelect = (template: any) => {
    setFields(template.fields.map((field: any, index: number) => ({
      ...field,
      id: `field-${Date.now()}-${index}`,
      order: index
    })))
    setFormTitle(template.name)
    setFormDescription(template.description)
    setShowTemplateSelector(false)
  }

  const { mutate: saveFormMutation, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      // Filter out unsupported field types for API
      const supportedFields = fields.filter(field => 
        field.type !== "file"
      ).map((field, index) => ({
        type: field.type as "text" | "textarea" | "email" | "number" | "select" | "checkbox" | "radio" | "date",
        label: field.label,
        placeholder: field.placeholder || "",
        required: field.required,
        options: field.options,
        order: index
      }))

      const formData = {
        title: formTitle,
        description: formDescription,
        webhookUrl: webhookUrl || undefined,
        webhookEnabled: webhookEnabled,
        fields: supportedFields
      }

      if (isEditing && initialForm?.id) {
        return await formApi.update({
          id: initialForm.id,
          ...formData
        })
      } else {
        return await formApi.create(formData)
      }
    },
    onSuccess: (data) => {
      console.log("Form saved successfully:", data)
      // TODO: Show success message and redirect to form list
    },
    onError: (error) => {
      console.error("Failed to save form:", error)
      // TODO: Show error message
    }
  })

  const saveForm = () => {
    if (fields.length === 0) {
      alert("Please add at least one field to your form")
      return
    }
    saveFormMutation()
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-200px)]">
        {/* Field Palette */}
        <div className="lg:col-span-3">
          <div className="mb-4">
            <button
              onClick={() => setShowTemplateSelector(true)}
              className="w-full mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <span>✨</span>
              <span>Use Template</span>
            </button>
          </div>
          <FieldPalette onAddField={addField} />
        </div>

        {/* Form Builder Area */}
        <div className="lg:col-span-6">
          <motion.div 
            className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-6 h-full overflow-y-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Undo/Redo Controls */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleUndo}
                  disabled={!canUndo}
                  className="p-2 text-gray-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                  title="Undo (Ctrl+Z)"
                >
                  <Undo className="w-4 h-4" />
                  <span className="text-sm">Undo</span>
                </button>
                <button
                  onClick={handleRedo}
                  disabled={!canRedo}
                  className="p-2 text-gray-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                  title="Redo (Ctrl+Y)"
                >
                  <Redo className="w-4 h-4" />
                  <span className="text-sm">Redo</span>
                </button>
              </div>
              <div className="text-xs text-gray-500">
                Use Ctrl+Z to undo, Ctrl+Y to redo
              </div>
            </div>

            {/* Form Header */}
            <div className="mb-6 space-y-4">
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Form Title"
              />
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Form Description (optional)"
                rows={2}
              />
            </div>

            {/* Fields Container */}
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter} 
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                  {fields.map((field) => (
                    <SortableField
                      key={field.id}
                      field={field}
                      isSelected={selectedField?.id === field.id}
                      onSelect={setSelectedField}
                      onDelete={deleteField}
                    />
                  ))}
                </div>
              </SortableContext>
              
              <DndDragOverlay>
                {activeId ? (
                  <DragOverlay field={fields.find(f => f.id === activeId)!} />
                ) : null}
              </DndDragOverlay>
            </DndContext>

            {fields.length === 0 && (
              <div className="text-center text-gray-500 py-12">
                <div className="space-y-4">
                  <p className="text-lg font-medium">No fields added yet</p>
                  <p>Drag fields from the palette to start building your form</p>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                    <span>💡 Tip: You can reorder fields by dragging them</span>
                  </div>
                </div>
              </div>
            )}

            {fields.length > 0 && (
              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center space-x-2 text-sm text-blue-400">
                  <span>🎯</span>
                  <span>Drag the grip handle (⋮⋮) to reorder fields</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Field Editor & Preview */}
        <div className="lg:col-span-3 space-y-6">
          {/* Field Editor */}
          {selectedField && (
            <FieldEditor
              field={selectedField}
              onUpdate={updateField}
              onDelete={deleteField}
            />
          )}

          {/* Webhook Settings */}
          <WebhookSettings
            webhookUrl={webhookUrl}
            webhookEnabled={webhookEnabled}
            onWebhookUrlChange={setWebhookUrl}
            onWebhookEnabledChange={setWebhookEnabled}
          />

          {/* Form Preview */}
          <FormPreview
            title={formTitle}
            description={formDescription}
            fields={fields}
          />

          {/* Save Button */}
          <motion.button
            onClick={saveForm}
            disabled={isSaving}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: isSaving ? 1 : 1.02 }}
            whileTap={{ scale: isSaving ? 1 : 0.98 }}
          >
            {isSaving ? "Saving..." : "Save Form"}
          </motion.button>
        </div>
      </div>

      {/* Template Selector Modal */}
      {showTemplateSelector && (
        <TemplateSelector
          onSelectTemplate={handleTemplateSelect}
          onClose={() => setShowTemplateSelector(false)}
        />
      )}
    </>
  )
} 
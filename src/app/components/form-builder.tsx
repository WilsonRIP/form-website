"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useMutation } from "@tanstack/react-query"
import { FieldPalette } from "./field-palette"
import { FormPreview } from "./form-preview"
import { FieldEditor } from "./field-editor"
import { FormField, FieldType } from "@/lib/types"
import { formApi } from "@/lib/api"

export function FormBuilder() {
  const [fields, setFields] = useState<FormField[]>([])
  const [selectedField, setSelectedField] = useState<FormField | null>(null)
  const [formTitle, setFormTitle] = useState("Untitled Form")
  const [formDescription, setFormDescription] = useState("")

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const activeField = fields.find(field => field.id === active.id)
      if (activeField) {
        const oldIndex = fields.findIndex(field => field.id === active.id)
        const newIndex = fields.findIndex(field => field.id === over.id)
        
        const newFields = [...fields]
        newFields.splice(oldIndex, 1)
        newFields.splice(newIndex, 0, activeField)
        
        setFields(newFields)
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

  const { mutate: saveFormMutation, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      return await formApi.create({
        title: formTitle,
        description: formDescription,
        fields: fields.map((field, index) => ({
          type: field.type,
          label: field.label,
          placeholder: field.placeholder || "",
          required: field.required,
          options: field.options,
          order: index
        }))
      })
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-200px)]">
      {/* Field Palette */}
      <div className="lg:col-span-3">
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
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-4">
                {fields.map((field) => (
                  <motion.div
                    key={field.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedField?.id === field.id
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-zinc-700 bg-zinc-800/30 hover:border-zinc-600"
                    }`}
                    onClick={() => setSelectedField(field)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400 uppercase tracking-wide">{field.type}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteField(field.id)
                        }}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                    <div className="text-white font-medium">{field.label}</div>
                    {field.required && (
                      <span className="text-red-400 text-sm">Required</span>
                    )}
                  </motion.div>
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {fields.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              <p>Drag fields from the palette to start building your form</p>
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
  )
} 
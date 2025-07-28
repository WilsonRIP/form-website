"use client"

import { useParams } from "next/navigation"
import { useQuery, useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle, AlertCircle } from "lucide-react"
import { formApi } from "@/lib/api"

export default function FormViewerPage() {
  const params = useParams()
  const formId = parseInt(params.id as string)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  const { data: form, isLoading, error } = useQuery({
    queryKey: ["form", formId],
    queryFn: () => formApi.getById(formId),
    enabled: !!formId,
  })

  const { mutate: submitForm, isPending } = useMutation({
    mutationFn: (data: Record<string, any>) => formApi.submit({ formId, data }),
    onSuccess: () => {
      setIsSubmitted(true)
    },
    onError: (error) => {
      console.error("Failed to submit form:", error)
      alert("Failed to submit form. Please try again.")
    }
  })

  const handleInputChange = (fieldLabel: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldLabel]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    const requiredFields = form?.fields?.filter((field: any) => field.required) || []
    const missingFields = requiredFields.filter((field: any) => !formData[field.label])
    
    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.map((f: any) => f.label).join(", ")}`)
      return
    }
    
    submitForm(formData)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading form...</div>
      </div>
    )
  }

  if (error || !form) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-400">Form not found</div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <main className="flex min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex-col relative isolate">
        <div className="absolute inset-0 -z-10 opacity-50 mix-blend-soft-light bg-[url('/noise.svg')] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />
        <div className="container mx-auto px-4 py-8">
          <motion.div
            className="max-w-md mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-8">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h1 className="text-white text-2xl font-semibold mb-2">Thank You!</h1>
              <p className="text-gray-400">Your form has been submitted successfully.</p>
            </div>
          </motion.div>
        </div>
      </main>
    )
  }

  const renderField = (field: any) => {
    const baseClasses = "w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    
    switch (field.type) {
      case "text":
      case "email":
      case "number":
        return (
          <input
            type={field.type}
            value={formData[field.label] || ""}
            onChange={(e) => handleInputChange(field.label, e.target.value)}
            placeholder={field.placeholder}
            className={baseClasses}
            required={field.required}
          />
        )
      
      case "textarea":
        return (
          <textarea
            value={formData[field.label] || ""}
            onChange={(e) => handleInputChange(field.label, e.target.value)}
            placeholder={field.placeholder}
            className={`${baseClasses} resize-none`}
            rows={3}
            required={field.required}
          />
        )
      
      case "select":
        return (
          <select 
            value={formData[field.label] || ""}
            onChange={(e) => handleInputChange(field.label, e.target.value)}
            className={baseClasses}
            required={field.required}
          >
            <option value="">{field.placeholder || "Select an option"}</option>
            {field.options ? JSON.parse(field.options).map((option: string, index: number) => (
              <option key={index} value={option}>
                {option}
              </option>
            )) : null}
          </select>
        )
      
      case "multiselect":
        return (
          <div className="space-y-2">
            {field.options ? JSON.parse(field.options).map((option: string, index: number) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData[field.label]?.includes?.(option) || false}
                  onChange={(e) => {
                    const currentValues = formData[field.label] || []
                    const newValues = e.target.checked
                      ? [...currentValues, option]
                      : currentValues.filter((v: string) => v !== option)
                    handleInputChange(field.label, newValues)
                  }}
                  className="w-4 h-4 text-blue-600 bg-zinc-800 border-zinc-700 rounded focus:ring-blue-500 focus:ring-2"
                  required={field.required}
                />
                <span className="text-white">{option}</span>
              </label>
            )) : null}
          </div>
        )
      
      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options ? JSON.parse(field.options).map((option: string, index: number) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData[field.label]?.includes?.(option) || false}
                  onChange={(e) => {
                    const currentValues = formData[field.label] || []
                    const newValues = e.target.checked
                      ? [...currentValues, option]
                      : currentValues.filter((v: string) => v !== option)
                    handleInputChange(field.label, newValues)
                  }}
                  className="w-4 h-4 text-blue-600 bg-zinc-800 border-zinc-700 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-white">{option}</span>
              </label>
            )) : null}
          </div>
        )
      
      case "radio":
        return (
          <div className="space-y-2">
            {field.options ? JSON.parse(field.options).map((option: string, index: number) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={`radio-${field.id}`}
                  value={option}
                  checked={formData[field.label] === option}
                  onChange={(e) => handleInputChange(field.label, e.target.value)}
                  className="w-4 h-4 text-blue-600 bg-zinc-800 border-zinc-700 focus:ring-blue-500 focus:ring-2"
                  required={field.required}
                />
                <span className="text-white">{option}</span>
              </label>
            )) : null}
          </div>
        )
      
      case "date":
        return (
          <input
            type="date"
            value={formData[field.label] || ""}
            onChange={(e) => handleInputChange(field.label, e.target.value)}
            className={baseClasses}
            required={field.required}
          />
        )
      
      default:
        return null
    }
  }

  return (
    <main className="flex min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex-col relative isolate">
      <div className="absolute inset-0 -z-10 opacity-50 mix-blend-soft-light bg-[url('/noise.svg')] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-8">
            {/* Form Header */}
            <div className="text-center mb-8">
              <h1 className="text-white text-3xl font-semibold mb-2">{form.title}</h1>
              {form.description && (
                <p className="text-gray-400">{form.description}</p>
              )}
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {form.fields?.map((field: any) => (
                <div key={field.id} className="space-y-2">
                  <label className="block text-sm font-medium text-white">
                    {field.label}
                    {field.required && <span className="text-red-400 ml-1">*</span>}
                  </label>
                  {renderField(field)}
                </div>
              ))}
              
              <motion.button
                type="submit"
                disabled={isPending}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: isPending ? 1 : 1.02 }}
                whileTap={{ scale: isPending ? 1 : 0.98 }}
              >
                {isPending ? "Submitting..." : "Submit Form"}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </main>
  )
} 
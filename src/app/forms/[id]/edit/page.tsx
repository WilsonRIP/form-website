"use client"

import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { formApi } from "@/lib/api"
import { FormBuilder } from "../../../components/form-builder"

export default function EditFormPage() {
  const params = useParams()
  const formId = parseInt(params.id as string)

  const { data: form, isLoading, error } = useQuery({
    queryKey: ["form", formId],
    queryFn: () => formApi.getById(formId),
    enabled: !!formId,
  })

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
        <div className="text-red-400">Error loading form: {error?.message}</div>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex-col relative isolate">
      <div className="absolute inset-0 -z-10 opacity-50 mix-blend-soft-light bg-[url('/noise.svg')] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />
      
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-4 mb-6">
          <Link href="/forms">
            <motion.button
              className="p-2 text-gray-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
          </Link>
          <div>
            <h1 className="text-white text-2xl font-semibold">Edit Form</h1>
            <p className="text-gray-400 text-sm">{form.title}</p>
          </div>
        </div>
      </div>

      {/* Form Builder */}
      <div className="container mx-auto px-4 pb-8">
        <FormBuilder 
          initialForm={form}
          isEditing={true}
        />
      </div>
    </main>
  )
} 
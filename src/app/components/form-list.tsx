"use client"

import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Calendar, FileText, Users, Eye, Edit, Trash2, Plus } from "lucide-react"
import { formApi } from "@/lib/api"
import Link from "next/link"
import Button from "@/components/ui/Button"

export function FormList() {
  const { data: forms, isLoading, error } = useQuery({
    queryKey: ["forms"],
    queryFn: formApi.getAll,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white">Loading forms...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-red-400">Error loading forms: {error.message}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Create New Form Button */}
      <div className="flex justify-end">
        <Link href="/">
          <Button
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            iconLeft={<Plus className="w-5 h-5" />}
          >
            Create New Form
          </Button>
        </Link>
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {forms && forms.length > 0 ? (
          forms.map((form: any, index: number) => (
            <motion.div
              key={form.id}
              className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all duration-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg mb-2">{form.title}</h3>
                  {form.description && (
                    <p className="text-gray-400 text-sm mb-3">{form.description}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(form.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <Link href={`/forms/${form.id}`}>
                    <Button variant="ghost" size="sm" className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href={`/forms/${form.id}/edit`}>
                    <Button variant="ghost" size="sm" className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/10">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href={`/forms/${form.id}/submissions`}>
                    <Button variant="ghost" size="sm" className="p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10">
                      <Users className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
                <Button variant="ghost" size="sm" className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-500 mb-4">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No forms created yet</p>
              <p className="text-sm mt-2">Create your first form to get started</p>
            </div>
            <Link href="/">
              <Button
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Create Your First Form
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
} 
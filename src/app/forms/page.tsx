'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Plus, 
  FileText, 
  Calendar, 
  BarChart3, 
  MoreVertical,
  Edit,
  Trash2,
  Eye
} from 'lucide-react'
import { FormTheme, getDefaultTheme } from '@/lib/constants/themes'
import Button from '@/components/ui/Button'
import { useAuth } from '@/lib/contexts/AuthContext'

interface Form {
  id: string
  title: string
  description?: string
  createdAt: string
  submissions: number
  isPublished: boolean
}

export default function FormsPage() {
  const [forms, setForms] = useState<Form[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { isAuthenticated } = useAuth()
  const currentTheme = getDefaultTheme()

  // Demo data
  useEffect(() => {
    const demoForms: Form[] = [
      {
        id: '1',
        title: 'Contact Form',
        description: 'A simple contact form for collecting inquiries',
        createdAt: '2024-01-15',
        submissions: 24,
        isPublished: true
      },
      {
        id: '2',
        title: 'Event Registration',
        description: 'Register attendees for events and conferences',
        createdAt: '2024-01-10',
        submissions: 156,
        isPublished: true
      },
      {
        id: '3',
        title: 'Customer Feedback',
        description: 'Collect customer feedback and ratings',
        createdAt: '2024-01-05',
        submissions: 89,
        isPublished: false
      }
    ]

    setTimeout(() => {
      setForms(demoForms)
      setIsLoading(false)
    }, 1000)
  }, [])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 
            className="text-2xl font-bold mb-4"
            style={{ color: currentTheme.colors.text }}
          >
            Sign in to view your forms
          </h2>
          <p 
            className="mb-6"
            style={{ color: currentTheme.colors.textSecondary }}
          >
            Create an account to start building and managing your forms
          </p>
          <Link href="/">
            <Button
              style={{
                background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
                color: '#ffffff'
              }}
            >
              Go to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: currentTheme.colors.background }}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 
              className="text-3xl font-bold mb-2"
              style={{ color: currentTheme.colors.text }}
            >
              My Forms
            </h1>
            <p 
              className="text-lg"
              style={{ color: currentTheme.colors.textSecondary }}
            >
              Manage and track your forms
            </p>
          </div>
          <Link href="/">
            <Button
              style={{
                background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
                color: '#ffffff'
              }}
              iconLeft={<Plus className="w-4 h-4" />}
            >
              Create Form
            </Button>
          </Link>
        </div>

        {/* Forms Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-xl p-6"
                style={{
                  backgroundColor: `${currentTheme.colors.surface}80`,
                  border: `1px solid ${currentTheme.colors.border}`
                }}
              >
                <div className="h-6 bg-gray-600 rounded mb-4"></div>
                <div className="h-4 bg-gray-600 rounded mb-2"></div>
                <div className="h-4 bg-gray-600 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : forms.length === 0 ? (
          <div className="text-center py-12">
            <FileText 
              className="w-16 h-16 mx-auto mb-4"
              style={{ color: currentTheme.colors.textSecondary }}
            />
            <h3 
              className="text-xl font-semibold mb-2"
              style={{ color: currentTheme.colors.text }}
            >
              No forms yet
            </h3>
            <p 
              className="mb-6"
              style={{ color: currentTheme.colors.textSecondary }}
            >
              Create your first form to get started
            </p>
            <Link href="/">
              <Button
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
                  color: '#ffffff'
                }}
                iconLeft={<Plus className="w-4 h-4" />}
              >
                Create Your First Form
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form, index) => (
              <motion.div
                key={form.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative rounded-xl p-6 transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: `${currentTheme.colors.surface}CC`,
                  border: `1px solid ${currentTheme.colors.border}`,
                  borderRadius: currentTheme.borderRadius,
                  boxShadow: currentTheme.shadow !== 'none' ? currentTheme.shadow : undefined
                }}
              >
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span 
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      form.isPublished 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >
                    {form.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>

                {/* Form Icon */}
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                  style={{
                    background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
                  }}
                >
                  <FileText className="w-6 h-6 text-white" />
                </div>

                {/* Form Title */}
                <h3 
                  className="text-lg font-semibold mb-2"
                  style={{ color: currentTheme.colors.text }}
                >
                  {form.title}
                </h3>

                {/* Form Description */}
                {form.description && (
                  <p 
                    className="text-sm mb-4 line-clamp-2"
                    style={{ color: currentTheme.colors.textSecondary }}
                  >
                    {form.description}
                  </p>
                )}

                {/* Form Stats */}
                <div className="flex items-center justify-between text-sm mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" style={{ color: currentTheme.colors.textSecondary }} />
                    <span style={{ color: currentTheme.colors.textSecondary }}>
                      {new Date(form.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BarChart3 className="w-4 h-4" style={{ color: currentTheme.colors.textSecondary }} />
                    <span style={{ color: currentTheme.colors.textSecondary }}>
                      {form.submissions} submissions
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Link href={`/forms/${form.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      style={{
                        borderColor: currentTheme.colors.border,
                        color: currentTheme.colors.textSecondary
                      }}
                      iconLeft={<Eye className="w-4 h-4" />}
                    >
                      View
                    </Button>
                  </Link>
                  <Link href={`/forms/${form.id}/edit`}>
                    <Button
                      variant="outline"
                      size="sm"
                      style={{
                        borderColor: currentTheme.colors.border,
                        color: currentTheme.colors.textSecondary
                      }}
                      iconLeft={<Edit className="w-4 h-4" />}
                    >
                      Edit
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 
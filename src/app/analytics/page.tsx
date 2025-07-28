'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText,
  Calendar,
  Eye,
  MousePointer
} from 'lucide-react'
import { FormTheme, getDefaultTheme } from '@/lib/constants/themes'
import { useAuth } from '@/lib/contexts/AuthContext'

interface AnalyticsData {
  totalForms: number
  totalSubmissions: number
  totalViews: number
  conversionRate: number
  recentActivity: Array<{
    id: string
    type: 'submission' | 'view' | 'form_created'
    title: string
    timestamp: string
    count?: number
  }>
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { isAuthenticated } = useAuth()
  const currentTheme = getDefaultTheme()

  // Demo data
  useEffect(() => {
    const demoData: AnalyticsData = {
      totalForms: 12,
      totalSubmissions: 1247,
      totalViews: 5432,
      conversionRate: 22.9,
      recentActivity: [
        {
          id: '1',
          type: 'submission',
          title: 'Contact Form received new submission',
          timestamp: '2 minutes ago',
          count: 1
        },
        {
          id: '2',
          type: 'view',
          title: 'Event Registration viewed',
          timestamp: '5 minutes ago',
          count: 3
        },
        {
          id: '3',
          type: 'form_created',
          title: 'New form "Customer Feedback" created',
          timestamp: '1 hour ago'
        },
        {
          id: '4',
          type: 'submission',
          title: 'Contact Form received new submission',
          timestamp: '2 hours ago',
          count: 1
        }
      ]
    }

    setTimeout(() => {
      setData(demoData)
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
            Sign in to view analytics
          </h2>
          <p 
            className="mb-6"
            style={{ color: currentTheme.colors.textSecondary }}
          >
            Create an account to access your form analytics
          </p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p style={{ color: currentTheme.colors.textSecondary }}>
            Loading analytics...
          </p>
        </div>
      </div>
    )
  }

  if (!data) return null

  const stats = [
    {
      title: 'Total Forms',
      value: data.totalForms,
      icon: FileText,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Total Submissions',
      value: data.totalSubmissions.toLocaleString(),
      icon: Users,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Total Views',
      value: data.totalViews.toLocaleString(),
      icon: Eye,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Conversion Rate',
      value: `${data.conversionRate}%`,
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600'
    }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'submission':
        return <Users className="w-4 h-4" />
      case 'view':
        return <Eye className="w-4 h-4" />
      case 'form_created':
        return <FileText className="w-4 h-4" />
      default:
        return <MousePointer className="w-4 h-4" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'submission':
        return 'text-green-500 bg-green-500/10'
      case 'view':
        return 'text-blue-500 bg-blue-500/10'
      case 'form_created':
        return 'text-purple-500 bg-purple-500/10'
      default:
        return 'text-gray-500 bg-gray-500/10'
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: currentTheme.colors.background }}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 
            className="text-3xl font-bold mb-2"
            style={{ color: currentTheme.colors.text }}
          >
            Analytics
          </h1>
          <p 
            className="text-lg"
            style={{ color: currentTheme.colors.textSecondary }}
          >
            Track your form performance and insights
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl"
                style={{
                  backgroundColor: `${currentTheme.colors.surface}CC`,
                  border: `1px solid ${currentTheme.colors.border}`,
                  borderRadius: currentTheme.borderRadius,
                  boxShadow: currentTheme.shadow !== 'none' ? currentTheme.shadow : undefined
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-r ${stat.color}`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 
                  className="text-2xl font-bold mb-1"
                  style={{ color: currentTheme.colors.text }}
                >
                  {stat.value}
                </h3>
                <p 
                  className="text-sm"
                  style={{ color: currentTheme.colors.textSecondary }}
                >
                  {stat.title}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-xl"
            style={{
              backgroundColor: `${currentTheme.colors.surface}CC`,
              border: `1px solid ${currentTheme.colors.border}`,
              borderRadius: currentTheme.borderRadius,
              boxShadow: currentTheme.shadow !== 'none' ? currentTheme.shadow : undefined
            }}
          >
            <h3 
              className="text-xl font-semibold mb-4"
              style={{ color: currentTheme.colors.text }}
            >
              Recent Activity
            </h3>
            <div className="space-y-4">
              {data.recentActivity.map((activity, index) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}
                  >
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p 
                      className="text-sm font-medium"
                      style={{ color: currentTheme.colors.text }}
                    >
                      {activity.title}
                    </p>
                    <p 
                      className="text-xs"
                      style={{ color: currentTheme.colors.textSecondary }}
                    >
                      {activity.timestamp}
                    </p>
                  </div>
                  {activity.count && (
                    <span 
                      className="text-xs font-medium px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: `${currentTheme.colors.primary}20`,
                        color: currentTheme.colors.primary
                      }}
                    >
                      +{activity.count}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 rounded-xl"
            style={{
              backgroundColor: `${currentTheme.colors.surface}CC`,
              border: `1px solid ${currentTheme.colors.border}`,
              borderRadius: currentTheme.borderRadius,
              boxShadow: currentTheme.shadow !== 'none' ? currentTheme.shadow : undefined
            }}
          >
            <h3 
              className="text-xl font-semibold mb-4"
              style={{ color: currentTheme.colors.text }}
            >
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button 
                className="w-full p-3 rounded-lg transition-colors duration-200 text-left"
                style={{
                  backgroundColor: `${currentTheme.colors.background}80`,
                  border: `1px solid ${currentTheme.colors.border}`,
                  color: currentTheme.colors.text
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${currentTheme.colors.primary}10`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = `${currentTheme.colors.background}80`
                }}
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5" style={{ color: currentTheme.colors.primary }} />
                  <span>Create New Form</span>
                </div>
              </button>
              <button 
                className="w-full p-3 rounded-lg transition-colors duration-200 text-left"
                style={{
                  backgroundColor: `${currentTheme.colors.background}80`,
                  border: `1px solid ${currentTheme.colors.border}`,
                  color: currentTheme.colors.text
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${currentTheme.colors.primary}10`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = `${currentTheme.colors.background}80`
                }}
              >
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-5 h-5" style={{ color: currentTheme.colors.primary }} />
                  <span>View Detailed Reports</span>
                </div>
              </button>
              <button 
                className="w-full p-3 rounded-lg transition-colors duration-200 text-left"
                style={{
                  backgroundColor: `${currentTheme.colors.background}80`,
                  border: `1px solid ${currentTheme.colors.border}`,
                  color: currentTheme.colors.text
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${currentTheme.colors.primary}10`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = `${currentTheme.colors.background}80`
                }}
              >
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5" style={{ color: currentTheme.colors.primary }} />
                  <span>Export Data</span>
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 
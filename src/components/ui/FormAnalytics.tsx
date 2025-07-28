// Form analytics component for tracking form performance

import { motion } from 'framer-motion'
import { 
  Eye, 
  Users, 
  TrendingUp, 
  Clock, 
  Calendar,
  BarChart3,
  Activity
} from 'lucide-react'

interface FormAnalyticsProps {
  formId: string
  views: number
  submissions: number
  conversionRate: number
  averageTime: number
  lastSubmission?: Date
  submissionsThisWeek: number
  submissionsThisMonth: number
}

export function FormAnalytics({
  formId,
  views,
  submissions,
  conversionRate,
  averageTime,
  lastSubmission,
  submissionsThisWeek,
  submissionsThisMonth
}: FormAnalyticsProps) {
  const metrics = [
    {
      label: 'Total Views',
      value: views.toLocaleString(),
      icon: Eye,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      label: 'Submissions',
      value: submissions.toLocaleString(),
      icon: Users,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    },
    {
      label: 'Conversion Rate',
      value: `${conversionRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    },
    {
      label: 'Avg. Time',
      value: `${averageTime}s`,
      icon: Clock,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20'
    }
  ]

  const recentActivity = [
    {
      label: 'This Week',
      value: submissionsThisWeek,
      icon: Calendar,
      color: 'text-blue-400'
    },
    {
      label: 'This Month',
      value: submissionsThisMonth,
      icon: BarChart3,
      color: 'text-green-400'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold">Form Analytics</h3>
            <p className="text-gray-400 text-sm">Performance metrics and insights</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`p-4 rounded-xl border ${metric.bgColor} ${metric.borderColor}`}
          >
            <div className="flex items-center justify-between mb-2">
              <metric.icon className={`w-5 h-5 ${metric.color}`} />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
            <div className="text-sm text-gray-400">{metric.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-6">
        <h4 className="text-white font-semibold mb-4">Recent Activity</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentActivity.map((activity) => (
            <div key={activity.label} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <activity.icon className={`w-5 h-5 ${activity.color}`} />
                <span className="text-gray-300">{activity.label}</span>
              </div>
              <span className="text-white font-semibold">{activity.value}</span>
            </div>
          ))}
        </div>
        
        {lastSubmission && (
          <div className="mt-4 p-3 bg-zinc-800/50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Last Submission</span>
              <span className="text-white font-semibold">
                {lastSubmission.toLocaleDateString()} at {lastSubmission.toLocaleTimeString()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Performance Insights */}
      <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-6">
        <h4 className="text-white font-semibold mb-4">Performance Insights</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Form Performance</span>
            <span className={`font-semibold ${
              conversionRate > 10 ? 'text-green-400' : 
              conversionRate > 5 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {conversionRate > 10 ? 'Excellent' : 
               conversionRate > 5 ? 'Good' : 'Needs Improvement'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Engagement Level</span>
            <span className={`font-semibold ${
              averageTime > 30 ? 'text-green-400' : 
              averageTime > 15 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {averageTime > 30 ? 'High' : 
               averageTime > 15 ? 'Medium' : 'Low'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Weekly Trend</span>
            <span className={`font-semibold ${
              submissionsThisWeek > submissionsThisMonth / 4 ? 'text-green-400' : 'text-yellow-400'
            }`}>
              {submissionsThisWeek > submissionsThisMonth / 4 ? '↗️ Growing' : '→ Stable'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
} 
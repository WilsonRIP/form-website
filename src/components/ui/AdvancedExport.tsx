// Advanced export component for exporting forms and submissions

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  FileCode, 
  FileJson,
  Calendar,
  Filter,
  X
} from 'lucide-react'
import { Button } from './Button'
import { FormSubmission } from '@/lib/types'

interface AdvancedExportProps {
  formId: string
  formTitle: string
  submissions: FormSubmission[]
  onClose: () => void
}

interface ExportOptions {
  format: 'csv' | 'excel' | 'json' | 'pdf'
  dateRange: {
    start: string
    end: string
  }
  includeFields: string[]
  excludeEmpty: boolean
  includeMetadata: boolean
}

export function AdvancedExport({ 
  formId, 
  formTitle, 
  submissions, 
  onClose 
}: AdvancedExportProps) {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    dateRange: {
      start: '',
      end: ''
    },
    includeFields: [],
    excludeEmpty: true,
    includeMetadata: true
  })

  const [isExporting, setIsExporting] = useState(false)

  const exportFormats = [
    {
      id: 'csv',
      name: 'CSV',
      description: 'Comma-separated values',
      icon: FileSpreadsheet,
      color: 'text-green-400'
    },
    {
      id: 'excel',
      name: 'Excel',
      description: 'Microsoft Excel format',
      icon: FileSpreadsheet,
      color: 'text-green-600'
    },
    {
      id: 'json',
      name: 'JSON',
      description: 'JavaScript Object Notation',
      icon: FileJson,
      color: 'text-yellow-400'
    },
    {
      id: 'pdf',
      name: 'PDF',
      description: 'Portable Document Format',
      icon: FileText,
      color: 'text-red-400'
    }
  ]

  const handleExport = async () => {
    setIsExporting(true)
    
    try {
      // Filter submissions based on date range
      let filteredSubmissions = submissions
      
      if (exportOptions.dateRange.start || exportOptions.dateRange.end) {
        filteredSubmissions = submissions.filter(submission => {
          const submissionDate = new Date(submission.submittedAt)
          const startDate = exportOptions.dateRange.start ? new Date(exportOptions.dateRange.start) : null
          const endDate = exportOptions.dateRange.end ? new Date(exportOptions.dateRange.end) : null
          
          if (startDate && submissionDate < startDate) return false
          if (endDate && submissionDate > endDate) return false
          return true
        })
      }

      // Export based on format
      switch (exportOptions.format) {
        case 'csv':
          exportToCSV(filteredSubmissions)
          break
        case 'excel':
          exportToExcel(filteredSubmissions)
          break
        case 'json':
          exportToJSON(filteredSubmissions)
          break
        case 'pdf':
          exportToPDF(filteredSubmissions)
          break
      }
      
      onClose()
    } catch (error) {
      console.error('Export error:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const exportToCSV = (data: FormSubmission[]) => {
    if (data.length === 0) return

    const headers = ['Submission ID', 'Submitted At', ...Object.keys(data[0]?.data || {})]
    const csvContent = [
      headers.join(','),
      ...data.map(submission => [
        submission.id,
        submission.submittedAt,
        ...Object.values(submission.data)
      ].join(','))
    ].join('\n')

    downloadFile(csvContent, `${formTitle}_submissions.csv`, 'text/csv')
  }

  const exportToExcel = (data: FormSubmission[]) => {
    // This would typically use a library like xlsx
    console.log('Excel export:', data)
    // For now, we'll export as CSV
    exportToCSV(data)
  }

  const exportToJSON = (data: FormSubmission[]) => {
    const jsonContent = JSON.stringify(data, null, 2)
    downloadFile(jsonContent, `${formTitle}_submissions.json`, 'application/json')
  }

  const exportToPDF = (data: FormSubmission[]) => {
    // This would typically use a library like jsPDF
    console.log('PDF export:', data)
    // For now, we'll show a message
    alert('PDF export feature coming soon!')
  }

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div className="bg-zinc-900/95 backdrop-blur-sm border border-zinc-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white text-xl font-semibold">Export Data</h3>
              <p className="text-gray-400 text-sm">Export "{formTitle}" submissions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Export Format Selection */}
        <div className="mb-6">
          <h4 className="text-white font-semibold mb-3">Export Format</h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {exportFormats.map((format) => (
              <button
                key={format.id}
                onClick={() => setExportOptions({ ...exportOptions, format: format.id as any })}
                className={`p-4 rounded-lg border transition-all duration-200 text-left ${
                  exportOptions.format === format.id
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-zinc-700 hover:border-zinc-600 bg-zinc-800/50'
                }`}
              >
                <format.icon className={`w-6 h-6 ${format.color} mb-2`} />
                <div className="font-medium text-white">{format.name}</div>
                <div className="text-sm text-gray-400">{format.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="mb-6">
          <h4 className="text-white font-semibold mb-3">Date Range</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={exportOptions.dateRange.start}
                onChange={(e) => setExportOptions({
                  ...exportOptions,
                  dateRange: { ...exportOptions.dateRange, start: e.target.value }
                })}
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={exportOptions.dateRange.end}
                onChange={(e) => setExportOptions({
                  ...exportOptions,
                  dateRange: { ...exportOptions.dateRange, end: e.target.value }
                })}
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="mb-6">
          <h4 className="text-white font-semibold mb-3">Export Options</h4>
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={exportOptions.excludeEmpty}
                onChange={(e) => setExportOptions({ ...exportOptions, excludeEmpty: e.target.checked })}
                className="w-4 h-4 text-blue-500 bg-zinc-700 border-zinc-600 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-white">Exclude empty submissions</span>
            </label>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={exportOptions.includeMetadata}
                onChange={(e) => setExportOptions({ ...exportOptions, includeMetadata: e.target.checked })}
                className="w-4 h-4 text-blue-500 bg-zinc-700 border-zinc-600 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-white">Include metadata (ID, timestamp)</span>
            </label>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-zinc-800/30 border border-zinc-700 rounded-lg p-4 mb-6">
          <h4 className="text-white font-semibold mb-2">Export Summary</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Format:</span>
              <span className="text-white">{exportFormats.find(f => f.id === exportOptions.format)?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Submissions:</span>
              <span className="text-white">{submissions.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Date Range:</span>
              <span className="text-white">
                {exportOptions.dateRange.start || 'All time'} - {exportOptions.dateRange.end || 'Now'}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isExporting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleExport}
            loading={isExporting}
            icon={isExporting ? undefined : <Download className="w-4 h-4" />}
          >
            {isExporting ? 'Exporting...' : 'Export Data'}
          </Button>
        </div>
      </div>
    </motion.div>
  )
} 
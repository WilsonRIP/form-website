"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Download, FileText, CheckSquare, Calendar, BarChart3 } from "lucide-react"
import { exportToCSV, downloadCSV, generateSubmissionStats } from "@/lib/export-utils"
import { FormField } from "@/lib/types"

interface ExportSubmissionsProps {
  submissions: any[]
  fields: FormField[]
  formTitle: string
}

export function ExportSubmissions({ submissions, fields, formTitle }: ExportSubmissionsProps) {
  const [showExportModal, setShowExportModal] = useState(false)
  const [includeMetadata, setIncludeMetadata] = useState(true)
  const [isExporting, setIsExporting] = useState(false)

  const stats = generateSubmissionStats(submissions)

  const handleExport = async () => {
    setIsExporting(true)
    
    try {
      const csvContent = exportToCSV(submissions, fields, formTitle, {
        format: 'csv',
        includeMetadata
      })
      
      const filename = `${formTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_submissions_${new Date().toISOString().split('T')[0]}.csv`
      downloadCSV(csvContent, filename)
      
      // Close modal after successful export
      setTimeout(() => {
        setShowExportModal(false)
        setIsExporting(false)
      }, 1000)
    } catch (error) {
      console.error('Export failed:', error)
      setIsExporting(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowExportModal(true)}
        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        <Download className="w-4 h-4" />
        <span>Export</span>
      </button>

      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            className="bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 rounded-xl p-6 max-w-md w-full mx-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Download className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">Export Submissions</h3>
                <p className="text-gray-400 text-sm">Download form data as CSV</p>
              </div>
            </div>

            {/* Stats Preview */}
            <div className="bg-zinc-800/50 rounded-lg p-4 mb-6">
              <h4 className="text-white font-medium mb-3">Export Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300">Total: {stats.total}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckSquare className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Approved: {stats.approved}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-yellow-400" />
                  <span className="text-gray-300">Pending: {stats.pending}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                  <span className="text-gray-300">Recent: {stats.recentSubmissions}</span>
                </div>
              </div>
            </div>

            {/* Export Options */}
            <div className="space-y-4 mb-6">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeMetadata}
                  onChange={(e) => setIncludeMetadata(e.target.checked)}
                  className="w-4 h-4 text-green-600 bg-zinc-800 border-zinc-700 rounded focus:ring-green-500 focus:ring-2"
                />
                <span className="text-gray-300 text-sm">
                  Include review metadata (review date, notes)
                </span>
              </label>
            </div>

            {/* File Info */}
            <div className="bg-zinc-800/30 rounded-lg p-3 mb-6">
              <div className="text-sm text-gray-400">
                <p>• CSV format with UTF-8 encoding</p>
                <p>• Includes all form fields and responses</p>
                <p>• Compatible with Excel, Google Sheets, and other tools</p>
                {includeMetadata && (
                  <p>• Includes review status and notes</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => setShowExportModal(false)}
                className="flex-1 bg-zinc-800 text-white font-medium py-2 px-4 rounded-lg hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                disabled={isExporting || submissions.length === 0}
                className="flex-1 bg-green-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
              >
                {isExporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Export CSV</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
} 
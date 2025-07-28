import { FormField } from "./types"

export interface ExportOptions {
  format: 'csv' | 'excel'
  includeMetadata?: boolean
  dateFormat?: string
}

export function exportToCSV(
  submissions: any[],
  fields: FormField[],
  formTitle: string,
  options: ExportOptions = { format: 'csv' }
): string {
  const headers = ['Submission ID', 'Submitted At', 'Status']
  
  // Add field headers
  fields.forEach(field => {
    headers.push(field.label)
  })
  
  // Add optional metadata headers
  if (options.includeMetadata) {
    headers.push('Reviewed At', 'Review Notes')
  }

  const rows = submissions.map(submission => {
    const row = [
      submission.id,
      new Date(submission.submittedAt).toLocaleString(),
      submission.status || 'pending'
    ]

    // Parse submission data
    let parsedData
    try {
      parsedData = typeof submission.data === 'string' ? JSON.parse(submission.data) : submission.data
    } catch {
      parsedData = {}
    }

    // Add field values
    fields.forEach(field => {
      const value = parsedData[field.label]
      if (Array.isArray(value)) {
        row.push(value.join(', '))
      } else if (value) {
        row.push(String(value))
      } else {
        row.push('')
      }
    })

    // Add optional metadata
    if (options.includeMetadata) {
      row.push(
        submission.reviewedAt ? new Date(submission.reviewedAt).toLocaleString() : '',
        submission.reviewNotes || ''
      )
    }

    return row
  })

  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...rows.map(row => 
      row.map(cell => 
        typeof cell === 'string' && cell.includes(',') 
          ? `"${cell.replace(/"/g, '""')}"` 
          : cell
      ).join(',')
    )
  ].join('\n')

  return csvContent
}

export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export function generateSubmissionStats(submissions: any[]): {
  total: number
  pending: number
  approved: number
  denied: number
  recentSubmissions: number
  averageResponseTime?: number
} {
  const now = new Date()
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const stats: {
    total: number
    pending: number
    approved: number
    denied: number
    recentSubmissions: number
    averageResponseTime?: number
  } = {
    total: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    denied: submissions.filter(s => s.status === 'denied').length,
    recentSubmissions: submissions.filter(s => 
      new Date(s.submittedAt) > oneWeekAgo
    ).length
  }

  // Calculate average response time for reviewed submissions
  const reviewedSubmissions = submissions.filter(s => s.reviewedAt && s.submittedAt)
  if (reviewedSubmissions.length > 0) {
    const totalResponseTime = reviewedSubmissions.reduce((total, submission) => {
      const submitted = new Date(submission.submittedAt)
      const reviewed = new Date(submission.reviewedAt)
      return total + (reviewed.getTime() - submitted.getTime())
    }, 0)
    
    stats.averageResponseTime = totalResponseTime / reviewedSubmissions.length
  }

  return stats
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function validateFileUpload(file: File, maxSize: number = 10 * 1024 * 1024): {
  valid: boolean
  error?: string
} {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif'
  ]

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'File type not allowed. Please upload PDF, DOC, DOCX, TXT, JPG, PNG, or GIF files.'
    }
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size too large. Maximum size is ${formatFileSize(maxSize)}.`
    }
  }

  return { valid: true }
} 
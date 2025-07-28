"use client"

import { useParams } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Users, Calendar, FileText, CheckCircle, XCircle, MessageSquare, Eye, Trash2 } from "lucide-react"
import { ExportSubmissions } from "@/app/components/export-submissions"
import Link from "next/link"
import { formApi } from "@/lib/api"

export default function FormSubmissionsPage() {
  const params = useParams()
  const formId = parseInt(params.id as string)
  const queryClient = useQueryClient()
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null)
  const [reviewNotes, setReviewNotes] = useState("")
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewAction, setReviewAction] = useState<"approve" | "deny" | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [viewingSubmission, setViewingSubmission] = useState<any>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingSubmission, setDeletingSubmission] = useState<any>(null)

  const { data: form, isLoading: formLoading } = useQuery({
    queryKey: ["form", formId],
    queryFn: () => formApi.getById(formId),
    enabled: !!formId,
  })

  const { data: submissions, isLoading: submissionsLoading } = useQuery({
    queryKey: ["submissions", formId],
    queryFn: () => formApi.getSubmissions(formId),
    enabled: !!formId,
  })

  const { mutate: approveSubmission, isPending: isApproving } = useMutation({
    mutationFn: ({ submissionId, notes }: { submissionId: number; notes?: string }) =>
      formApi.approveSubmission(submissionId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions", formId] })
      setShowReviewModal(false)
      setReviewNotes("")
      setSelectedSubmission(null)
    },
  })

  const { mutate: denySubmission, isPending: isDenying } = useMutation({
    mutationFn: ({ submissionId, notes }: { submissionId: number; notes?: string }) =>
      formApi.denySubmission(submissionId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions", formId] })
      setShowReviewModal(false)
      setReviewNotes("")
      setSelectedSubmission(null)
    },
  })

  const { mutate: deleteSubmission, isPending: isDeleting } = useMutation({
    mutationFn: (submissionId: number) => formApi.deleteSubmission(submissionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions", formId] })
      setShowDeleteModal(false)
      setDeletingSubmission(null)
    },
  })

  const handleReview = (submission: any, action: "approve" | "deny") => {
    setSelectedSubmission(submission)
    setReviewAction(action)
    setShowReviewModal(true)
  }

  const submitReview = () => {
    if (!selectedSubmission) return

    if (reviewAction === "approve") {
      approveSubmission({ submissionId: selectedSubmission.id, notes: reviewNotes })
    } else if (reviewAction === "deny") {
      denySubmission({ submissionId: selectedSubmission.id, notes: reviewNotes })
    }
  }

  const handleViewSubmission = (submission: any) => {
    setViewingSubmission(submission)
    setShowViewModal(true)
  }

  const handleDeleteSubmission = (submission: any) => {
    setDeletingSubmission(submission)
    setShowDeleteModal(true)
  }

  if (formLoading || submissionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-400">Form not found</div>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex-col relative isolate">
      <div className="absolute inset-0 -z-10 opacity-50 mix-blend-soft-light bg-[url('/noise.svg')] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
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
              <h1 className="text-white text-3xl font-semibold">Form Submissions</h1>
              <p className="text-gray-400">{form.title}</p>
            </div>
          </div>
          
          {/* Export Button */}
          <ExportSubmissions
            submissions={submissions || []}
            fields={form.fields || []}
            formTitle={form.title}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Submissions</p>
                <p className="text-white text-2xl font-semibold">
                  {submissions?.length || 0}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <FileText className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Form Fields</p>
                <p className="text-white text-2xl font-semibold">
                  {form.fields?.length || 0}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Created</p>
                <p className="text-white text-sm">
                  {new Date(form.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Submissions List */}
        <div className="space-y-6">
          <h2 className="text-white text-xl font-semibold">Recent Submissions</h2>
          
          {submissions && submissions.length > 0 ? (
            <div className="space-y-4">
              {submissions.map((submission: any, index: number) => (
                <motion.div
                  key={submission.id}
                  className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <span className="text-blue-400 text-sm font-medium">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          Submission #{submission.id}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {new Date(submission.submittedAt).toLocaleString()}
                        </p>
                        {/* Status Badge */}
                        <div className="mt-1">
                          {submission.status === "pending" && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
                              Pending Review
                            </span>
                          )}
                          {submission.status === "approved" && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                              Approved
                            </span>
                          )}
                          {submission.status === "denied" && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
                              Denied
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewSubmission(submission)}
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {submission.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleReview(submission, "approve")}
                            className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-lg transition-colors"
                            title="Approve"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReview(submission, "deny")}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Deny"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDeleteSubmission(submission)}
                        className="p-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Show first 3 fields as preview */}
                    {form.fields?.slice(0, 3).map((field: any) => {
                      let parsedData
                      try {
                        parsedData = typeof submission.data === 'string' ? JSON.parse(submission.data) : submission.data
                      } catch (error) {
                        console.error('Error parsing submission data:', error)
                        return null
                      }
                      const fieldData = parsedData[field.label]
                      if (!fieldData) return null
                      
                      return (
                        <div key={field.id} className="flex flex-col space-y-1">
                          <label className="text-gray-400 text-sm font-medium">
                            {field.label}
                          </label>
                          <div className="text-white bg-zinc-800/50 rounded-lg px-3 py-2">
                            {Array.isArray(fieldData) ? fieldData.join(", ") : fieldData}
                          </div>
                        </div>
                      )
                    })}
                    
                    {/* Show "View more" if there are more fields */}
                    {form.fields && form.fields.length > 3 && (
                      <div className="text-center pt-2">
                        <button
                          onClick={() => handleViewSubmission(submission)}
                          className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                        >
                          View all {form.fields.length} responses →
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-gray-500 mb-4">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No submissions yet</p>
                <p className="text-sm mt-2">Share your form to start collecting responses</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            className="bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 rounded-xl p-6 max-w-md w-full mx-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <h3 className="text-white text-lg font-semibold mb-4">
              {reviewAction === "approve" ? "Approve" : "Deny"} Submission
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Review Notes (Optional)
              </label>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                placeholder="Add notes about your decision..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="flex-1 bg-zinc-800 text-white font-medium py-2 px-4 rounded-lg hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitReview}
                disabled={isApproving || isDenying}
                className={`flex-1 font-medium py-2 px-4 rounded-lg transition-colors ${
                  reviewAction === "approve"
                    ? "bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                    : "bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                }`}
              >
                {isApproving || isDenying ? "Processing..." : reviewAction === "approve" ? "Approve" : "Deny"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* View Submission Modal */}
      {showViewModal && viewingSubmission && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            className="bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white text-xl font-semibold">
                Submission #{viewingSubmission.id} Details
              </h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>

            {/* Submission Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <h4 className="text-gray-400 text-sm font-medium mb-2">Submission Info</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">ID:</span>
                    <span className="text-white">#{viewingSubmission.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Submitted:</span>
                    <span className="text-white">
                      {viewingSubmission.submittedAt ? new Date(viewingSubmission.submittedAt).toLocaleString() : "Unknown"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className={`${
                      viewingSubmission.status === "pending" ? "text-yellow-400" :
                      viewingSubmission.status === "approved" ? "text-green-400" :
                      "text-red-400"
                    }`}>
                      {viewingSubmission.status.charAt(0).toUpperCase() + viewingSubmission.status.slice(1)}
                    </span>
                  </div>
                  {viewingSubmission.reviewedAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Reviewed:</span>
                      <span className="text-white">
                        {new Date(viewingSubmission.reviewedAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {viewingSubmission.reviewNotes && (
                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <h4 className="text-gray-400 text-sm font-medium mb-2">Review Notes</h4>
                  <p className="text-white text-sm">{viewingSubmission.reviewNotes}</p>
                </div>
              )}
            </div>

            {/* Form Data */}
            <div className="space-y-4">
              <h4 className="text-white text-lg font-semibold">Form Responses</h4>
              <div className="space-y-4">
                {form?.fields?.map((field: any) => {
                  let parsedData
                  try {
                    parsedData = typeof viewingSubmission.data === 'string' ? JSON.parse(viewingSubmission.data) : viewingSubmission.data
                  } catch (error) {
                    console.error('Error parsing submission data:', error)
                    return null
                  }
                  const fieldData = parsedData[field.label]
                  if (!fieldData) return null
                  
                  return (
                    <div key={field.id} className="bg-zinc-800/50 rounded-lg p-4">
                      <label className="text-gray-400 text-sm font-medium mb-2 block">
                        {field.label}
                        {field.required && <span className="text-red-400 ml-1">*</span>}
                      </label>
                      <div className="text-white">
                        {Array.isArray(fieldData) ? (
                          <div className="space-y-1">
                            {fieldData.map((item: string, index: number) => (
                              <div key={index} className="bg-zinc-700/50 rounded px-3 py-2">
                                {item}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-zinc-700/50 rounded px-3 py-2">
                            {fieldData}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 mt-6 pt-6 border-t border-zinc-700">
              {viewingSubmission.status === "pending" && (
                <>
                  <button
                    onClick={() => {
                      setShowViewModal(false)
                      handleReview(viewingSubmission, "approve")
                    }}
                    className="flex-1 bg-green-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Approve Submission
                  </button>
                  <button
                    onClick={() => {
                      setShowViewModal(false)
                      handleReview(viewingSubmission, "deny")
                    }}
                    className="flex-1 bg-red-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Deny Submission
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  setShowViewModal(false)
                  handleDeleteSubmission(viewingSubmission)
                }}
                className="flex-1 bg-red-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Submission
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingSubmission && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            className="bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 rounded-xl p-6 max-w-md w-full mx-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-white text-lg font-semibold">Delete Submission</h3>
            </div>
            
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete submission #{deletingSubmission.id}? This action cannot be undone.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-zinc-800 text-white font-medium py-2 px-4 rounded-lg hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteSubmission(deletingSubmission.id)}
                disabled={isDeleting}
                className="flex-1 bg-red-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  )
} 
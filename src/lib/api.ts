import { client } from "./client"

export const formApi = {
  // Get all forms
  getAll: async () => {
    const res = await client.form.getAll.$get()
    return await res.json()
  },

  // Get form by ID
  getById: async (id: number) => {
    const res = await client.form.getById.$get({ id })
    return await res.json()
  },

  // Create new form
  create: async (data: {
    title: string
    description?: string
    webhookUrl?: string
    webhookEnabled: boolean
    userId?: number
    fields: Array<{
      type: "text" | "textarea" | "email" | "number" | "select" | "multiselect" | "checkbox" | "radio" | "date"
      label: string
      placeholder?: string
      required: boolean
      options?: string[]
      order: number
    }>
  }) => {
    const res = await client.form.create.$post(data)
    return await res.json()
  },

  // Submit form
  submit: async (data: { formId: number; data: Record<string, any> }) => {
    const res = await client.form.submit.$post(data)
    return await res.json()
  },

  // Get form submissions
  getSubmissions: async (formId: number) => {
    const res = await client.form.getSubmissions.$get({ formId })
    return await res.json()
  },

  // Approve submission
  approveSubmission: async (submissionId: number, notes?: string) => {
    const res = await client.form.approveSubmission.$post({ submissionId, notes })
    return await res.json()
  },

  // Deny submission
  denySubmission: async (submissionId: number, notes?: string) => {
    const res = await client.form.denySubmission.$post({ submissionId, notes })
    return await res.json()
  },

  // Delete submission
  deleteSubmission: async (submissionId: number) => {
    const res = await client.form.deleteSubmission.$post({ submissionId })
    return await res.json()
  },

  // Update form
  update: async (formData: {
    id: number
    title: string
    description?: string
    webhookUrl?: string
    webhookEnabled: boolean
    userId?: number
    fields: Array<{
      type: "text" | "textarea" | "email" | "number" | "select" | "multiselect" | "checkbox" | "radio" | "date"
      label: string
      placeholder?: string
      required: boolean
      options?: string[]
      order: number
    }>
  }) => {
    const res = await client.form.update.$post(formData)
    return await res.json()
  },

  // Test webhook
  testWebhook: async (webhookUrl: string) => {
    const res = await client.form.testWebhook.$post({ webhookUrl })
    return await res.json()
  },
} 
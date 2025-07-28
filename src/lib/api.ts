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
    fields: Array<{
      type: "text" | "textarea" | "email" | "number" | "select" | "checkbox" | "radio" | "date"
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
} 
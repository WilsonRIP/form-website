export type FieldType = 
  | "text" 
  | "textarea" 
  | "email" 
  | "number" 
  | "select" 
  | "checkbox" 
  | "radio" 
  | "date"

export interface FormField {
  id: string
  type: FieldType
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
  order: number
}

export interface Form {
  id: string
  title: string
  description?: string
  fields: FormField[]
  createdAt: Date
  updatedAt: Date
}

export interface FormSubmission {
  id: string
  formId: string
  data: Record<string, any>
  submittedAt: Date
} 
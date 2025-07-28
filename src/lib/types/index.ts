// Core type definitions for the application

import { FIELD_TYPES } from '@/lib/constants'

// Field Types
export type FieldType = typeof FIELD_TYPES[keyof typeof FIELD_TYPES]

export interface FormField {
  id: string
  type: FieldType
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
  order: number
}

// Form Types
export interface Form {
  id: string
  title: string
  description?: string
  fields: FormField[]
  webhookUrl?: string
  webhookEnabled: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateFormData {
  title: string
  description?: string
  fields: Omit<FormField, 'id'>[]
  webhookUrl?: string
  webhookEnabled: boolean
}

export interface UpdateFormData extends Partial<CreateFormData> {
  id: string
}

// Submission Types
export interface FormSubmission {
  id: string
  formId: string
  data: Record<string, any>
  submittedAt: Date
}

export interface CreateSubmissionData {
  formId: number
  data: Record<string, any>
}

// Template Types
export interface FormTemplate {
  id: string
  name: string
  description: string
  category: string
  icon: string
  fields: FormField[]
  color: string
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// UI Types
export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

export interface LoadingState {
  isLoading: boolean
  error?: string
}

// Form Builder Types
export interface FormBuilderState {
  fields: FormField[]
  formTitle: string
  formDescription: string
  webhookUrl: string
  webhookEnabled: boolean
}

export interface DragItem {
  id: string
  type: string
  field?: FormField
}

// Validation Types
export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

// Webhook Types
export interface WebhookConfig {
  url: string
  enabled: boolean
  events: string[]
}

export interface WebhookPayload {
  event: string
  formId: string
  data: any
  timestamp: string
}

// Theme Types
export interface Theme {
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    textSecondary: string
    border: string
    error: string
    success: string
    warning: string
    info: string
  }
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

// Event Types
export interface FormEvent {
  type: 'field_added' | 'field_updated' | 'field_deleted' | 'field_reordered' | 'form_saved' | 'template_applied'
  data: any
  timestamp: string
}

// Analytics Types
export interface AnalyticsEvent {
  event: string
  properties: Record<string, any>
  timestamp: string
  userId?: string
  sessionId?: string
} 
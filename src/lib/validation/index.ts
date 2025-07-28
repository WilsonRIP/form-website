// Validation utilities for forms and form fields

import { FormField, ValidationResult, ValidationError } from '@/lib/types'
import { ERROR_MESSAGES, VALIDATION_RULES, APP_CONFIG } from '@/lib/constants'

// Form validation
export function validateForm(data: {
  title: string
  description?: string
  fields: FormField[]
}): ValidationResult {
  const errors: ValidationError[] = []

  // Validate title
  if (!data.title.trim()) {
    errors.push({ field: 'title', message: ERROR_MESSAGES.FORM_TITLE_REQUIRED })
  } else if (data.title.length > APP_CONFIG.maxFormTitleLength) {
    errors.push({ field: 'title', message: ERROR_MESSAGES.FORM_TITLE_TOO_LONG })
  }

  // Validate description
  if (data.description && data.description.length > APP_CONFIG.maxFormDescriptionLength) {
    errors.push({ field: 'description', message: ERROR_MESSAGES.FORM_DESCRIPTION_TOO_LONG })
  }

  // Validate fields
  if (data.fields.length === 0) {
    errors.push({ field: 'fields', message: 'At least one field is required' })
  } else if (data.fields.length > APP_CONFIG.maxFormFields) {
    errors.push({ field: 'fields', message: ERROR_MESSAGES.TOO_MANY_FIELDS })
  }

  // Validate individual fields
  data.fields.forEach((field, index) => {
    const fieldErrors = validateFormField(field, index)
    errors.push(...fieldErrors)
  })

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Field validation
export function validateFormField(field: FormField, index: number): ValidationError[] {
  const errors: ValidationError[] = []

  // Validate label
  if (!field.label.trim()) {
    errors.push({ 
      field: `fields[${index}].label`, 
      message: ERROR_MESSAGES.FIELD_LABEL_REQUIRED 
    })
  } else if (field.label.length > APP_CONFIG.maxFieldLabelLength) {
    errors.push({ 
      field: `fields[${index}].label`, 
      message: ERROR_MESSAGES.FIELD_LABEL_TOO_LONG 
    })
  }

  // Validate placeholder
  if (field.placeholder && field.placeholder.length > APP_CONFIG.maxFieldPlaceholderLength) {
    errors.push({ 
      field: `fields[${index}].placeholder`, 
      message: ERROR_MESSAGES.FIELD_PLACEHOLDER_TOO_LONG 
    })
  }

  // Validate options for select, multiselect, checkbox, and radio fields
  if (['select', 'multiselect', 'checkbox', 'radio'].includes(field.type) && field.options) {
    if (field.options.length === 0) {
      errors.push({ 
        field: `fields[${index}].options`, 
        message: 'At least one option is required for this field type' 
      })
    } else if (field.options.length > APP_CONFIG.maxOptionsPerField) {
      errors.push({ 
        field: `fields[${index}].options`, 
        message: ERROR_MESSAGES.TOO_MANY_OPTIONS 
      })
    } else {
      // Validate individual options
      field.options.forEach((option, optionIndex) => {
        if (!option.trim()) {
          errors.push({ 
            field: `fields[${index}].options[${optionIndex}]`, 
            message: 'Option cannot be empty' 
          })
        } else if (option.length > APP_CONFIG.maxOptionLength) {
          errors.push({ 
            field: `fields[${index}].options[${optionIndex}]`, 
            message: ERROR_MESSAGES.OPTION_TOO_LONG 
          })
        }
      })
    }
  }

  return errors
}

// Input validation
export function validateInput(value: string, type: string, required: boolean = false): ValidationResult {
  const errors: ValidationError[] = []

  // Check if required field is empty
  if (required && (!value || value.trim() === '')) {
    errors.push({ field: 'input', message: ERROR_MESSAGES.REQUIRED_FIELD })
    return { isValid: false, errors }
  }

  // Skip validation for empty non-required fields
  if (!value || value.trim() === '') {
    return { isValid: true, errors: [] }
  }

  // Type-specific validation
  switch (type) {
    case 'email':
      if (!VALIDATION_RULES.email.test(value)) {
        errors.push({ field: 'input', message: ERROR_MESSAGES.INVALID_EMAIL })
      }
      break

    case 'url':
      if (!VALIDATION_RULES.url.test(value)) {
        errors.push({ field: 'input', message: ERROR_MESSAGES.INVALID_URL })
      }
      break

    case 'number':
      if (isNaN(Number(value))) {
        errors.push({ field: 'input', message: 'Please enter a valid number' })
      }
      break

    case 'phone':
      if (!VALIDATION_RULES.phone.test(value.replace(/\s/g, ''))) {
        errors.push({ field: 'input', message: 'Please enter a valid phone number' })
      }
      break
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Webhook URL validation
export function validateWebhookUrl(url: string): ValidationResult {
  const errors: ValidationError[] = []

  if (!url.trim()) {
    return { isValid: true, errors: [] } // Empty URL is valid (optional)
  }

  try {
    const urlObj = new URL(url)
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      errors.push({ field: 'webhookUrl', message: 'Webhook URL must use HTTP or HTTPS protocol' })
    }
  } catch {
    errors.push({ field: 'webhookUrl', message: ERROR_MESSAGES.INVALID_URL })
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Real-time validation helpers
export function getFieldValidationState(
  field: FormField,
  value: string,
  touched: boolean = false
): 'valid' | 'invalid' | 'neutral' {
  if (!touched) return 'neutral'
  
  const validation = validateInput(value, field.type, field.required)
  return validation.isValid ? 'valid' : 'invalid'
}

// Debounced validation for real-time feedback
export function debounceValidation<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

// Validation error formatter
export function formatValidationErrors(errors: ValidationError[]): Record<string, string> {
  return errors.reduce((acc, error) => {
    acc[error.field] = error.message
    return acc
  }, {} as Record<string, string>)
}

// Field type validation
export function isValidFieldType(type: string): type is string {
  return ['text', 'textarea', 'email', 'number', 'select', 'multiselect', 'checkbox', 'radio', 'date', 'file'].includes(type)
}

// Form submission validation
export function validateFormSubmission(
  formFields: FormField[],
  submissionData: Record<string, any>
): ValidationResult {
  const errors: ValidationError[] = []

  formFields.forEach(field => {
    const value = submissionData[field.id]
    const validation = validateInput(value, field.type, field.required)
    
    if (!validation.isValid) {
      errors.push(...validation.errors.map(error => ({
        field: field.id,
        message: error.message
      })))
    }
  })

  return {
    isValid: errors.length === 0,
    errors
  }
} 
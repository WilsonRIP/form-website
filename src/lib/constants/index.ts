// App-wide constants and configuration

export const APP_CONFIG = {
  name: 'Form Builder',
  version: '1.0.0',
  description: 'Create beautiful forms with drag-and-drop ease',
  maxHistorySize: 50,
  maxFormFields: 100,
  maxFormTitleLength: 100,
  maxFormDescriptionLength: 500,
  maxFieldLabelLength: 100,
  maxFieldPlaceholderLength: 200,
  maxOptionsPerField: 20,
  maxOptionLength: 50,
} as const

export const FIELD_TYPES = {
  text: 'text',
  textarea: 'textarea',
  email: 'email',
  number: 'number',
  select: 'select',
  checkbox: 'checkbox',
  radio: 'radio',
  date: 'date',
  file: 'file',
  phone: 'phone',
  url: 'url',
  password: 'password',
  rating: 'rating',
  signature: 'signature',
  time: 'time',
  datetime: 'datetime',
  color: 'color',
  range: 'range',
} as const

export const FIELD_TYPE_LABELS = {
  [FIELD_TYPES.text]: 'Text Input',
  [FIELD_TYPES.textarea]: 'Text Area',
  [FIELD_TYPES.email]: 'Email Input',
  [FIELD_TYPES.number]: 'Number Input',
  [FIELD_TYPES.select]: 'Dropdown Select',
  [FIELD_TYPES.checkbox]: 'Checkbox Group',
  [FIELD_TYPES.radio]: 'Radio Group',
  [FIELD_TYPES.date]: 'Date Picker',
  [FIELD_TYPES.file]: 'File Upload',
  [FIELD_TYPES.phone]: 'Phone Number',
  [FIELD_TYPES.url]: 'URL Input',
  [FIELD_TYPES.password]: 'Password Input',
  [FIELD_TYPES.rating]: 'Rating',
  [FIELD_TYPES.signature]: 'Signature',
  [FIELD_TYPES.time]: 'Time Picker',
  [FIELD_TYPES.datetime]: 'Date & Time',
  [FIELD_TYPES.color]: 'Color Picker',
  [FIELD_TYPES.range]: 'Range Slider',
} as const

export const FIELD_TYPE_ICONS = {
  [FIELD_TYPES.text]: '📝',
  [FIELD_TYPES.textarea]: '📄',
  [FIELD_TYPES.email]: '📧',
  [FIELD_TYPES.number]: '🔢',
  [FIELD_TYPES.select]: '📋',
  [FIELD_TYPES.checkbox]: '☑️',
  [FIELD_TYPES.radio]: '🔘',
  [FIELD_TYPES.date]: '📅',
  [FIELD_TYPES.file]: '📎',
  [FIELD_TYPES.phone]: '📞',
  [FIELD_TYPES.url]: '🔗',
  [FIELD_TYPES.password]: '🔒',
  [FIELD_TYPES.rating]: '⭐',
  [FIELD_TYPES.signature]: '✍️',
  [FIELD_TYPES.time]: '⏰',
  [FIELD_TYPES.datetime]: '📅⏰',
  [FIELD_TYPES.color]: '🎨',
  [FIELD_TYPES.range]: '📊',
} as const

export const TEMPLATE_CATEGORIES = {
  BUSINESS: 'Business',
  RESEARCH: 'Research',
  EVENTS: 'Events',
  FEEDBACK: 'Feedback',
} as const

export const API_ENDPOINTS = {
  forms: '/api/forms',
  submissions: '/api/submissions',
  webhooks: '/api/webhooks',
} as const

export const ERROR_MESSAGES = {
  FORM_TITLE_REQUIRED: 'Form title is required',
  FORM_TITLE_TOO_LONG: 'Form title is too long',
  FORM_DESCRIPTION_TOO_LONG: 'Form description is too long',
  FIELD_LABEL_REQUIRED: 'Field label is required',
  FIELD_LABEL_TOO_LONG: 'Field label is too long',
  FIELD_PLACEHOLDER_TOO_LONG: 'Field placeholder is too long',
  TOO_MANY_FIELDS: 'Maximum number of fields reached',
  TOO_MANY_OPTIONS: 'Maximum number of options reached',
  OPTION_TOO_LONG: 'Option text is too long',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_URL: 'Please enter a valid URL',
  REQUIRED_FIELD: 'This field is required',
  NETWORK_ERROR: 'Network error. Please try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
} as const

export const SUCCESS_MESSAGES = {
  FORM_SAVED: 'Form saved successfully!',
  FORM_DELETED: 'Form deleted successfully!',
  FIELD_ADDED: 'Field added successfully!',
  FIELD_UPDATED: 'Field updated successfully!',
  FIELD_DELETED: 'Field deleted successfully!',
  TEMPLATE_APPLIED: 'Template applied successfully!',
  WEBHOOK_TESTED: 'Webhook test successful!',
} as const

export const VALIDATION_RULES = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  url: /^https?:\/\/.+/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
} as const

export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const 
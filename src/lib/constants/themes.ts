// Form themes configuration

export interface FormTheme {
  id: string
  name: string
  description: string
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
  fonts: {
    heading: string
    body: string
  }
  borderRadius: string
  shadow: string
  preview: string
}

export const FORM_THEMES: FormTheme[] = [
  {
    id: 'modern-dark',
    name: 'Modern Dark',
    description: 'Clean dark theme with blue accents',
    colors: {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      accent: '#F59E0B',
      background: '#0F0F23',
      surface: '#1A1A2E',
      text: '#FFFFFF',
      textSecondary: '#A1A1AA',
      border: '#27272A',
      error: '#EF4444',
      success: '#10B981',
      warning: '#F59E0B',
      info: '#3B82F6',
    },
    fonts: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif',
    },
    borderRadius: '12px',
    shadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
    preview: '🌙',
  },
  {
    id: 'light-elegant',
    name: 'Light Elegant',
    description: 'Minimalist light theme with subtle shadows',
    colors: {
      primary: '#2563EB',
      secondary: '#7C3AED',
      accent: '#F59E0B',
      background: '#FFFFFF',
      surface: '#F8FAFC',
      text: '#1E293B',
      textSecondary: '#64748B',
      border: '#E2E8F0',
      error: '#DC2626',
      success: '#059669',
      warning: '#D97706',
      info: '#2563EB',
    },
    fonts: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif',
    },
    borderRadius: '8px',
    shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    preview: '☀️',
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Corporate theme with navy blue',
    colors: {
      primary: '#1E40AF',
      secondary: '#3730A3',
      accent: '#059669',
      background: '#F8FAFC',
      surface: '#FFFFFF',
      text: '#1E293B',
      textSecondary: '#475569',
      border: '#CBD5E1',
      error: '#DC2626',
      success: '#059669',
      warning: '#D97706',
      info: '#2563EB',
    },
    fonts: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif',
    },
    borderRadius: '6px',
    shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    preview: '💼',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Vibrant theme with gradient accents',
    colors: {
      primary: '#EC4899',
      secondary: '#8B5CF6',
      accent: '#F59E0B',
      background: '#0F0F23',
      surface: '#1A1A2E',
      text: '#FFFFFF',
      textSecondary: '#A1A1AA',
      border: '#27272A',
      error: '#F87171',
      success: '#34D399',
      warning: '#FBBF24',
      info: '#60A5FA',
    },
    fonts: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif',
    },
    borderRadius: '16px',
    shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
    preview: '🎨',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra-clean theme with focus on content',
    colors: {
      primary: '#000000',
      secondary: '#374151',
      accent: '#6B7280',
      background: '#FFFFFF',
      surface: '#FFFFFF',
      text: '#111827',
      textSecondary: '#6B7280',
      border: '#E5E7EB',
      error: '#EF4444',
      success: '#10B981',
      warning: '#F59E0B',
      info: '#3B82F6',
    },
    fonts: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif',
    },
    borderRadius: '4px',
    shadow: 'none',
    preview: '⚪',
  },
  {
    id: 'warm',
    name: 'Warm',
    description: 'Cozy theme with warm colors',
    colors: {
      primary: '#D97706',
      secondary: '#B45309',
      accent: '#F59E0B',
      background: '#FEF3C7',
      surface: '#FFFFFF',
      text: '#451A03',
      textSecondary: '#92400E',
      border: '#FDE68A',
      error: '#DC2626',
      success: '#059669',
      warning: '#D97706',
      info: '#2563EB',
    },
    fonts: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif',
    },
    borderRadius: '12px',
    shadow: '0 4px 6px -1px rgba(217, 119, 6, 0.1)',
    preview: '🔥',
  },
]

export function getThemeById(id: string): FormTheme | undefined {
  return FORM_THEMES.find(theme => theme.id === id)
}

export function getDefaultTheme(): FormTheme {
  return FORM_THEMES[0] || FORM_THEMES.find(theme => theme.id === 'modern-dark')!
} 
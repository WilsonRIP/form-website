// Application configuration

export const config = {
  // App settings
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'Form Builder',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    description: 'Create beautiful forms with drag-and-drop ease',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },

  // API settings
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    timeout: 10000,
    retries: 3,
  },

  // Database settings
  database: {
    url: process.env.DATABASE_URL,
    type: process.env.DATABASE_TYPE || 'sqlite',
  },

  // Authentication settings
  auth: {
    enabled: process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true',
    provider: process.env.NEXT_PUBLIC_AUTH_PROVIDER || 'none',
  },

  // Feature flags
  features: {
    webhooks: process.env.NEXT_PUBLIC_FEATURE_WEBHOOKS !== 'false',
    templates: process.env.NEXT_PUBLIC_FEATURE_TEMPLATES !== 'false',
    analytics: process.env.NEXT_PUBLIC_FEATURE_ANALYTICS === 'true',
    darkMode: process.env.NEXT_PUBLIC_FEATURE_DARK_MODE !== 'false',
  },

  // Form settings
  forms: {
    maxFields: parseInt(process.env.NEXT_PUBLIC_MAX_FORM_FIELDS || '100'),
    maxTitleLength: parseInt(process.env.NEXT_PUBLIC_MAX_TITLE_LENGTH || '100'),
    maxDescriptionLength: parseInt(process.env.NEXT_PUBLIC_MAX_DESCRIPTION_LENGTH || '500'),
    maxFieldLabelLength: parseInt(process.env.NEXT_PUBLIC_MAX_FIELD_LABEL_LENGTH || '100'),
    maxFieldPlaceholderLength: parseInt(process.env.NEXT_PUBLIC_MAX_FIELD_PLACEHOLDER_LENGTH || '200'),
    maxOptionsPerField: parseInt(process.env.NEXT_PUBLIC_MAX_OPTIONS_PER_FIELD || '20'),
    maxOptionLength: parseInt(process.env.NEXT_PUBLIC_MAX_OPTION_LENGTH || '50'),
  },

  // UI settings
  ui: {
    theme: {
      primary: process.env.NEXT_PUBLIC_THEME_PRIMARY || '#3B82F6',
      secondary: process.env.NEXT_PUBLIC_THEME_SECONDARY || '#8B5CF6',
      accent: process.env.NEXT_PUBLIC_THEME_ACCENT || '#F59E0B',
    },
    animations: {
      enabled: process.env.NEXT_PUBLIC_ANIMATIONS_ENABLED !== 'false',
      duration: {
        fast: 150,
        normal: 300,
        slow: 500,
      },
    },
  },

  // Development settings
  development: {
    debug: process.env.NODE_ENV === 'development',
    logLevel: process.env.LOG_LEVEL || 'info',
    enableErrorBoundary: process.env.NEXT_PUBLIC_ENABLE_ERROR_BOUNDARY !== 'false',
  },

  // Analytics settings
  analytics: {
    enabled: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true',
    provider: process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER || 'none',
    trackingId: process.env.NEXT_PUBLIC_ANALYTICS_TRACKING_ID,
  },

  // Webhook settings
  webhooks: {
    maxRetries: parseInt(process.env.WEBHOOK_MAX_RETRIES || '3'),
    timeout: parseInt(process.env.WEBHOOK_TIMEOUT || '5000'),
    secret: process.env.WEBHOOK_SECRET,
  },
} as const

// Type-safe config access
export type Config = typeof config

// Helper functions for config access
export function getConfig<T extends keyof Config>(key: T): Config[T] {
  return config[key]
}

export function isFeatureEnabled(feature: keyof Config['features']): boolean {
  return config.features[feature]
}

export function isDevelopment(): boolean {
  return config.development.debug
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

// Environment-specific configs
export const envConfig = {
  development: {
    apiUrl: 'http://localhost:3000',
    enableDebug: true,
    enableErrorBoundary: true,
  },
  production: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    enableDebug: false,
    enableErrorBoundary: true,
  },
  test: {
    apiUrl: 'http://localhost:3000',
    enableDebug: false,
    enableErrorBoundary: false,
  },
} as const

// Get current environment config
export function getEnvConfig() {
  const env = process.env.NODE_ENV || 'development'
  return envConfig[env as keyof typeof envConfig] || envConfig.development
} 
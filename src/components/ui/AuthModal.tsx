'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react'
import { FormTheme, getDefaultTheme } from '@/lib/constants/themes'
import Button from './Button'
import { useAuth } from '@/lib/contexts/AuthContext'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultMode?: 'login' | 'signup'
  theme?: FormTheme
}

export function AuthModal({ 
  isOpen, 
  onClose, 
  defaultMode = 'login',
  theme 
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })

  const { login, signup, isLoading } = useAuth()
  const currentTheme = theme || getDefaultTheme()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    try {
      let result
      if (mode === 'login') {
        result = await login(formData.email, formData.password)
      } else {
        result = await signup(formData.name, formData.email, formData.password)
      }
      
      if (result.success) {
        onClose()
        setFormData({ email: '', password: '', name: '' })
      } else {
        setError(result.error || 'Authentication failed')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login')
    setFormData({ email: '', password: '', name: '' })
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{
          backgroundColor: `${currentTheme.colors.background}CC`
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: currentTheme.colors.surface,
            border: `1px solid ${currentTheme.colors.border}`,
            borderRadius: currentTheme.borderRadius,
            boxShadow: currentTheme.shadow !== 'none' ? currentTheme.shadow : undefined
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg transition-colors duration-200 hover:bg-opacity-10"
            style={{
              color: currentTheme.colors.textSecondary,
              backgroundColor: `${currentTheme.colors.textSecondary}10`
            }}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 
                className="text-2xl font-bold mb-2"
                style={{ color: currentTheme.colors.text }}
              >
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p 
                className="text-sm"
                style={{ color: currentTheme.colors.textSecondary }}
              >
                {mode === 'login' 
                  ? 'Sign in to your account to continue' 
                  : 'Join us and start creating amazing forms'
                }
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <div 
                className="p-3 rounded-lg text-sm"
                style={{
                  backgroundColor: `${currentTheme.colors.error || '#ef4444'}20`,
                  color: currentTheme.colors.error || '#ef4444',
                  border: `1px solid ${currentTheme.colors.error || '#ef4444'}40`
                }}
              >
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name field (signup only) */}
              {mode === 'signup' && (
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: currentTheme.colors.text }}
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <User 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                      style={{ color: currentTheme.colors.textSecondary }}
                    />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2"
                      placeholder="Enter your full name"
                      required={mode === 'signup'}
                      style={{
                        backgroundColor: `${currentTheme.colors.background}80`,
                        border: `1px solid ${currentTheme.colors.border}`,
                        color: currentTheme.colors.text,
                        borderRadius: currentTheme.borderRadius,
                        '--tw-ring-color': currentTheme.colors.primary
                      } as React.CSSProperties}
                    />
                  </div>
                </div>
              )}

              {/* Email field */}
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: currentTheme.colors.text }}
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                    style={{ color: currentTheme.colors.textSecondary }}
                  />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2"
                    placeholder="Enter your email"
                    required
                    style={{
                      backgroundColor: `${currentTheme.colors.background}80`,
                      border: `1px solid ${currentTheme.colors.border}`,
                      color: currentTheme.colors.text,
                      borderRadius: currentTheme.borderRadius,
                      '--tw-ring-color': currentTheme.colors.primary
                    } as React.CSSProperties}
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: currentTheme.colors.text }}
                >
                  Password
                </label>
                <div className="relative">
                  <Lock 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                    style={{ color: currentTheme.colors.textSecondary }}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full pl-10 pr-12 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2"
                    placeholder="Enter your password"
                    required
                    style={{
                      backgroundColor: `${currentTheme.colors.background}80`,
                      border: `1px solid ${currentTheme.colors.border}`,
                      color: currentTheme.colors.text,
                      borderRadius: currentTheme.borderRadius,
                      '--tw-ring-color': currentTheme.colors.primary
                    } as React.CSSProperties}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors duration-200"
                    style={{
                      color: currentTheme.colors.textSecondary,
                      backgroundColor: `${currentTheme.colors.textSecondary}10`
                    }}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-3"
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
                  color: '#ffffff'
                }}
                iconRight={isLoading ? undefined : <ArrowRight className="w-4 h-4" />}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    {mode === 'login' ? 'Signing In...' : 'Creating Account...'}
                  </div>
                ) : (
                  mode === 'login' ? 'Sign In' : 'Create Account'
                )}
              </Button>
            </form>

            {/* Mode toggle */}
            <div className="mt-6 text-center">
              <p 
                className="text-sm"
                style={{ color: currentTheme.colors.textSecondary }}
              >
                {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                {' '}
                <button
                  onClick={toggleMode}
                  className="font-medium transition-colors duration-200 hover:underline"
                  style={{ color: currentTheme.colors.primary }}
                >
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>

            {/* Social login options */}
            <div className="mt-6">
              <div className="relative">
                <div 
                  className="absolute inset-0 flex items-center"
                  style={{ color: currentTheme.colors.textSecondary }}
                >
                  <div 
                    className="w-full border-t"
                    style={{ borderColor: currentTheme.colors.border }}
                  />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span 
                    className="px-2 bg-opacity-90"
                    style={{ 
                      backgroundColor: currentTheme.colors.surface,
                      color: currentTheme.colors.textSecondary
                    }}
                  >
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="w-full py-2"
                  style={{
                    borderColor: currentTheme.colors.border,
                    color: currentTheme.colors.text,
                    backgroundColor: `${currentTheme.colors.background}80`
                  }}
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </Button>
                <Button
                  variant="outline"
                  className="w-full py-2"
                  style={{
                    borderColor: currentTheme.colors.border,
                    color: currentTheme.colors.text,
                    backgroundColor: `${currentTheme.colors.background}80`
                  }}
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                  Twitter
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
} 
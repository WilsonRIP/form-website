'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '@/lib/auth-api'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // TODO: Implement actual session check
        // For now, check localStorage for demo purposes
        const savedUser = localStorage.getItem('formbuilder_user')
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true)
      
      const data = await authApi.login({ email, password })

      if (data.success && data.user) {
        const user: User = {
          id: data.user.id.toString(),
          name: data.user.name,
          email: data.user.email,
          avatar: data.user.avatar || undefined
        }
        
        setUser(user)
        localStorage.setItem('formbuilder_user', JSON.stringify(user))
        return { success: true }
      } else {
        return { success: false, error: 'Login failed' }
      }
    } catch (error: any) {
      console.error('Login error:', error)
      return { success: false, error: error.message || 'Network error. Please try again.' }
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true)
      
      const data = await authApi.signup({ name, email, password })

      if (data.success && data.user) {
        const user: User = {
          id: data.user.id.toString(),
          name: data.user.name,
          email: data.user.email,
          avatar: data.user.avatar || undefined
        }
        
        setUser(user)
        localStorage.setItem('formbuilder_user', JSON.stringify(user))
        return { success: true }
      } else {
        return { success: false, error: 'Signup failed' }
      }
    } catch (error: any) {
      console.error('Signup error:', error)
      return { success: false, error: error.message || 'Network error. Please try again.' }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('formbuilder_user')
    // TODO: Implement actual logout API call
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem('formbuilder_user', JSON.stringify(updatedUser))
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  Plus,
  Home,
  FileText,
  BarChart3
} from 'lucide-react'
import { FormTheme, getDefaultTheme } from '@/lib/constants/themes'
import Button from '@/components/ui/Button'
import { AuthModal } from '@/components/ui/AuthModal'
import { useAuth } from '@/lib/contexts/AuthContext'

interface NavbarProps {
  theme?: FormTheme
}

export function Navbar({ theme }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  
  const { user, isAuthenticated, logout } = useAuth()

  const currentTheme = theme || getDefaultTheme()

  const handleAuthClick = (mode: 'login' | 'signup') => {
    setAuthMode(mode)
    setIsAuthModalOpen(true)
  }

  const handleLogout = () => {
    logout()
  }

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Forms', href: '/forms', icon: FileText },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  ]

  return (
    <>
      <nav 
        className="fixed top-0 left-0 right-0 z-40 backdrop-blur-sm border-b"
        style={{
          backgroundColor: `${currentTheme.colors.surface}CC`,
          borderColor: currentTheme.colors.border
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
                }}
              >
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span 
                className="text-xl font-bold"
                style={{ color: currentTheme.colors.text }}
              >
                FormBuilder
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-opacity-10"
                    style={{
                      color: currentTheme.colors.textSecondary,
                      backgroundColor: `${currentTheme.colors.textSecondary}00`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${currentTheme.colors.textSecondary}10`
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = `${currentTheme.colors.textSecondary}00`
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2"
                    style={{
                      color: currentTheme.colors.text,
                      backgroundColor: `${currentTheme.colors.background}80`
                    }}
                  >
                    <User className="w-4 h-4" />
                    <span>{user?.name || 'User'}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    style={{
                      borderColor: currentTheme.colors.border,
                      color: currentTheme.colors.textSecondary
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => handleAuthClick('login')}
                    style={{
                      color: currentTheme.colors.textSecondary
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => handleAuthClick('signup')}
                    style={{
                      background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
                      color: '#ffffff'
                    }}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg transition-colors duration-200"
                style={{
                  color: currentTheme.colors.textSecondary,
                  backgroundColor: `${currentTheme.colors.textSecondary}10`
                }}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={isMenuOpen ? "open" : "closed"}
          variants={{
            open: { opacity: 1, height: "auto" },
            closed: { opacity: 0, height: 0 }
          }}
          transition={{ duration: 0.2 }}
          className="md:hidden overflow-hidden"
          style={{
            backgroundColor: currentTheme.colors.surface,
            borderTop: `1px solid ${currentTheme.colors.border}`
          }}
        >
          <div className="px-4 py-4 space-y-3">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200"
                  style={{
                    color: currentTheme.colors.textSecondary,
                    backgroundColor: `${currentTheme.colors.textSecondary}00`
                  }}
                  onClick={() => setIsMenuOpen(false)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${currentTheme.colors.textSecondary}10`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = `${currentTheme.colors.textSecondary}00`
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
            
            <div className="pt-4 border-t" style={{ borderColor: currentTheme.colors.border }}>
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 px-3 py-2">
                    <User className="w-4 h-4" style={{ color: currentTheme.colors.textSecondary }} />
                    <span style={{ color: currentTheme.colors.text }}>
                      {user?.name || 'User'}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    style={{
                      borderColor: currentTheme.colors.border,
                      color: currentTheme.colors.textSecondary
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                      handleAuthClick('login')
                      setIsMenuOpen(false)
                    }}
                    style={{
                      color: currentTheme.colors.textSecondary
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => {
                      handleAuthClick('signup')
                      setIsMenuOpen(false)
                    }}
                    style={{
                      background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
                      color: '#ffffff'
                    }}
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode={authMode}
        theme={currentTheme}
      />
    </>
  )
} 
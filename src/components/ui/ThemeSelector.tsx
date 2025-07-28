// Theme selector component for form customization

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Palette, Check } from 'lucide-react'
import { FORM_THEMES, FormTheme } from '@/lib/constants/themes'
import { Button } from './Button'

interface ThemeSelectorProps {
  selectedTheme: string
  onThemeChange: (themeId: string) => void
  className?: string
}

export function ThemeSelector({ selectedTheme, onThemeChange, className }: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const currentTheme = FORM_THEMES.find(theme => theme.id === selectedTheme) || FORM_THEMES[0]!

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        icon={<Palette className="w-4 h-4" />}
        className="w-full justify-between"
      >
        <span>Theme: {currentTheme.name}</span>
        <span className="text-lg">{currentTheme.preview}</span>
      </Button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-2 bg-zinc-900/95 backdrop-blur-sm border border-zinc-800 rounded-xl p-4 z-50"
        >
          <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
            {FORM_THEMES.map((theme) => (
              <ThemeOption
                key={theme.id}
                theme={theme}
                isSelected={theme.id === selectedTheme}
                onSelect={() => {
                  onThemeChange(theme.id)
                  setIsOpen(false)
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

interface ThemeOptionProps {
  theme: FormTheme
  isSelected: boolean
  onSelect: () => void
}

function ThemeOption({ theme, isSelected, onSelect }: ThemeOptionProps) {
  return (
    <button
      onClick={onSelect}
      className={`w-full p-3 rounded-lg border transition-all duration-200 text-left hover:scale-105 ${
        isSelected
          ? 'border-blue-500 bg-blue-500/10'
          : 'border-zinc-700 hover:border-zinc-600 bg-zinc-800/50'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{theme.preview}</div>
          <div>
            <div className="font-medium text-white">{theme.name}</div>
            <div className="text-sm text-gray-400">{theme.description}</div>
          </div>
        </div>
        
        {isSelected && (
          <div className="flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
      
      {/* Theme preview colors */}
      <div className="flex space-x-1 mt-3">
        <div
          className="w-4 h-4 rounded-full border border-zinc-600"
          style={{ backgroundColor: theme.colors.primary }}
        />
        <div
          className="w-4 h-4 rounded-full border border-zinc-600"
          style={{ backgroundColor: theme.colors.secondary }}
        />
        <div
          className="w-4 h-4 rounded-full border border-zinc-600"
          style={{ backgroundColor: theme.colors.accent }}
        />
        <div
          className="w-4 h-4 rounded-full border border-zinc-600"
          style={{ backgroundColor: theme.colors.background }}
        />
      </div>
    </button>
  )
} 
// components/MultiSelect.tsx
'use client'

import React, { useState, useRef, useEffect } from 'react'
import { FormTheme, getDefaultTheme } from '@/lib/constants/themes'

export interface Tag {
  id: number
  name: string
  value: string
  /** 
   * Tailwind classes for the tag's background/text.
   * You can include dark: variants here. 
   */
  color: string
}

interface MultiSelectProps {
  options: Tag[]
  selected: Tag[]
  onChange: (selected: Tag[]) => void
  placeholder?: string
  theme?: FormTheme
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selected,
  onChange,
  placeholder = 'Select…',
  theme,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  
  // Use provided theme or default theme
  const currentTheme = theme || getDefaultTheme()

  // close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const toggleOption = (tag: Tag) => {
    const exists = selected.some((t) => t.id === tag.id)
    onChange(exists ? selected.filter((t) => t.id !== tag.id) : [...selected, tag])
  }

  // filter out already‐selected + apply search
  const filtered = options.filter(
    (o) =>
      !selected.some((s) => s.id === o.id) &&
      o.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="relative w-full" ref={ref}>
      {/* Selected tags as chips */}
      <div className="flex flex-wrap gap-1 mb-1">
        {selected.map((tag) => (
          <span
            key={tag.id}
            className={`flex items-center text-sm px-2 py-1 rounded ${tag.color}`}
            style={{
              backgroundColor: `${currentTheme.colors.primary}20`,
              color: currentTheme.colors.text,
              border: `1px solid ${currentTheme.colors.primary}40`
            }}
          >
            {tag.name}
            <button
              type="button"
              onClick={() => toggleOption(tag)}
              className="ml-1 hover:opacity-70 focus:outline-none transition-opacity"
              style={{ color: currentTheme.colors.textSecondary }}
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {/* Search / toggle control */}
      <div
        className="flex items-center rounded px-2 py-1 cursor-text transition-all duration-200"
        style={{
          border: `1px solid ${currentTheme.colors.border}`,
          backgroundColor: `${currentTheme.colors.surface}CC`,
          borderRadius: currentTheme.borderRadius
        }}
        onClick={() => setIsOpen((o) => !o)}
      >
        <input
          className="flex-1 outline-none bg-transparent"
          placeholder={placeholder}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            if (!isOpen) setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          style={{
            color: currentTheme.colors.text
          }}
        />
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{ color: currentTheme.colors.textSecondary }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Dropdown list */}
      {isOpen && (
        <ul 
          className="absolute z-10 w-full mt-1 rounded shadow max-h-60 overflow-y-auto backdrop-blur-sm"
          style={{
            backgroundColor: `${currentTheme.colors.surface}CC`,
            border: `1px solid ${currentTheme.colors.border}`,
            borderRadius: currentTheme.borderRadius,
            boxShadow: currentTheme.shadow !== 'none' ? currentTheme.shadow : undefined
          }}
        >
          {filtered.length > 0 ? (
            filtered.map((opt) => (
              <li
                key={opt.id}
                onClick={() => {
                  toggleOption(opt)
                  setSearch('')
                }}
                className="px-4 py-2 cursor-pointer transition-colors duration-200"
                style={{
                  color: currentTheme.colors.text,
                  borderBottom: `1px solid ${currentTheme.colors.border}40`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${currentTheme.colors.primary}10`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                {opt.name}
              </li>
            ))
          ) : (
            <li 
              className="px-4 py-2"
              style={{ color: currentTheme.colors.textSecondary }}
            >
              No options found.
            </li>
          )}
        </ul>
      )}
    </div>
  )
}

export default MultiSelect

// MultiSelectField component for use in forms
interface MultiSelectFieldProps {
  options: string[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  theme?: FormTheme
  disabled?: boolean
}

export const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select options...',
  theme,
  disabled = false
}) => {
  // Convert string options to Tag format
  const tagOptions: Tag[] = options.map((option, index) => ({
    id: index,
    name: option,
    value: option,
    color: ''
  }))

  // Convert selected values to Tag format
  const selectedTags: Tag[] = value.map((val, index) => ({
    id: options.indexOf(val),
    name: val,
    value: val,
    color: ''
  }))

  const handleChange = (selected: Tag[]) => {
    if (!disabled) {
      onChange(selected.map(tag => tag.value))
    }
  }

  return (
    <MultiSelect
      options={tagOptions}
      selected={selectedTags}
      onChange={handleChange}
      placeholder={placeholder}
      theme={theme}
    />
  )
}

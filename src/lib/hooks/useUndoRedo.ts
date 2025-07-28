import { useState, useCallback, useEffect, useRef } from 'react'

interface FormState {
  fields: any[]
  formTitle: string
  formDescription: string
  webhookUrl: string
  webhookEnabled: boolean
}

interface UseUndoRedoReturn {
  canUndo: boolean
  canRedo: boolean
  undo: () => void
  redo: () => void
  saveToHistory: (state: FormState) => void
  getCurrentState: () => FormState | null
}

const MAX_HISTORY_SIZE = 50

export function useUndoRedo(initialState: FormState): UseUndoRedoReturn {
  const [history, setHistory] = useState<FormState[]>([initialState])
  const [currentIndex, setCurrentIndex] = useState(0)
  const isUndoRedoAction = useRef(false)

  const canUndo = currentIndex > 0
  const canRedo = currentIndex < history.length - 1

  const saveToHistory = useCallback((state: FormState) => {
    if (isUndoRedoAction.current) {
      isUndoRedoAction.current = false
      return
    }

    setHistory(prevHistory => {
      const newHistory = prevHistory.slice(0, currentIndex + 1)
      newHistory.push(JSON.parse(JSON.stringify(state))) // Deep copy
      
      // Limit history size
      if (newHistory.length > MAX_HISTORY_SIZE) {
        newHistory.shift()
        return newHistory
      }
      
      return newHistory
    })
    setCurrentIndex(prev => prev + 1)
  }, [currentIndex])

  const undo = useCallback(() => {
    if (canUndo) {
      isUndoRedoAction.current = true
      setCurrentIndex(prev => prev - 1)
    }
  }, [canUndo])

  const redo = useCallback(() => {
    if (canRedo) {
      isUndoRedoAction.current = true
      setCurrentIndex(prev => prev + 1)
    }
  }, [canRedo])

  // Note: Keyboard shortcuts are handled in the component that uses this hook

  const getCurrentState = useCallback(() => {
    return history[currentIndex] || null
  }, [history, currentIndex])

  return {
    canUndo,
    canRedo,
    undo,
    redo,
    saveToHistory,
    getCurrentState
  }
} 
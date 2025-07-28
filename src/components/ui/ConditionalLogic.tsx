// Conditional logic component for showing/hiding fields based on conditions

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  GitBranch, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff,
  ChevronDown,
  ChevronRight,
  X
} from 'lucide-react'
import Button from './Button'
import { FormField } from '@/lib/types'

interface Condition {
  id: string
  fieldId: string
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'is_empty' | 'is_not_empty'
  value: string
  action: 'show' | 'hide'
}

interface ConditionalLogicProps {
  fields: FormField[]
  conditions: Condition[]
  onConditionsChange: (conditions: Condition[]) => void
  onClose: () => void
}

export function ConditionalLogic({ 
  fields, 
  conditions, 
  onConditionsChange, 
  onClose 
}: ConditionalLogicProps) {
  const [expandedCondition, setExpandedCondition] = useState<string | null>(null)

  const operators = [
    { value: 'equals', label: 'Equals', description: 'Field equals exactly' },
    { value: 'not_equals', label: 'Does not equal', description: 'Field does not equal' },
    { value: 'contains', label: 'Contains', description: 'Field contains text' },
    { value: 'not_contains', label: 'Does not contain', description: 'Field does not contain' },
    { value: 'greater_than', label: 'Greater than', description: 'Field is greater than' },
    { value: 'less_than', label: 'Less than', description: 'Field is less than' },
    { value: 'is_empty', label: 'Is empty', description: 'Field has no value' },
    { value: 'is_not_empty', label: 'Is not empty', description: 'Field has a value' }
  ]

  const addCondition = () => {
    const newCondition: Condition = {
      id: `condition-${Date.now()}`,
      fieldId: fields[0]?.id || '',
      operator: 'equals',
      value: '',
      action: 'show'
    }
    onConditionsChange([...conditions, newCondition])
    setExpandedCondition(newCondition.id)
  }

  const updateCondition = (conditionId: string, updates: Partial<Condition>) => {
    const updatedConditions = conditions.map(condition =>
      condition.id === conditionId ? { ...condition, ...updates } : condition
    )
    onConditionsChange(updatedConditions)
  }

  const deleteCondition = (conditionId: string) => {
    const updatedConditions = conditions.filter(condition => condition.id !== conditionId)
    onConditionsChange(updatedConditions)
    if (expandedCondition === conditionId) {
      setExpandedCondition(null)
    }
  }

  const getFieldType = (fieldId: string) => {
    const field = fields.find(f => f.id === fieldId)
    return field?.type || 'text'
  }

  const isValueRequired = (operator: string) => {
    return !['is_empty', 'is_not_empty'].includes(operator)
  }

  const getOperatorDescription = (operator: string) => {
    return operators.find(op => op.value === operator)?.description || ''
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div className="bg-zinc-900/95 backdrop-blur-sm border border-zinc-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <GitBranch className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white text-xl font-semibold">Conditional Logic</h3>
              <p className="text-gray-400 text-sm">Show or hide fields based on conditions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conditions List */}
        <div className="space-y-4 mb-6">
          {conditions.length === 0 ? (
            <div className="text-center py-8">
              <GitBranch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No conditions set</p>
              <p className="text-gray-500 text-sm">Add conditions to control field visibility</p>
            </div>
          ) : (
            conditions.map((condition) => (
              <ConditionItem
                key={condition.id}
                condition={condition}
                fields={fields}
                operators={operators}
                isExpanded={expandedCondition === condition.id}
                onToggleExpand={() => setExpandedCondition(
                  expandedCondition === condition.id ? null : condition.id
                )}
                onUpdate={(updates) => updateCondition(condition.id, updates)}
                onDelete={() => deleteCondition(condition.id)}
                isValueRequired={isValueRequired}
                getOperatorDescription={getOperatorDescription}
              />
            ))
          )}
        </div>

        {/* Add Condition Button */}
        <Button
          variant="outline"
          onClick={addCondition}
          iconLeft={<Plus className="w-4 h-4" />}
          className="w-full"
        >
          Add Condition
        </Button>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-zinc-800/30 border border-zinc-700 rounded-lg">
          <h4 className="text-white font-semibold mb-2">How it works</h4>
          <ul className="text-gray-400 text-sm space-y-1">
            <li>• Conditions control when fields are shown or hidden</li>
            <li>• Multiple conditions can be combined</li>
            <li>• All conditions must be true for the action to trigger</li>
            <li>• Use "Show" to display fields when conditions are met</li>
            <li>• Use "Hide" to hide fields when conditions are met</li>
          </ul>
        </div>
      </div>
    </motion.div>
  )
}

interface ConditionItemProps {
  condition: Condition
  fields: FormField[]
  operators: Array<{ value: string; label: string; description: string }>
  isExpanded: boolean
  onToggleExpand: () => void
  onUpdate: (updates: Partial<Condition>) => void
  onDelete: () => void
  isValueRequired: (operator: string) => boolean
  getOperatorDescription: (operator: string) => string
}

function ConditionItem({
  condition,
  fields,
  operators,
  isExpanded,
  onToggleExpand,
  onUpdate,
  onDelete,
  isValueRequired,
  getOperatorDescription
}: ConditionItemProps) {
  const selectedField = fields.find(f => f.id === condition.fieldId)
  const selectedOperator = operators.find(op => op.value === condition.operator)

  return (
    <div className="bg-zinc-800/30 border border-zinc-700 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={onToggleExpand}
          className="flex items-center space-x-3 flex-1 text-left"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
          <div className="flex items-center space-x-2">
            {condition.action === 'show' ? (
              <Eye className="w-4 h-4 text-green-400" />
            ) : (
              <EyeOff className="w-4 h-4 text-red-400" />
            )}
            <span className="text-white font-medium">
              {condition.action === 'show' ? 'Show' : 'Hide'} field
            </span>
          </div>
        </button>
        
        <button
          onClick={onDelete}
          className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-zinc-700 p-4 space-y-4"
        >
          {/* Field Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              When this field
            </label>
            <select
              value={condition.fieldId}
              onChange={(e) => onUpdate({ fieldId: e.target.value })}
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {fields.map((field) => (
                <option key={field.id} value={field.id}>
                  {field.label} ({field.type})
                </option>
              ))}
            </select>
          </div>

          {/* Operator Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Operator
            </label>
            <select
              value={condition.operator}
              onChange={(e) => onUpdate({ operator: e.target.value as any })}
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {operators.map((operator) => (
                <option key={operator.value} value={operator.value}>
                  {operator.label}
                </option>
              ))}
            </select>
            <p className="text-gray-400 text-xs mt-1">
              {getOperatorDescription(condition.operator)}
            </p>
          </div>

          {/* Value Input */}
          {isValueRequired(condition.operator) && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Value
              </label>
              <input
                type="text"
                value={condition.value}
                onChange={(e) => onUpdate({ value: e.target.value })}
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter value..."
              />
            </div>
          )}

          {/* Action Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Action
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => onUpdate({ action: 'show' })}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg border transition-colors ${
                  condition.action === 'show'
                    ? 'border-green-500 bg-green-500/10 text-green-400'
                    : 'border-zinc-700 text-gray-400 hover:border-zinc-600'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>Show</span>
              </button>
              <button
                onClick={() => onUpdate({ action: 'hide' })}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg border transition-colors ${
                  condition.action === 'hide'
                    ? 'border-red-500 bg-red-500/10 text-red-400'
                    : 'border-zinc-700 text-gray-400 hover:border-zinc-600'
                }`}
              >
                <EyeOff className="w-4 h-4" />
                <span>Hide</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
} 
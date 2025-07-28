# Development Guidelines

This document outlines the development standards and best practices for the Form Builder project.

## 📋 Table of Contents

- [Code Style](#code-style)
- [Component Guidelines](#component-guidelines)
- [State Management](#state-management)
- [Error Handling](#error-handling)
- [Performance](#performance)
- [Testing](#testing)
- [Git Workflow](#git-workflow)

## 🎨 Code Style

### TypeScript

- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use `const assertions` for readonly data
- Avoid `any` type - use `unknown` or proper typing
- Use utility types like `Partial<T>`, `Pick<T>`, `Omit<T>`

```typescript
// ✅ Good
interface User {
  id: string
  name: string
  email: string
}

type CreateUserData = Omit<User, 'id'>

// ❌ Bad
const user: any = { id: '1', name: 'John' }
```

### Naming Conventions

- **Components**: PascalCase (`FormBuilder`, `FieldEditor`)
- **Files**: kebab-case (`form-builder.tsx`, `field-editor.tsx`)
- **Functions**: camelCase (`handleSubmit`, `validateForm`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_FORM_FIELDS`)
- **Types/Interfaces**: PascalCase (`FormField`, `ValidationResult`)

### File Organization

```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── forms/        # Form-specific components
│   └── layout/       # Layout components
├── features/
│   └── forms/        # Feature modules
│       ├── components/
│       ├── hooks/
│       ├── types/
│       └── utils/
└── lib/              # Shared utilities
```

## 🧩 Component Guidelines

### Component Structure

```typescript
// 1. Imports
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui'

// 2. Types
interface ComponentProps {
  title: string
  onAction: (data: any) => void
  disabled?: boolean
}

// 3. Component
export function Component({ title, onAction, disabled = false }: ComponentProps) {
  // 4. State
  const [isLoading, setIsLoading] = useState(false)

  // 5. Effects
  useEffect(() => {
    // Effect logic
  }, [])

  // 6. Handlers
  const handleClick = () => {
    setIsLoading(true)
    onAction(data)
  }

  // 7. Render
  return (
    <div className="component">
      <h2>{title}</h2>
      <Button onClick={handleClick} disabled={disabled || isLoading}>
        Action
      </Button>
    </div>
  )
}
```

### Component Best Practices

- **Single Responsibility**: Each component should have one clear purpose
- **Props Interface**: Always define prop interfaces
- **Default Props**: Use default parameters for optional props
- **Forward Refs**: Use `forwardRef` for components that need refs
- **Memoization**: Use `React.memo` for expensive components
- **Error Boundaries**: Wrap components that might fail

### Styling Guidelines

- Use Tailwind CSS for styling
- Follow the design system
- Use CSS custom properties for theming
- Implement responsive design
- Use consistent spacing and typography

```typescript
// ✅ Good - Using design system
<div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-6">
  <h2 className="text-white font-semibold text-lg mb-4">{title}</h2>
</div>

// ❌ Bad - Inconsistent styling
<div className="bg-gray-800 border border-gray-600 rounded p-4">
  <h2 className="text-white font-bold text-xl mb-2">{title}</h2>
</div>
```

## 🔄 State Management

### Local State

- Use `useState` for simple component state
- Use `useReducer` for complex state logic
- Use `useCallback` for stable function references
- Use `useMemo` for expensive calculations

### Global State

- Use React Query for server state
- Use Context for theme/auth state
- Avoid prop drilling with Context
- Use custom hooks for complex state logic

### State Patterns

```typescript
// ✅ Good - Custom hook for complex state
function useFormBuilder() {
  const [fields, setFields] = useState<FormField[]>([])
  const [selectedField, setSelectedField] = useState<string | null>(null)

  const addField = useCallback((field: FormField) => {
    setFields(prev => [...prev, field])
  }, [])

  const updateField = useCallback((id: string, updates: Partial<FormField>) => {
    setFields(prev => prev.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ))
  }, [])

  return {
    fields,
    selectedField,
    addField,
    updateField,
    setSelectedField,
  }
}
```

## ⚠️ Error Handling

### Error Boundaries

```typescript
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

<ErrorBoundary>
  <FormBuilder />
</ErrorBoundary>
```

### Try-Catch Patterns

```typescript
// ✅ Good - Proper error handling
const handleSubmit = async (data: FormData) => {
  try {
    setIsLoading(true)
    const result = await submitForm(data)
    toast.success('Form submitted successfully!')
  } catch (error) {
    console.error('Submit error:', error)
    toast.error('Failed to submit form. Please try again.')
  } finally {
    setIsLoading(false)
  }
}
```

### Validation

```typescript
// ✅ Good - Input validation
const validateEmail = (email: string): ValidationResult => {
  const errors: ValidationError[] = []
  
  if (!email) {
    errors.push({ field: 'email', message: 'Email is required' })
  } else if (!isValidEmail(email)) {
    errors.push({ field: 'email', message: 'Invalid email format' })
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}
```

## ⚡ Performance

### Optimization Techniques

- **Code Splitting**: Use dynamic imports for large components
- **Lazy Loading**: Load components only when needed
- **Memoization**: Use `React.memo`, `useMemo`, `useCallback`
- **Virtualization**: For large lists
- **Image Optimization**: Use Next.js Image component

```typescript
// ✅ Good - Code splitting
const HeavyComponent = lazy(() => import('./HeavyComponent'))

// ✅ Good - Memoization
const ExpensiveComponent = React.memo(({ data }: Props) => {
  const processedData = useMemo(() => processData(data), [data])
  
  return <div>{processedData}</div>
})
```

### Bundle Size

- Use tree shaking
- Import only what you need
- Use bundle analyzer
- Optimize images and assets

```typescript
// ✅ Good - Specific imports
import { Button } from '@/components/ui/Button'
import { debounce } from 'lodash-es'

// ❌ Bad - Importing everything
import * as UI from '@/components/ui'
import _ from 'lodash'
```

## 🧪 Testing

### Testing Strategy

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test user workflows
- **Visual Tests**: Test UI consistency

### Test Structure

```typescript
// Component test example
import { render, screen, fireEvent } from '@testing-library/react'
import { FormBuilder } from './FormBuilder'

describe('FormBuilder', () => {
  it('should add a field when add button is clicked', () => {
    render(<FormBuilder />)
    
    const addButton = screen.getByText('Add Field')
    fireEvent.click(addButton)
    
    expect(screen.getByText('New Field')).toBeInTheDocument()
  })
})
```

### Testing Best Practices

- Test user behavior, not implementation
- Use meaningful test descriptions
- Mock external dependencies
- Test error states
- Use data-testid for complex queries

## 🔄 Git Workflow

### Branch Naming

- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `refactor/component-name` - Code refactoring
- `docs/documentation-update` - Documentation changes

### Commit Messages

```
type(scope): description

feat(forms): add undo/redo functionality
fix(validation): resolve email validation issue
refactor(components): extract reusable Button component
docs(readme): update installation instructions
```

### Pull Request Guidelines

- Clear title and description
- Link related issues
- Include screenshots for UI changes
- Request reviews from team members
- Ensure all tests pass

## 📚 Resources

### Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Tools

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type checking
- **Jest**: Testing framework
- **React Testing Library**: Component testing

### IDE Setup

- Install recommended extensions
- Configure auto-formatting
- Enable TypeScript strict mode
- Set up debugging configuration

## 🤝 Contributing

1. Read this document thoroughly
2. Follow the established patterns
3. Write tests for new features
4. Update documentation
5. Request code reviews
6. Be open to feedback

Remember: Good code is readable, maintainable, and well-tested! 
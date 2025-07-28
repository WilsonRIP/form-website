# Form Builder - Modern Form Creation Platform

A powerful, drag-and-drop form builder built with Next.js, TypeScript, and modern web technologies.

## 🚀 Features

- **Drag & Drop Interface**: Intuitive form building with visual field management
- **Template System**: Pre-built form templates for common use cases
- **Real-time Preview**: See your form as you build it
- **Undo/Redo**: Full history management with keyboard shortcuts
- **Webhook Integration**: Send form submissions to external services
- **Responsive Design**: Works perfectly on all devices
- **Type Safety**: Full TypeScript support throughout
- **Modern UI**: Beautiful, accessible interface with smooth animations

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (features)/         # Feature-based routes
│   │   ├── forms/          # Form management feature
│   │   └── dashboard/      # Dashboard feature (future)
│   ├── components/         # App-level components
│   └── globals.css         # Global styles
├── components/             # Shared UI components
│   ├── ui/                 # Base UI components
│   │   ├── Button.tsx      # Reusable button component
│   │   ├── Toast.tsx       # Toast notification system
│   │   └── ErrorBoundary.tsx # Error handling
│   ├── forms/              # Form-specific components
│   └── layout/             # Layout components
├── features/               # Feature modules
│   ├── forms/              # Form feature
│   │   ├── components/     # Form-specific components
│   │   ├── hooks/          # Form-specific hooks
│   │   ├── types/          # Form-specific types
│   │   └── utils/          # Form-specific utilities
│   └── shared/             # Shared features
├── lib/                    # Core utilities
│   ├── api/                # API clients and services
│   ├── config/             # Application configuration
│   ├── constants/          # App-wide constants
│   ├── hooks/              # Shared hooks
│   ├── types/              # Shared type definitions
│   ├── utils/              # Utility functions
│   └── validation/         # Validation schemas and utilities
└── styles/                 # Global styles and themes
```

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: React Query (TanStack Query)
- **Drag & Drop**: @dnd-kit
- **Database**: SQLite with Drizzle ORM
- **Deployment**: Cloudflare Pages

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd form-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Development Guidelines

### Code Organization

#### 1. **Feature-Based Structure**
- Group related functionality together
- Keep components, hooks, and utilities close to where they're used
- Use clear, descriptive naming conventions

#### 2. **Component Guidelines**
- Use TypeScript for all components
- Implement proper prop interfaces
- Use forwardRef for components that need refs
- Keep components focused and single-purpose

#### 3. **State Management**
- Use React Query for server state
- Use local state for UI state
- Implement proper loading and error states
- Use custom hooks for complex state logic

#### 4. **Styling Guidelines**
- Use Tailwind CSS for styling
- Follow the design system and color palette
- Use CSS custom properties for theming
- Implement responsive design patterns

### Adding New Features

#### 1. **Create Feature Directory**
```bash
mkdir -p src/features/new-feature/{components,hooks,types,utils}
```

#### 2. **Define Types**
```typescript
// src/features/new-feature/types/index.ts
export interface NewFeatureData {
  id: string
  name: string
  // ... other properties
}
```

#### 3. **Create Components**
```typescript
// src/features/new-feature/components/NewFeatureComponent.tsx
import { NewFeatureData } from '../types'

interface NewFeatureComponentProps {
  data: NewFeatureData
  onAction: (data: NewFeatureData) => void
}

export function NewFeatureComponent({ data, onAction }: NewFeatureComponentProps) {
  // Component implementation
}
```

#### 4. **Add to Constants**
```typescript
// src/lib/constants/index.ts
export const NEW_FEATURE_CONFIG = {
  // Configuration for new feature
} as const
```

### Error Handling

#### 1. **Use Error Boundaries**
```typescript
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

#### 2. **Toast Notifications**
```typescript
import { useToast } from '@/lib/hooks/useToast'

const { success, error, warning, info } = useToast()

// Usage
success('Operation completed successfully!')
error('Something went wrong')
```

### Validation

#### 1. **Form Validation**
```typescript
import { validateForm } from '@/lib/validation'

const validation = validateForm(formData)
if (!validation.isValid) {
  // Handle validation errors
}
```

#### 2. **Input Validation**
```typescript
import { validateInput } from '@/lib/validation'

const validation = validateInput(value, 'email', true)
```

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (#3B82F6 to #8B5CF6)
- **Secondary**: Purple (#8B5CF6)
- **Accent**: Orange (#F59E0B)
- **Background**: Dark zinc (#0A0A0A)
- **Surface**: Zinc with transparency

### Typography
- **Headings**: Inter font family
- **Body**: System font stack
- **Code**: JetBrains Mono

### Spacing
- **Base unit**: 4px
- **Common spacing**: 4, 8, 12, 16, 20, 24, 32, 48, 64px

### Animations
- **Fast**: 150ms
- **Normal**: 300ms
- **Slow**: 500ms

## 🧪 Testing

### Running Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

### Test Structure
```
tests/
├── unit/           # Unit tests
├── integration/    # Integration tests
├── e2e/           # End-to-end tests
└── fixtures/      # Test data
```

## 📚 API Documentation

### Forms API
- `GET /api/forms` - Get all forms
- `POST /api/forms` - Create new form
- `GET /api/forms/[id]` - Get form by ID
- `PUT /api/forms/[id]` - Update form
- `DELETE /api/forms/[id]` - Delete form

### Submissions API
- `POST /api/forms/[id]/submit` - Submit form
- `GET /api/forms/[id]/submissions` - Get form submissions

## 🚀 Deployment

### Environment Variables
```bash
# Required
DATABASE_URL=your-database-url
NEXT_PUBLIC_APP_URL=your-app-url

# Optional
NEXT_PUBLIC_API_URL=your-api-url
WEBHOOK_SECRET=your-webhook-secret
```

### Build Commands
```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions or changes
- `chore:` Build process or auxiliary tool changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Project Wiki](link-to-wiki)
- **Issues**: [GitHub Issues](link-to-issues)
- **Discussions**: [GitHub Discussions](link-to-discussions)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) for animations
- [@dnd-kit](https://dndkit.com/) for drag and drop functionality

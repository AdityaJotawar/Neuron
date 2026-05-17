# Neuron Web UI - Codebase Structure

> **Last Updated:** December 30, 2025  
> **Version:** 0.0.0  
> **Framework:** React 18 + Vite + TypeScript

---

## 📋 Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Directory Breakdown](#directory-breakdown)
- [Component Architecture](#component-architecture)
- [State Management](#state-management)
- [API Layer](#api-layer)
- [Routing](#routing)
- [Styling](#styling)
- [Development Workflow](#development-workflow)

---

## Overview

Neuron Web is a modern financial management application built with React and TypeScript. The application provides comprehensive tools for tracking accounts, transactions, budgets, investments, and financial health metrics.

### Key Features
- 📊 **Dashboard** - Financial overview with health scores and quick actions
- 💳 **Accounts** - Multi-account management and tracking
- 💰 **Transactions** - Transaction history and categorization
- 📈 **Portfolio** - Investment tracking and performance
- 🎯 **Budgets** - Budget planning and monitoring
- 📑 **Reports** - Financial analytics and insights
- 📥 **Imports** - Data import functionality
- ⚙️ **Settings** - User preferences and configuration

---

## Technology Stack

### Core Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| **React** | ^18.2.0 | UI framework |
| **React Router DOM** | ^7.9.6 | Client-side routing |
| **TypeScript** | ~5.9.3 | Type safety |
| **Vite** | ^7.2.4 | Build tool & dev server |
| **Tailwind CSS** | ^4.1.17 | Utility-first styling |

### State & Data Management
| Package | Version | Purpose |
|---------|---------|---------|
| **Zustand** | ^4.4.0 | Global state management |
| **TanStack Query** | ^5.90.11 | Server state & caching |

### UI & Visualization
| Package | Version | Purpose |
|---------|---------|---------|
| **Recharts** | ^3.4.1 | Charts and data visualization |
| **Lucide React** | ^0.554.0 | Icon library |
| **clsx** | ^2.1.1 | Conditional classNames |
| **tailwind-merge** | ^3.4.0 | Tailwind class merging |

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

---

## Project Structure

```
apps/web/
├── dist/                      # Build output (generated)
├── node_modules/              # Dependencies (generated)
├── public/                    # Static assets
├── src/                       # Source code
│   ├── api/                   # API layer
│   ├── assets/                # Images, fonts, etc.
│   ├── components/            # React components
│   ├── hooks/                 # Custom React hooks
│   ├── pages/                 # Page-level components
│   ├── stores/                # Zustand state stores
│   ├── styles/                # Global styles & themes
│   ├── tests/                 # Test files
│   ├── types/                 # TypeScript type definitions
│   ├── utils/                 # Utility functions
│   ├── App.tsx                # Root application component
│   └── main.tsx               # Application entry point
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
├── eslint.config.js           # ESLint configuration
├── index.html                 # HTML entry point
├── package.json               # Dependencies & scripts
├── postcss.config.js          # PostCSS configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
├── tsconfig.app.json          # App-specific TS config
├── tsconfig.node.json         # Node-specific TS config
└── vite.config.ts             # Vite configuration
```

---

## Directory Breakdown

### 📁 `/src/api/` - API Layer

Handles all data fetching and API communication.

```
api/
├── client.ts              # Main API client configuration
├── types.ts               # API-related type definitions
├── mock/                  # Mock API implementations
│   ├── client.ts          # Mock API client
│   ├── accounts.ts        # Mock account endpoints
│   ├── dashboard.ts       # Mock dashboard endpoints
│   ├── transactions.ts    # Mock transaction endpoints
│   └── data/              # Mock data sources
│       ├── mockAccounts.ts
│       ├── mockBudgets.ts
│       ├── mockDashboard.ts
│       ├── mockImports.ts
│       ├── mockStockHoldings.ts
│       └── mockTransactions.ts
├── real/                  # Real API implementations (placeholder)
└── types/                 # API type definitions (placeholder)
```

**Purpose:**
- Abstracts data fetching logic from components
- Provides mock data for development
- Prepares structure for real API integration
- Centralizes API configuration and error handling

---

### 📁 `/src/components/` - React Components

Organized by component type and feature domain.

```
components/
├── features/              # Feature-specific components
│   ├── accounts/
│   │   ├── AccountCard.tsx
│   │   └── AccountDetailsModal.tsx
│   ├── budgets/           # Budget-related components
│   ├── chat/              # Chat/AI assistant components
│   ├── dashboard/
│   │   ├── AlertsPanel.tsx
│   │   ├── CashFlowCalendar.tsx
│   │   ├── FinancialHealthScore.tsx
│   │   ├── QuickActionsPanel.tsx
│   │   ├── SavingsGoalsWidget.tsx
│   │   └── StatCard.tsx
│   ├── investments/       # Investment/portfolio components
│   └── transactions/
│       ├── TransactionDetailsModal.tsx
│       └── TransactionFormModal.tsx
├── layout/                # Layout components
│   ├── Footer.tsx
│   ├── Navigation.tsx
│   └── Sidebar.tsx
└── ui/                    # Reusable UI primitives
    ├── Badge.tsx
    ├── Button.tsx
    ├── Card.tsx
    ├── EmptyState.tsx
    ├── Input.tsx
    ├── Label.tsx
    ├── Modal.tsx
    ├── Skeleton.tsx
    └── StatCard.tsx
```

**Component Categories:**

#### 1. **UI Components** (`/ui/`)
Reusable, generic components with no business logic.
- **Badge** - Status indicators and labels
- **Button** - Primary, secondary, and variant buttons
- **Card** - Container component with consistent styling
- **EmptyState** - Placeholder for empty data states
- **Input** - Form input fields
- **Label** - Form labels
- **Modal** - Dialog/overlay component
- **Skeleton** - Loading state placeholders
- **StatCard** - Metric display cards

#### 2. **Feature Components** (`/features/`)
Domain-specific components with business logic.

**Accounts:**
- Account cards and detail views
- Account management modals

**Dashboard:**
- Financial health scoring
- Quick action panels
- Alerts and notifications
- Cash flow calendar
- Savings goal tracking

**Transactions:**
- Transaction detail views
- Transaction creation/editing forms

**Budgets, Chat, Investments:**
- Placeholder directories for future features

#### 3. **Layout Components** (`/layout/`)
Application structure and navigation.
- **Navigation** - Top navigation bar
- **Sidebar** - Side navigation panel
- **Footer** - Application footer

---

### 📁 `/src/pages/` - Page Components

Top-level route components that compose features.

```
pages/
├── Accounts.tsx           # /accounts - Account management
├── Budget.tsx             # /budget - Budget planning
├── Dashboard.tsx          # / - Main dashboard
├── Imports.tsx            # /imports - Data import
├── Portfolio.tsx          # /portfolio - Investment tracking
├── Reports.tsx            # /reports - Analytics & reports
├── Settings.tsx           # /settings - User settings
└── Transactions.tsx       # /transactions - Transaction history
```

**Responsibilities:**
- Route-level data fetching
- Page layout composition
- Feature component orchestration
- Page-specific state management

---

### 📁 `/src/hooks/` - Custom React Hooks

Reusable logic and state management hooks.

```
hooks/
├── index.ts               # Hook exports
└── mock/                  # Mock data hooks
    ├── useAccountsMock.ts
    ├── useBudgetsMock.ts
    ├── useStockHoldingsMock.ts
    └── useTransactionsMock.ts
```

**Purpose:**
- Encapsulate reusable component logic
- Manage local state patterns
- Provide mock data during development
- Abstract data fetching patterns

---

### 📁 `/src/stores/` - State Management

Zustand stores for global application state.

```
stores/
├── financialStore.ts      # Financial data state
└── [other stores]         # Additional state stores
```

**State Management Strategy:**
- **Zustand** for global app state
- **TanStack Query** for server state
- Local state for component-specific data

---

### 📁 `/src/styles/` - Styling

Global styles and theme configuration.

```
styles/
├── globals.css            # Global CSS styles
├── index.css              # CSS entry point
└── themes.ts              # Theme configuration
```

**Styling Approach:**
- **Tailwind CSS** for utility-first styling
- **CSS Modules** for component-specific styles
- **Theme system** for consistent design tokens

---

### 📁 `/src/types/` - TypeScript Types

Centralized type definitions.

```
types/
└── index.ts               # Type definitions (3809 bytes)
```

**Contains:**
- Domain models (Account, Transaction, Budget, etc.)
- API response/request types
- Component prop types
- Utility types

---

### 📁 `/src/utils/` - Utility Functions

Helper functions and utilities.

```
utils/
├── index.ts               # Utility exports
└── accountBalance.ts      # Account balance calculations
```

**Common Utilities:**
- Date formatting
- Number formatting (currency, percentages)
- Data transformations
- Validation helpers

---

## Component Architecture

### Design Principles

1. **Separation of Concerns**
   - UI components are presentational
   - Feature components contain business logic
   - Pages orchestrate features

2. **Composition over Inheritance**
   - Small, focused components
   - Compose complex UIs from simple parts

3. **Type Safety**
   - All components are fully typed
   - Props interfaces defined
   - Type inference where possible

4. **Reusability**
   - UI components are generic and reusable
   - Feature components are domain-specific
   - Hooks extract reusable logic

### Component Hierarchy

```
App
├── Router
│   ├── Navigation (Layout)
│   └── Routes
│       ├── Dashboard (Page)
│       │   ├── FinancialHealthScore (Feature)
│       │   ├── QuickActionsPanel (Feature)
│       │   ├── AlertsPanel (Feature)
│       │   ├── CashFlowCalendar (Feature)
│       │   └── SavingsGoalsWidget (Feature)
│       ├── Accounts (Page)
│       │   ├── AccountCard (Feature)
│       │   └── AccountDetailsModal (Feature)
│       ├── Transactions (Page)
│       │   ├── TransactionDetailsModal (Feature)
│       │   └── TransactionFormModal (Feature)
│       └── [Other Pages...]
```

---

## State Management

### Global State (Zustand)

**Financial Store** (`stores/financialStore.ts`)
- Account balances
- Transaction data
- Budget information
- Portfolio holdings

### Server State (TanStack Query)

- API data fetching
- Caching strategies
- Background refetching
- Optimistic updates

### Local State (React useState/useReducer)

- Form inputs
- UI toggles
- Modal visibility
- Component-specific data

---

## API Layer

### Architecture

```
┌─────────────┐
│  Component  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Hook     │ (useAccountsMock, etc.)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ API Client  │ (client.ts)
└──────┬──────┘
       │
       ├──────────────┬──────────────┐
       ▼              ▼              ▼
┌──────────┐   ┌──────────┐   ┌──────────┐
│   Mock   │   │   Real   │   │  Types   │
│   API    │   │   API    │   │          │
└──────────┘   └──────────┘   └──────────┘
```

### Mock API

Currently using mock data for development:
- `mockAccounts.ts` - Account data
- `mockTransactions.ts` - Transaction history
- `mockBudgets.ts` - Budget information
- `mockDashboard.ts` - Dashboard metrics
- `mockStockHoldings.ts` - Investment data
- `mockImports.ts` - Import data

### Real API Integration

Placeholder structure ready for:
- REST API endpoints
- GraphQL queries
- WebSocket connections
- Authentication

---

## Routing

### Route Configuration

| Path | Component | Description |
|------|-----------|-------------|
| `/` | Dashboard | Main dashboard view |
| `/accounts` | Accounts | Account management |
| `/transactions` | Transactions | Transaction history |
| `/portfolio` | Portfolio | Investment tracking |
| `/budget` | Budget | Budget planning |
| `/reports` | Reports | Financial reports |
| `/imports` | Imports | Data import tools |
| `/settings` | Settings | User settings |

### Navigation Structure

```tsx
<Router>
  <Navigation />
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/accounts" element={<Accounts />} />
    {/* ... other routes */}
  </Routes>
</Router>
```

---

## Styling

### Tailwind CSS Configuration

**Design System:**
- Custom color palette
- Responsive breakpoints
- Typography scale
- Spacing system
- Shadow utilities

### Global Styles

- CSS reset/normalize
- Custom CSS properties
- Theme variables
- Animation keyframes

### Component Styling

```tsx
// Example: Using Tailwind utilities
<Card className="p-6 bg-white rounded-lg shadow-md">
  <Button variant="primary" size="lg">
    Click Me
  </Button>
</Card>
```

---

## Development Workflow

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Development Server

- **URL:** `http://localhost:5173` (default)
- **Hot Module Replacement (HMR)** enabled
- **Fast Refresh** for React components

### Build Process

1. TypeScript compilation (`tsc -b`)
2. Vite bundling
3. Asset optimization
4. Output to `dist/` directory

### Code Quality

- **ESLint** for code linting
- **TypeScript** for type checking
- **Prettier** (recommended) for formatting

---

## File Naming Conventions

### Components
- **PascalCase** for component files: `AccountCard.tsx`
- **PascalCase** for component names: `export default AccountCard`

### Utilities & Hooks
- **camelCase** for utility files: `accountBalance.ts`
- **camelCase** with `use` prefix for hooks: `useAccountsMock.ts`

### Styles
- **kebab-case** for CSS files: `globals.css`
- **camelCase** for TypeScript style files: `themes.ts`

### Types
- **PascalCase** for type/interface names: `Account`, `Transaction`
- **camelCase** for type files: `index.ts`

---

## Best Practices

### Component Design

✅ **Do:**
- Keep components small and focused
- Use TypeScript for all components
- Extract reusable logic into hooks
- Use composition over prop drilling
- Implement proper error boundaries

❌ **Don't:**
- Mix business logic with UI components
- Create deeply nested component trees
- Use inline styles (use Tailwind)
- Ignore TypeScript errors
- Duplicate code across components

### State Management

✅ **Do:**
- Use local state for UI-only state
- Use Zustand for global app state
- Use TanStack Query for server state
- Keep state as close to usage as possible

❌ **Don't:**
- Put everything in global state
- Mutate state directly
- Ignore loading/error states
- Over-fetch data

### Performance

✅ **Do:**
- Use React.memo for expensive components
- Implement code splitting with lazy loading
- Optimize images and assets
- Use proper key props in lists

❌ **Don't:**
- Render large lists without virtualization
- Create new objects/functions in render
- Ignore bundle size
- Skip performance profiling

---

## Future Enhancements

### Planned Features
- [ ] Real API integration
- [ ] Authentication & authorization
- [ ] Advanced budget tracking
- [ ] AI-powered financial insights (Chat feature)
- [ ] Multi-currency support
- [ ] Data export functionality
- [ ] Mobile responsive improvements
- [ ] Dark mode support
- [ ] Accessibility (a11y) improvements
- [ ] Unit & integration tests
- [ ] E2E testing with Playwright/Cypress

### Technical Debt
- [ ] Implement real API layer
- [ ] Add comprehensive test coverage
- [ ] Optimize bundle size
- [ ] Improve error handling
- [ ] Add loading states
- [ ] Implement proper caching strategies

---

## Contributing

### Adding a New Feature

1. **Create types** in `/src/types/index.ts`
2. **Add mock data** in `/src/api/mock/data/`
3. **Create API endpoints** in `/src/api/mock/`
4. **Build UI components** in `/src/components/ui/`
5. **Create feature components** in `/src/components/features/[feature]/`
6. **Add custom hooks** in `/src/hooks/`
7. **Create page component** in `/src/pages/`
8. **Add route** in `App.tsx`
9. **Update navigation** in `Navigation.tsx`

### Code Review Checklist

- [ ] TypeScript types defined
- [ ] Components are properly typed
- [ ] No ESLint errors
- [ ] Follows naming conventions
- [ ] Responsive design implemented
- [ ] Accessibility considered
- [ ] Error states handled
- [ ] Loading states implemented

---

## Resources

### Documentation
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Router](https://reactrouter.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [TanStack Query](https://tanstack.com/query/latest)

### Tools
- [VS Code](https://code.visualstudio.com/) - Recommended IDE
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools) (for Zustand)

---

## Contact & Support

For questions or issues related to this codebase, please refer to the main project documentation or reach out to the development team.

---

**Document Version:** 1.0.0  
**Last Updated:** December 30, 2025  
**Maintained By:** Neuron Development Team

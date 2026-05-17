# 📐 Ideal Codebase Structure — Neuron Web App

> Tailored specifically to this codebase: a **React 18 + Vite 7 + TypeScript + TanStack Query + Zustand + Tailwind v4** financial dashboard app.
> Generated: 2026-02-18

---

## 🗂️ Full Ideal Directory Tree

```
apps/web/
│
├── index.html                        ← Vite entry HTML (with full SEO meta tags)
├── vite.config.ts                    ← Vite config with aliases, proxy, build opts
├── tsconfig.json                     ← Root TS config (references app + node)
├── tsconfig.app.json                 ← App TS config (strict mode, bundler resolution)
├── tsconfig.node.json                ← Node TS config (for vite.config.ts)
├── postcss.config.js                 ← PostCSS (autoprefixer)
├── eslint.config.js                  ← ESLint v9 flat config
├── playwright.config.ts              ← E2E test config
├── package.json                      ← name: "@neuron/web"
├── .env.example                      ← Env var documentation
├── .gitignore
│
├── e2e/                              ← Playwright E2E tests (one file per page)
│   ├── dashboard.spec.ts
│   ├── accounts.spec.ts
│   ├── transactions.spec.ts
│   ├── portfolio.spec.ts
│   ├── budget.spec.ts
│   ├── imports.spec.ts
│   └── chat.spec.ts
│
└── src/
    │
    ├── main.tsx                      ← App bootstrap (QueryClient, StrictMode)
    │
    ├── app/                          ← App-level wiring (router, providers)
    │   ├── App.tsx                   ← Root layout shell
    │   ├── router.tsx                ← Centralized routes with React.lazy()
    │   └── providers.tsx             ← Wraps QueryClientProvider, future ThemeProvider
    │
    ├── api/                          ← API contracts only (no mock data here)
    │   ├── client.ts                 ← ApiClient interface + createApiClient() factory
    │   └── types.ts                  ← Single source: ApiResponse<T>, PaginatedResponse<T>, etc.
    │
    ├── mocks/                        ← ALL mock concerns in one place
    │   ├── client.ts                 ← createMockApiClient() implementation
    │   ├── hooks/                    ← Mock TanStack Query hooks
    │   │   ├── useAccountsMock.ts
    │   │   ├── useTransactionsMock.ts
    │   │   ├── useStockHoldingsMock.ts
    │   │   └── useBudgetsMock.ts
    │   └── data/                     ← Static mock data fixtures
    │       ├── accounts.ts
    │       ├── transactions.ts
    │       ├── budgets.ts
    │       ├── stockHoldings.ts
    │       ├── dashboard.ts
    │       └── imports.ts
    │
    ├── components/
    │   │
    │   ├── ui/                       ← Pure, reusable primitives (no business logic)
    │   │   ├── index.ts              ← Barrel: export all UI components
    │   │   ├── Button.tsx
    │   │   ├── Card.tsx              ← Card, CardHeader, CardContent, CardFooter, CardTitle
    │   │   ├── Badge.tsx
    │   │   ├── Input.tsx
    │   │   ├── Label.tsx
    │   │   ├── Modal.tsx
    │   │   ├── Skeleton.tsx
    │   │   └── EmptyState.tsx
    │   │
    │   ├── layout/                   ← App shell components
    │   │   ├── index.ts              ← Barrel export
    │   │   ├── Navigation.tsx        ← Top nav bar
    │   │   ├── Sidebar.tsx           ← Side nav (if used)
    │   │   └── Footer.tsx
    │   │
    │   └── features/                 ← Domain-specific components (grouped by feature)
    │       │
    │       ├── accounts/
    │       │   ├── index.ts          ← Barrel export
    │       │   ├── AccountCard.tsx
    │       │   └── AccountDetailsModal.tsx
    │       │
    │       ├── dashboard/
    │       │   ├── index.ts          ← Barrel export
    │       │   ├── widgets/          ← Self-contained dashboard widgets
    │       │   │   ├── StatsOverview.tsx
    │       │   │   ├── AccountsOverview.tsx
    │       │   │   ├── QuickActionsPanel.tsx
    │       │   │   ├── AlertsPanel.tsx
    │       │   │   ├── SavingsGoalsWidget.tsx
    │       │   │   ├── CashFlowCalendar.tsx
    │       │   │   └── FinancialHealthScore.tsx
    │       │   ├── charts/           ← Chart components (Recharts wrappers)
    │       │   │   ├── NetWorthChart.tsx
    │       │   │   ├── AssetAllocationChart.tsx
    │       │   │   ├── MonthlyExpensesChart.tsx
    │       │   │   ├── PortfolioPerformanceChart.tsx
    │       │   │   └── ChartsGrid.tsx
    │       │   ├── DashboardHeader.tsx
    │       │   └── DashboardStatCard.tsx  ← Rich stat card (sparkline, trend, format)
    │       │                              ← Renamed from StatCard to avoid confusion with ui/
    │       │
    │       ├── transactions/
    │       │   ├── index.ts
    │       │   ├── TransactionFormModal.tsx
    │       │   └── TransactionDetailsModal.tsx
    │       │
    │       ├── chat/
    │       │   ├── index.ts
    │       │   ├── ChatInterface.tsx
    │       │   ├── ChatInterface.test.tsx
    │       │   ├── MessageBubble.tsx
    │       │   └── MessageBubble.test.tsx
    │       │
    │       └── emergencyFund/        ← Complete the feature or remove
    │           ├── index.ts
    │           └── EmergencyFundForm.tsx
    │
    ├── hooks/                        ← Real TanStack Query hooks (swap mock → real)
    │   ├── index.ts                  ← Single barrel: re-exports real OR mock hooks
    │   ├── useAccounts.ts            ← Real hook (calls api/client.ts)
    │   ├── useTransactions.ts
    │   ├── useStockHoldings.ts
    │   └── useBudgets.ts
    │
    ├── pages/                        ← Route-level page components (thin orchestrators)
    │   ├── Dashboard.tsx
    │   ├── Accounts.tsx
    │   ├── Transactions.tsx
    │   ├── Portfolio.tsx
    │   ├── Budget.tsx
    │   ├── Reports.tsx
    │   ├── Imports.tsx
    │   ├── Chat.tsx
    │   ├── Settings.tsx
    │   └── NotFound.tsx              ← Add a 404 page
    │
    ├── services/                     ← Non-React business logic / external integrations
    │   ├── aiService.ts              ← Refactor to module export (not singleton class)
    │   └── aiService.test.ts
    │
    ├── stores/                       ← Zustand global state
    │   ├── index.ts                  ← Barrel export
    │   ├── financialStore.ts         ← Accounts, transactions, budgets, holdings
    │   └── userStore.ts              ← Auth, user prefs (persist middleware)
    │
    ├── styles/
    │   └── index.css                 ← Single CSS entry: @import "tailwindcss" + @theme tokens
    │                                 ← globals.css content merged here, themes.ts removed
    │
    ├── types/
    │   └── index.ts                  ← All domain types: Account, Transaction, Budget, etc.
    │
    └── utils/
        ├── index.ts                  ← cn(), formatCurrency, formatDate, formatPercent
        ├── accountBalance.ts         ← Account balance calculation helpers
        └── constants.ts              ← App-wide constants (themes, enums, config values)
                                      ← themes.ts content moved here
```

---

## 🔑 Key Structural Decisions Explained

### 1. `app/` — Separate App Wiring from Components

```
src/app/
├── App.tsx        ← Layout shell only (Navigation + <Outlet>)
├── router.tsx     ← All routes, lazy-loaded
└── providers.tsx  ← All React context providers
```

**Why:** `App.tsx` currently does too much — it's both the layout AND the router. Splitting these makes each file have a single responsibility.

```ts
// src/app/router.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { lazy, Suspense } from 'react'

const Dashboard = lazy(() => import('../pages/Dashboard'))
const Accounts  = lazy(() => import('../pages/Accounts'))
// ... all pages lazy-loaded

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,           // Layout wrapper
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'accounts', element: <Accounts /> },
      { path: 'transactions', element: <Transactions /> },
      { path: 'portfolio', element: <Portfolio /> },
      { path: 'budget', element: <Budget /> },
      { path: 'reports', element: <Reports /> },
      { path: 'imports', element: <Imports /> },
      { path: 'chat', element: <Chat /> },
      { path: 'settings', element: <Settings /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
```

---

### 2. `mocks/` — Centralized Mock Layer

```
src/mocks/
├── client.ts          ← Mock ApiClient implementation
├── hooks/             ← Mock TanStack Query hooks
└── data/              ← Raw fixture data
```

**Why:** Currently mock data is split between `api/mock/` and `hooks/mock/`. One `mocks/` folder at the `src/` root is the single source of truth. When you're ready to go live, you delete this folder and update `hooks/index.ts` to point to real hooks.

```ts
// src/hooks/index.ts — the toggle switch
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export const useAccounts    = USE_MOCK
  ? (await import('../mocks/hooks/useAccountsMock')).useAccounts
  : (await import('./useAccounts')).useAccounts
```

---

### 3. `components/ui/` — No `StatCard` Here

The current `ui/StatCard.tsx` (simple, 36 lines) and `features/dashboard/StatCard.tsx` (rich, 105 lines with sparklines) are **two different components** that happen to share a name.

**Resolution:**
- Keep `ui/` version → rename to `ui/SimpleStatCard.tsx` or just remove it (it's not used anywhere)
- Keep `features/dashboard/StatCard.tsx` → rename to `DashboardStatCard.tsx` for clarity

```
components/ui/           ← ONLY generic primitives
  Button, Card, Badge, Input, Label, Modal, Skeleton, EmptyState

components/features/dashboard/
  DashboardStatCard.tsx  ← Rich stat card with sparklines, trends, formatting
```

---

### 4. `components/features/dashboard/` — Sub-grouped

With 13+ files, the dashboard folder needs internal organization:

```
features/dashboard/
├── widgets/    ← Self-contained dashboard panels (data + UI)
├── charts/     ← Recharts wrappers (pure visualization)
├── DashboardHeader.tsx
└── DashboardStatCard.tsx
```

---

### 5. `hooks/` — Real Hooks Only, Mock Hooks in `mocks/`

```ts
// src/hooks/useAccounts.ts — real hook
import { useQuery } from '@tanstack/react-query'
import { createApiClient } from '../api/client'

export function useAccounts() {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const client = await createApiClient('real')
      const res = await client.getAccounts()
      return res.data
    },
  })
}
```

The `hooks/index.ts` barrel controls whether mock or real hooks are exported — a single line change to go live.

---

### 6. `styles/` — Single CSS File

```
styles/
└── index.css   ← Everything here
```

```css
/* src/styles/index.css */
@import "tailwindcss";

/* Tailwind v4 CSS-first theme */
@theme {
  --color-primary-50:  #ECFDF5;
  --color-primary-500: #10B981;
  --color-primary-600: #059669;
  --color-primary-700: #047857;
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'SF Mono', Monaco, Inconsolata, monospace;
}

/* Base resets */
*, *::before, *::after { box-sizing: border-box; }

body {
  margin: 0;
  font-family: var(--font-sans);
  background-color: var(--color-slate-50);
  color: var(--color-slate-900);
  -webkit-font-smoothing: antialiased;
}

/* Micro-animations */
.stat-card    { transition: all 200ms ease-out; }
.account-card { transition: all 150ms ease-out; }
.account-card:hover { filter: brightness(1.05); cursor: pointer; }
```

**Remove:** `globals.css` (dead file), `themes.ts` (move constants to `utils/constants.ts`)

---

### 7. `utils/constants.ts` — Home for `themes.ts` Content

```ts
// src/utils/constants.ts
export const THEME_COLORS = {
  primary: { 50: '#ECFDF5', 500: '#10B981', 600: '#059669', 700: '#047857' },
  emerald: { 500: '#10b981' },
  red:     { 500: '#ef4444', 600: '#dc2626' },
} as const

export const QUERY_KEYS = {
  accounts:     ['accounts']     as const,
  transactions: ['transactions'] as const,
  budgets:      ['budgets']      as const,
  stockHoldings:['stockHoldings']as const,
} as const

export const ROUTES = {
  dashboard:    '/',
  accounts:     '/accounts',
  transactions: '/transactions',
  portfolio:    '/portfolio',
  budget:       '/budget',
  reports:      '/reports',
  imports:      '/imports',
  chat:         '/chat',
  settings:     '/settings',
} as const
```

---

### 8. `pages/` — Thin Orchestrators Only

Pages should be thin — they orchestrate feature components and hooks, but contain **no business logic** themselves.

```ts
// src/pages/Dashboard.tsx — IDEAL (thin)
import { useDashboard } from '../hooks/useDashboard'
import { DashboardHeader, DashboardStatCard } from '../components/features/dashboard'
import { ChartsGrid, StatsOverview, AccountsOverview } from '../components/features/dashboard'

export default function Dashboard() {
  const dashboard = useDashboard()   // All state extracted to custom hook
  return (
    <div className="pt-16">
      <div className="max-w-[1440px] mx-auto px-8 py-8">
        <DashboardHeader {...dashboard.headerProps} />
        <StatsOverview {...dashboard.statsProps} />
        <AccountsOverview {...dashboard.accountsProps} />
        <ChartsGrid {...dashboard.chartsProps} />
      </div>
    </div>
  )
}
```

---

## 📋 File-by-File Migration Plan

| Current Location                                     | Action                              | Ideal Location                            |
| ---------------------------------------------------- | ----------------------------------- | ----------------------------------------- |
| `src/App.tsx`                                        | Split into layout + router          | `src/app/App.tsx` + `src/app/router.tsx`  |
| `src/api/mock/`                                      | Move to `src/mocks/`                | `src/mocks/client.ts` + `src/mocks/data/` |
| `src/hooks/mock/`                                    | Move to `src/mocks/hooks/`          | `src/mocks/hooks/`                        |
| `src/components/ui/StatCard.tsx`                     | Delete (unused simple version)      | ❌ Remove                                  |
| `src/components/features/dashboard/StatCard.tsx`     | Rename                              | `DashboardStatCard.tsx`                   |
| `src/styles/globals.css`                             | Merge into `index.css`, delete file | `src/styles/index.css`                    |
| `src/styles/themes.ts`                               | Move to utils                       | `src/utils/constants.ts`                  |
| `src/components/features/dashboard/*.tsx` (13 files) | Sub-group                           | `widgets/` + `charts/` subfolders         |
| `src/hooks/index.ts`                                 | Point to real hooks                 | `src/hooks/useAccounts.ts` etc.           |
| All `components/ui/`, `layout/`, `features/*/`       | Add barrel files                    | `index.ts` in each folder                 |
| `src/pages/Dashboard.tsx`                            | Extract state to hook               | `src/hooks/useDashboard.ts`               |
| `e2e/chat.spec.ts`                                   | Add more specs                      | `e2e/dashboard.spec.ts`, etc.             |

---

## ✅ Barrel File Convention (Apply Everywhere)

Every folder under `components/` and `hooks/` should have an `index.ts`:

```ts
// src/components/ui/index.ts
export { default as Button }    from './Button'
export { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from './Card'
export { default as Badge }     from './Badge'
export { default as Input }     from './Input'
export { default as Label }     from './Label'
export { default as Modal }     from './Modal'
export { default as Skeleton }  from './Skeleton'
export { default as EmptyState } from './EmptyState'
```

```ts
// src/components/features/dashboard/index.ts
export { default as DashboardHeader }    from './DashboardHeader'
export { default as DashboardStatCard }  from './DashboardStatCard'
export { default as StatsOverview }      from './widgets/StatsOverview'
export { default as AccountsOverview }   from './widgets/AccountsOverview'
export { default as ChartsGrid }         from './charts/ChartsGrid'
// ... etc
```

Then imports become clean everywhere:
```ts
// Before
import DashboardHeader from '../components/features/dashboard/DashboardHeader.tsx'
import StatsOverview   from '../components/features/dashboard/StatsOverview.tsx'

// After
import { DashboardHeader, StatsOverview } from '@/components/features/dashboard'
```

---

## 🔧 `vite.config.ts` — Required for Path Aliases

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },

  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor:   ['react', 'react-dom', 'react-router-dom'],
          query:    ['@tanstack/react-query'],
          charts:   ['recharts'],
          zustand:  ['zustand'],
        },
      },
    },
  },

  // Vitest config (replaces Jest)
  test: {
    environment: 'jsdom',
    setupFiles:  ['./src/test-setup.ts'],
    globals:     true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
})
```

---

## 🎯 Summary: What Changes vs What Stays

### ✅ Keep As-Is
- `tsconfig.app.json` — already excellent
- `eslint.config.js` — already modern flat config
- `playwright.config.ts` — well configured
- `stores/financialStore.ts` — clean Zustand with devtools
- `stores/userStore.ts` — correct persist + partialize
- `types/index.ts` — comprehensive domain types
- `utils/index.ts` — clean utility functions
- `main.tsx` — QueryClient config is good

### 🔧 Modify
- `vite.config.ts` — add aliases, proxy, build opts, Vitest
- `src/styles/index.css` — add `@theme` block for Tailwind v4
- `src/App.tsx` — split into `app/App.tsx` + `app/router.tsx`
- `package.json` — rename to `@neuron/web`, replace Jest with Vitest
- `src/pages/Dashboard.tsx` — extract state to `useDashboard()` hook

### ❌ Remove
- `tailwind.config.js` — replaced by `@theme` in CSS (Tailwind v4)
- `src/styles/globals.css` — merge into `index.css`, delete
- `src/styles/themes.ts` — move to `utils/constants.ts`
- `src/components/ui/StatCard.tsx` — unused simple version, delete
- All Jest packages from `package.json`

### ➕ Add
- `src/app/router.tsx` — centralized lazy-loaded routes
- `src/app/providers.tsx` — provider composition
- `src/mocks/` — unified mock directory
- `src/hooks/useAccounts.ts` etc. — real hook files
- `src/hooks/useDashboard.ts` — dashboard state hook
- `src/utils/constants.ts` — app-wide constants
- `src/pages/NotFound.tsx` — 404 page
- `index.ts` barrel files in every component folder
- `e2e/dashboard.spec.ts`, `accounts.spec.ts`, `transactions.spec.ts`, etc.


### User Input

so following this ideal structure will make this code base easily scalable ?

### Planner Response

Yes — but with important nuance. Let me break down **exactly what each change buys you** in terms of scalability, and where the real scaling limits are.

---

## 🚀 Yes, Here's What Each Change Directly Enables

### 1. `app/router.tsx` with `React.lazy()` → **Performance Scales**

```ts
const Dashboard = lazy(() => import('../pages/Dashboard'))
const Portfolio = lazy(() => import('../pages/Portfolio'))
```

**Right now:** All 9 pages are bundled into one JS file. As the app grows, your initial load time grows linearly with every new page, component, and library you add.

**After:** Each page becomes its own chunk. Users only download the code for the page they're visiting. Your [Portfolio.tsx](cci:7://file:///Users/adityasj/Documents/Workspace/Projects/Neuron/apps/web/src/pages/Portfolio.tsx:0:0-0:0) is 21KB — users on the Dashboard page never download that until they navigate there.

**Scale impact:** Goes from "works fine at 9 pages" → "works fine at 50+ pages"

---

### 2. `mocks/` Centralization → **Team Scales**

**Right now:** A new developer joining the team has to know that mock data lives in [api/mock/data/](cci:7://file:///Users/adityasj/Documents/Workspace/Projects/Neuron/apps/web/src/api/mock/data:0:0-0:0) but mock hooks live in [hooks/mock/](cci:7://file:///Users/adityasj/Documents/Workspace/Projects/Neuron/apps/web/src/hooks/mock:0:0-0:0). That's non-obvious.

**After:** One folder, one rule. When you're ready to connect a real backend:
```ts
// hooks/index.ts — one line change to go live
- export { useAccounts } from '../mocks/hooks/useAccountsMock'
+ export { useAccounts } from './useAccounts'
```

**Scale impact:** Onboarding time drops. Backend integration is a surgical swap, not a hunt across the codebase.

---

### 3. Barrel [index.ts](cci:7://file:///Users/adityasj/Documents/Workspace/Projects/Neuron/apps/web/src/hooks/index.ts:0:0-0:0) Files → **Refactoring Scales**

**Right now:** If you rename or move [DashboardHeader.tsx](cci:7://file:///Users/adityasj/Documents/Workspace/Projects/Neuron/apps/web/src/components/features/dashboard/DashboardHeader.tsx:0:0-0:0), you have to find and update every import path across every file that references it.

**After:** Only the barrel [index.ts](cci:7://file:///Users/adityasj/Documents/Workspace/Projects/Neuron/apps/web/src/hooks/index.ts:0:0-0:0) needs updating. All consumers import from `@/components/features/dashboard` — they never know the internal file moved.

**Scale impact:** Refactoring cost stays flat as the codebase grows.

---

### 4. `useDashboard()` Hook → **Feature Complexity Scales**

**Right now:** [Dashboard.tsx](cci:7://file:///Users/adityasj/Documents/Workspace/Projects/Neuron/apps/web/src/pages/Dashboard.tsx:0:0-0:0) has 12 `useState` calls, 3 `useMemo` calls, a `useEffect`, and renders 10+ child components. Adding one new dashboard widget means touching this already-complex file.

**After:** The page component is a thin orchestrator. New widgets get their own state inside their own components or a dedicated hook. The page file stays small regardless of how many widgets you add.

**Scale impact:** Dashboard can grow to 30 widgets without the page file becoming unmanageable.

---

### 5. Path Aliases (`@/`) → **Developer Experience Scales**

**Right now:**
```ts
import { useAccounts } from '../../../hooks/index.ts'
import type { Account } from '../../../types/index.ts'
```

**After:**
```ts
import { useAccounts } from '@/hooks'
import type { Account } from '@/types'
```

**Scale impact:** As folder nesting grows, relative paths become `../../../../` nightmares. Aliases stay constant regardless of depth.

---

## ⚠️ What the Structure Alone Does NOT Solve

Here's the honest part — structure is necessary but not sufficient for scalability:

### 1. **No Auth Guard / Protected Routes**
```
Current: All 9 routes are publicly accessible
```
As you add real users, you need route protection:
```ts
// app/router.tsx
{ path: '/dashboard', element: <ProtectedRoute><Dashboard /></ProtectedRoute> }
```
The structure supports this, but you still need to build it.

---

### 2. **The `financialStore.ts` Will Become a God Store**
```ts
// Currently stores: accounts + transactions + budgets + stockHoldings + portfolioStats
// All in ONE store
```
As the app grows, this store will accumulate more and more state. The ideal structure doesn't fix this — you'll eventually need to split it:
```
stores/
├── accountsStore.ts
├── transactionsStore.ts
├── portfolioStore.ts
└── userStore.ts
```

---

### 3. **No Error Boundaries**
If `Dashboard.tsx` throws a runtime error, the entire app crashes. As complexity grows, this becomes more likely. You need:
```tsx
// app/router.tsx
{ path: '/', element: <ErrorBoundary><Dashboard /></ErrorBoundary> }
```

---

### 4. **No API Pagination**
```ts
// api/types.ts — PaginatedResponse<T> is defined but never used
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: { page, limit, total, totalPages }
}
```
Your `Transactions.tsx` is already 26KB — the largest page file. As real transaction data grows to thousands of rows, you'll need server-side pagination. The type is there, but the hooks and UI don't implement it yet.

---

### 5. **`pages/` Will Need Sub-folders Eventually**
Right now 9 flat page files is fine. At 20+ pages (e.g., adding `Portfolio/Overview`, `Portfolio/Holdings`, `Portfolio/Performance` as separate routes), you'll need:
```
pages/
├── dashboard/
│   └── index.tsx
├── portfolio/
│   ├── index.tsx
│   ├── Holdings.tsx
│   └── Performance.tsx
```

---

## 📊 Scalability Impact by Change

| Change                      | Scales What              | Without It, Breaks At  |
| --------------------------- | ------------------------ | ---------------------- |
| `router.tsx` + lazy loading | Bundle size / load time  | ~15 pages or ~500KB JS |
| `mocks/` centralization     | Team size / backend swap | 2nd developer joins    |
| Barrel `index.ts` files     | Refactoring cost         | ~20 components         |
| `useDashboard()` hook       | Feature complexity       | ~15 widgets            |
| Path aliases `@/`           | Developer sanity         | 3+ levels of nesting   |
| Split `financialStore`      | State complexity         | ~10 data entities      |
| Error boundaries            | Runtime resilience       | First production bug   |
| Pagination in hooks         | Data volume              | ~1,000 transactions    |
| Protected routes            | Security                 | First real user        |

---

## 🎯 Bottom Line

**Yes — the ideal structure solves the structural scalability problems.** Your codebase will handle:
- ✅ 5x more pages without bundle bloat (lazy loading)
- ✅ 5x more components without import chaos (barrel files + aliases)
- ✅ 5x more developers without confusion (centralized mocks, clear conventions)
- ✅ 5x more dashboard features without page-level complexity (custom hooks)

**But structure is the foundation, not the ceiling.** The next layer of scalability work — auth guards, store splitting, error boundaries, pagination, and real API integration — is what takes this from "well-structured prototype" to "production-grade application." The good news is that the ideal structure makes all of those additions straightforward to implement when the time comes.
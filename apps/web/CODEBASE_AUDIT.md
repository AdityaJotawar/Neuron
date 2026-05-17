# 🔍 Modern React + Vite Codebase Audit Report

> **Project:** `/Users/adityasj/Documents/Workspace/Projects/Neuron/apps/web`
> **Audited:** 2026-02-18
> **Auditor:** Antigravity AI

---

## 📊 Overall Score: **78 / 100** — *Good, with notable gaps*

---

## ✅ What's Done Well (Strengths)

### 1. Build Tooling — Vite 7 + TypeScript 5.9 ✅ Excellent

- Using the latest Vite (`^7.2.4`) and TypeScript (`~5.9.3`) — cutting edge.
- `tsconfig.app.json` is strict and modern:
  - `strict: true`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`
  - `verbatimModuleSyntax`, `erasableSyntaxOnly` — very modern TS flags
  - `moduleResolution: "bundler"` — correct for Vite projects

### 2. State Management — Zustand ✅ Modern

- `financialStore.ts` uses `devtools` middleware — great for debugging
- `userStore.ts` uses `persist` middleware with `partialize` — correctly avoids persisting sensitive tokens
- Clean separation of data state vs UI state within the store

### 3. Data Fetching — TanStack Query v5 ✅ Modern

- `QueryClient` configured in `main.tsx` with sensible defaults (`staleTime: 5min`, `retry: 1`, `refetchOnWindowFocus: false`)
- Hooks like `useAccounts`, `useTransactions` are exported cleanly from `hooks/index.ts`

### 4. Component Architecture ✅ Good Structure

- `components/` is split into `ui/`, `layout/`, and `features/` — follows the recommended pattern
- `ui/` components (`Button`, `Card`, `Modal`, `Badge`, `Skeleton`) are reusable and properly typed
- `Button.tsx` uses variant/size pattern with proper TypeScript `extends React.ButtonHTMLAttributes`

### 5. TypeScript Usage ✅ Strong

- `types/index.ts` is comprehensive — all domain models (`Account`, `Transaction`, `Budget`, `StockHolding`, `ChatMessage`) are well-typed
- `api/types.ts` has proper request/response contracts
- `Partial<T>`, `Omit<T>`, generic `ApiResponse<T>` — all used correctly

### 6. ESLint Config ✅ Modern (Flat Config)

- Uses ESLint v9 flat config (`eslint.config.js`) — the new standard
- Includes `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`

### 7. Testing Setup ✅ Dual Strategy

- Unit tests via Jest + React Testing Library
- E2E tests via Playwright (multi-browser: Chrome, Firefox, Safari)
- `playwright.config.ts` is well-configured with CI-aware retries and parallel execution

### 8. API Abstraction Layer ✅ Good Pattern

- `api/client.ts` defines an `ApiClient` interface — clean contract for swapping mock ↔ real
- Dynamic import for mock client (`await import('./mock/client')`) avoids bundling mock data in production
- `ApiResponse<T>` generic wrapper is consistent

### 9. Utility Functions ✅ Clean

- `utils/index.ts` has `cn()` (clsx + tailwind-merge), `formatCurrency`, `formatDate`, `formatPercent` — all using `Intl` APIs correctly

### 10. Styling ✅ Tailwind v4 + CSS Variables

- Using Tailwind v4 (`@import "tailwindcss"` syntax)
- `globals.css` defines CSS custom properties (design tokens)
- Google Fonts (Inter) loaded via `index.html` with `preconnect`

---

## ⚠️ Issues & Gaps (What Needs Improvement)

### 🔴 Critical Issues

#### 1. Testing Framework Mismatch — Jest vs Vitest

```json
// package.json
"test": "jest"   // ❌ Using Jest in a Vite project
```

**Problem:** The project uses **Jest** for unit tests, but the standard for Vite projects is **Vitest**. Jest requires `ts-jest`, `identity-obj-proxy`, and complex ESM configuration. Vitest is natively integrated with Vite, shares the same config, and is significantly faster.

**Fix:**

```bash
npm remove jest ts-jest jest-environment-jsdom @types/jest identity-obj-proxy
npm install -D vitest @vitest/ui jsdom
```

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    globals: true,
  },
})
```

---

#### 2. `vite.config.ts` is Bare Minimum ❌

```ts
// Current — only 7 lines
export default defineConfig({
  plugins: [react()],
})
```

**Missing:**
- No path aliases (`@/` → `src/`) — forces verbose relative imports like `'../../../hooks/index.ts'`
- No dev proxy for API calls
- No build optimizations (chunk splitting, sourcemaps)

**Fix:**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: {
    port: 3000,
    proxy: { '/api': 'http://localhost:8080' },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: { vendor: ['react', 'react-dom', 'react-router-dom'] },
      },
    },
  },
})
```

---

#### 3. Tokens Stored in Zustand Memory (Security Risk) ⚠️

```ts
// userStore.ts — tokens are in state but partialize correctly excludes them
partialize: (state) => ({
  user: state.user,
  preferences: state.preferences,
  isAuthenticated: state.isAuthenticated
  // ✅ accessToken and refreshToken are NOT persisted — good
})
```

**However**, `accessToken` and `refreshToken` still live in Zustand memory state. For a production app, tokens should be stored in `httpOnly` cookies managed by the server, not in JS memory. This is acceptable for development but must be addressed before production.

---

### 🟡 Moderate Issues

#### 4. No Path Aliases — Verbose Relative Imports

```ts
// Dashboard.tsx — current
import { useAccounts } from '../hooks/index.ts'
import { useTransactions } from '../hooks/index.ts'  // separate import for same file!
import type { Account } from '../types/index.ts'
```

**Problems:**
- Importing from the same file (`hooks/index.ts`) in separate `import` statements
- No `@/` alias means deep nesting creates `../../../../` chains
- `.ts` extension in imports is unusual (Vite handles this, but it's non-standard)

**Fix:**

```ts
// With path aliases
import { useAccounts, useTransactions, useStockHoldings } from '@/hooks'
import type { Account } from '@/types'
```

---

#### 5. `Dashboard.tsx` is Overloaded — Too Much State (283 lines)

```ts
// 10+ useState calls in one component
const [isModalOpen, setIsModalOpen] = useState(false)
const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
const [netWorthTimeRange, setNetWorthTimeRange] = useState('12M')
const [portfolioTimeRange, setPortfolioTimeRange] = useState('6M')
const [isRefreshing, setIsRefreshing] = useState(false)
const [autoRefreshInterval, setAutoRefreshInterval] = useState<number>(0)
const [netWorthChartType, setNetWorthChartType] = useState<'area' | 'bar'>('area')
const [showForecast, setShowForecast] = useState(false)
const [portfolioChartType, setPortfolioChartType] = useState<'line' | 'bar'>('line')
const [visibleWidgets, setVisibleWidgets] = useState({...})
const [showCustomizeMenu, setShowCustomizeMenu] = useState(false)
const [showTransactionModal, setShowTransactionModal] = useState(false)
```

**Fix:** Extract into a `useDashboard()` custom hook or move widget visibility state into Zustand.

---

#### 6. `console.log` in Production Code ❌

```ts
// Dashboard.tsx
onTransfer={() => console.log('Transfer funds')}
onAddInvestment={() => console.log('Add investment')}
onSave={async (transactionData) => {
  console.log('New transaction:', transactionData)
}}
```

These should be replaced with proper handlers or removed before production.

---

#### 7. Tailwind Config Conflict — v4 vs v3 Config File

```js
// tailwind.config.js — v3 style config
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: { colors: { primary: {...} } } }
}
```

```css
/* index.css — v4 style */
@import "tailwindcss";
```

**Problem:** Tailwind v4 uses a CSS-first config (`@theme` in CSS), not a JS config file. The `tailwind.config.js` is a v3 pattern. The `primary` color tokens defined in `tailwind.config.js` may not be applied correctly under v4.

**Fix:** Migrate theme to CSS:

```css
/* index.css */
@import "tailwindcss";

@theme {
  --color-primary-50: #ECFDF5;
  --color-primary-500: #10B981;
  --color-primary-600: #059669;
  --color-primary-700: #047857;
  --font-sans: 'Inter', system-ui, sans-serif;
}
```

---

#### 8. `globals.css` Uses `@apply` with Tailwind v4 ❌

```css
/* globals.css */
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
}
```

`@apply` with arbitrary Tailwind classes in a separate CSS file is discouraged in v4 and may not work as expected. Also, `globals.css` doesn't appear to be imported anywhere — it may be **dead code**.

---

#### 9. No `index.ts` Barrel Files for Components

```
components/ui/Button.tsx    ← no index.ts
components/ui/Card.tsx      ← no index.ts
components/layout/Navigation.tsx  ← no index.ts
```

Without barrel files, imports are verbose and refactoring is harder.

**Fix:** Add `index.ts` per folder:

```ts
// components/ui/index.ts
export { default as Button } from './Button'
export { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from './Card'
export { default as Modal } from './Modal'
export { default as Badge } from './Badge'
export { default as Skeleton } from './Skeleton'
```

---

### 🟢 Minor Issues

#### 10. `index.html` Missing SEO Meta Tags

```html
<!-- Current -->
<title>Finance Tracker</title>

<!-- Missing: -->
<meta name="description" content="Track your finances, investments, and budgets in one place.">
<meta property="og:title" content="Finance Tracker">
<meta property="og:description" content="...">
<meta name="theme-color" content="#10B981">
```

#### 11. `package.json` Name Should Follow Monorepo Convention

```json
// Current
"name": "frontend"

// Should be
"name": "@neuron/web"
```

#### 12. `AIService` Uses Singleton Class Pattern

In React, prefer a simple module-level export or a custom hook. The class-based singleton is an OOP pattern that doesn't align with React's functional paradigm.

```ts
// Current
export class AIService {
  private static instance: AIService
  static getInstance(): AIService { ... }
}

// Better
export const aiService = { processQuery, ... }
// or a custom hook: export function useAIService() { ... }
```

#### 13. `ApiResponse<T>` Duplicated

`ApiResponse<T>` is defined in both `api/client.ts` and `api/types.ts`. Pick one source of truth and import from it.

---

## 📋 Summary Scorecard

| Category                       | Score | Status                                   |
| ------------------------------ | ----- | ---------------------------------------- |
| Build Tooling (Vite + TS)      | 9/10  | ✅ Excellent                              |
| TypeScript Strictness          | 9/10  | ✅ Excellent                              |
| State Management (Zustand)     | 8/10  | ✅ Good                                   |
| Data Fetching (TanStack Query) | 8/10  | ✅ Good                                   |
| Component Architecture         | 7/10  | ✅ Good                                   |
| Testing Strategy               | 5/10  | ⚠️ Jest instead of Vitest                 |
| Vite Configuration             | 3/10  | 🔴 Bare minimum                           |
| Styling (Tailwind v4)          | 5/10  | ⚠️ v3/v4 config conflict                  |
| Code Organization              | 7/10  | ⚠️ Missing barrel files, path aliases     |
| SEO & HTML                     | 4/10  | ⚠️ Missing meta tags                      |
| Security                       | 6/10  | ⚠️ Token handling acceptable for dev only |

---

## 🚀 Top 5 Priority Fixes

| Priority | Fix                                                                                           | Effort  |
| -------- | --------------------------------------------------------------------------------------------- | ------- |
| 1        | Replace Jest with Vitest                                                                      | ~1 hour |
| 2        | Add path aliases (`@/`) in `vite.config.ts`                                                   | ~15 min |
| 3        | Fix Tailwind v4 config — migrate from `tailwind.config.js` to CSS `@theme`                    | ~30 min |
| 4        | Extract `Dashboard.tsx` state into `useDashboard()` hook                                      | ~1 hour |
| 5        | Add barrel `index.ts` files to `components/ui/`, `components/layout/`, `components/features/` | ~20 min |


# 🏗️ Codebase Structure Analysis

## Current Structure (Actual)

```
src/
├── App.tsx                          ← Root component
├── main.tsx                         ← Entry point
├── test-setup.ts                    ← Test bootstrap
│
├── api/                             ← API layer
│   ├── client.ts                    ← ApiClient interface + factory
│   ├── types.ts                     ← API request/response types
│   └── mock/                        ← Mock implementations
│       ├── client.ts
│       ├── accounts.ts
│       ├── transactions.ts
│       ├── dashboard.ts
│       ├── websocket.ts
│       └── data/                    ← Raw mock data
│           ├── mockAccounts.ts
│           ├── mockTransactions.ts
│           ├── mockBudgets.ts
│           ├── mockDashboard.ts
│           ├── mockStockHoldings.ts
│           └── mockImports.ts
│
├── components/
│   ├── features/                    ← Feature-specific components
│   │   ├── accounts/
│   │   │   ├── AccountCard.tsx
│   │   │   └── AccountDetailsModal.tsx
│   │   ├── chat/
│   │   │   ├── ChatInterface.tsx
│   │   │   ├── ChatInterface.test.tsx  ← ⚠️ Tests co-located here
│   │   │   ├── MessageBubble.tsx
│   │   │   └── MessageBubble.test.tsx
│   │   ├── dashboard/               ← ⚠️ 13 files flat, no sub-grouping
│   │   │   ├── AccountsOverview.tsx
│   │   │   ├── AlertsPanel.tsx
│   │   │   ├── AssetAllocationChart.tsx
│   │   │   ├── CashFlowCalendar.tsx
│   │   │   ├── ChartsGrid.tsx
│   │   │   ├── DashboardHeader.tsx
│   │   │   ├── FinancialHealthScore.tsx
│   │   │   ├── MonthlyExpensesChart.tsx
│   │   │   ├── NetWorthChart.tsx
│   │   │   ├── PortfolioPerformanceChart.tsx
│   │   │   ├── QuickActionsPanel.tsx
│   │   │   ├── SavingsGoalsWidget.tsx
│   │   │   ├── StatCard.tsx
│   │   │   └── StatsOverview.tsx
│   │   ├── emergencyFund/
│   │   │   └── EmergencyFundForm.tsx
│   │   └── transactions/
│   │       ├── TransactionDetailsModal.tsx
│   │       └── TransactionFormModal.tsx
│   ├── layout/
│   │   ├── Navigation.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   └── ui/                          ← Shared primitives
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── EmptyState.tsx
│       ├── Input.tsx
│       ├── Label.tsx
│       ├── Modal.tsx
│       ├── Skeleton.tsx
│       └── StatCard.tsx             ← ⚠️ Duplicate of features/dashboard/StatCard.tsx?
│
├── hooks/
│   ├── index.ts                     ← Barrel export
│   └── mock/                        ← ⚠️ Mock hooks inside hooks folder
│       ├── useAccountsMock.ts
│       ├── useTransactionsMock.ts
│       ├── useStockHoldingsMock.ts
│       └── useBudgetsMock.ts
│
├── pages/                           ← Route-level pages (flat, no folders)
│   ├── Dashboard.tsx
│   ├── Accounts.tsx
│   ├── Transactions.tsx
│   ├── Portfolio.tsx
│   ├── Budget.tsx
│   ├── Reports.tsx
│   ├── Imports.tsx
│   ├── Chat.tsx
│   └── Settings.tsx
│
├── services/
│   ├── aiService.ts
│   └── aiService.test.ts            ← ⚠️ Test co-located in services
│
├── stores/
│   ├── financialStore.ts
│   └── userStore.ts
│
├── styles/
│   ├── index.css                    ← Main CSS entry
│   ├── globals.css                  ← ⚠️ Not imported anywhere
│   └── themes.ts                    ← ⚠️ .ts file inside styles/
│
├── types/
│   └── index.ts                     ← All domain types
│
└── utils/
    ├── index.ts                     ← cn(), formatCurrency, etc.
    └── accountBalance.ts

e2e/
└── chat.spec.ts                     ← ⚠️ Only 1 E2E test file
```

---

## ✅ What's Structurally Correct

| ✅ Pattern                                                                                                                                      | Why It's Good                           |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| `components/ui/` for primitives                                                                                                                | Correct separation of reusable atoms    |
| [components/layout/](cci:7://file:///Users/adityasj/Documents/Workspace/Projects/Neuron/apps/web/src/components/layout:0:0-0:0) for shell      | Standard layout separation              |
| [components/features/](cci:7://file:///Users/adityasj/Documents/Workspace/Projects/Neuron/apps/web/src/components/features:0:0-0:0) per domain | Feature-based grouping — scales well    |
| [hooks/index.ts](cci:7://file:///Users/adityasj/Documents/Workspace/Projects/Neuron/apps/web/src/hooks/index.ts:0:0-0:0) barrel export         | Clean public API for hooks              |
| `stores/` separate from components                                                                                                             | Correct — state is not co-located       |
| [types/index.ts](cci:7://file:///Users/adityasj/Documents/Workspace/Projects/Neuron/apps/web/src/types/index.ts:0:0-0:0) centralized           | Single source of truth for domain types |
| [api/client.ts](cci:7://file:///Users/adityasj/Documents/Workspace/Projects/Neuron/apps/web/src/api/client.ts:0:0-0:0) interface + factory     | Clean abstraction for mock ↔ real swap  |
| `pages/` flat for route components                                                                                                             | Acceptable for this app size            |
| `utils/` for pure helpers                                                                                                                      | Correct separation of concerns          |

---

## ❌ What's Structurally Wrong

### Problem 1 — [StatCard.tsx](cci:7://file:///Users/adityasj/Documents/Workspace/Projects/Neuron/apps/web/src/components/ui/StatCard.tsx:0:0-0:0) Exists in TWO Places 🔴
```
components/ui/StatCard.tsx              ← Which one is canonical?
components/features/dashboard/StatCard.tsx
```
This is a **direct duplication**. One of them needs to be deleted. The `ui/` version should be the single source, imported by the dashboard feature.

---

### Problem 2 — Mock Data Lives Inside [api/](cci:7://file:///Users/adityasj/Documents/Workspace/Projects/Neuron/apps/web/src/api:0:0-0:0) AND `hooks/` 🟡
```
api/mock/data/mockAccounts.ts     ← mock data here
hooks/mock/useAccountsMock.ts     ← mock hooks here
```
Mock concerns are split across two folders. The ideal structure is one `__mocks__/` or [mock/](cci:7://file:///Users/adityasj/Documents/Workspace/Projects/Neuron/apps/web/src/api/mock:0:0-0:0) directory at the `src/` level, or mock hooks live alongside real hooks (not in a subfolder of `hooks/`).

**Better:**
```
src/
├── hooks/
│   ├── useAccounts.ts        ← real hook (when backend is ready)
│   ├── useTransactions.ts
│   └── index.ts
├── mocks/                    ← single mock home
│   ├── data/
│   │   ├── accounts.ts
│   │   └── transactions.ts
│   └── hooks/
│       ├── useAccountsMock.ts
│       └── useTransactionsMock.ts
```

---

### Problem 3 — [globals.css](cci:7://file:///Users/adityasj/Documents/Workspace/Projects/Neuron/apps/web/src/styles/globals.css:0:0-0:0) is Orphaned (Dead File) 🟡
```
styles/
├── index.css     ← imported in main.tsx ✅
├── globals.css   ← NOT imported anywhere ❌
└── themes.ts     ← .ts file in a styles/ folder ❌
```
- [globals.css](cci:7://file:///Users/adityasj/Documents/Workspace/Projects/Neuron/apps/web/src/styles/globals.css:0:0-0:0) is never imported — it's dead code
- [themes.ts](cci:7://file:///Users/adityasj/Documents/Workspace/Projects/Neuron/apps/web/src/styles/themes.ts:0:0-0:0) is a TypeScript file inside a `styles/` folder, which is semantically wrong. It should live in `utils/` or `constants/`

---

### Problem 4 — Tests Are Inconsistently Co-located 🟡
```
components/features/chat/ChatInterface.test.tsx   ← co-located ✅
components/features/chat/MessageBubble.test.tsx   ← co-located ✅
services/aiService.test.ts                        ← co-located ✅
hooks/mock/useTransactionsMock.ts                 ← no tests at all ❌
pages/Dashboard.tsx                               ← no tests at all ❌
```
Pick **one** strategy and be consistent:
- **Option A (Recommended):** Co-locate tests next to the file they test (`Component.test.tsx` beside `Component.tsx`)
- **Option B:** Centralized `__tests__/` folder mirroring `src/`

---

### Problem 5 — [emergencyFund/](cci:7://file:///Users/adityasj/Documents/Workspace/Projects/Neuron/apps/web/src/components/features/emergencyFund:0:0-0:0) Feature is a Stub 🟡
```
components/features/emergencyFund/
└── EmergencyFundForm.tsx    ← only 1 file, no page, no hook, no route
```
There's no corresponding `pages/EmergencyFund.tsx` or route in [App.tsx](cci:7://file:///Users/adityasj/Documents/Workspace/Projects/Neuron/apps/web/src/App.tsx:0:0-0:0). This is an **incomplete/orphaned feature** that should either be completed or removed.

---

### Problem 6 — No Router File 🟡
```
App.tsx   ← All routes defined inline here
```
For 9 routes, this is borderline acceptable, but the modern pattern is a dedicated `router/index.tsx`:
```ts
// src/router/index.tsx
import { createBrowserRouter } from 'react-router-dom'
export const router = createBrowserRouter([
  { path: '/', element: <Dashboard /> },
  { path: '/accounts', element: <Accounts /> },
  ...
])
```
This enables lazy loading (`React.lazy`) per route — critical for performance at scale.

---

### Problem 7 — Only 1 E2E Test 🟡
```
e2e/
└── chat.spec.ts    ← only chat is tested E2E
```
With 9 pages, at minimum `dashboard.spec.ts`, `transactions.spec.ts`, and `accounts.spec.ts` should exist.

---

## 📐 Recommended Target Structure

```
src/
├── app/                    ← App-level setup
│   ├── App.tsx
│   ├── main.tsx
│   └── router.tsx          ← Centralized routing with lazy loading
│
├── api/                    ← API contracts only
│   ├── client.ts
│   └── types.ts
│
├── mocks/                  ← All mock data in one place
│   ├── data/
│   └── handlers/
│
├── components/
│   ├── ui/                 ← Primitives (no StatCard duplicate)
│   ├── layout/
│   └── features/
│
├── hooks/                  ← Real hooks only (no mock/ subfolder)
│   └── index.ts
│
├── pages/
├── services/
├── stores/
├── styles/
│   └── index.css           ← Only one CSS entry
├── types/
└── utils/
    ├── index.ts
    ├── accountBalance.ts
    └── themes.ts           ← Move themes.ts here from styles/
```

---

## 🎯 Verdict

| Aspect                                                                                                                                    | Status                     |
| ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| Top-level folder naming                                                                                                                   | ✅ Correct                  |
| Feature-based component grouping                                                                                                          | ✅ Correct                  |
| Separation of ui/layout/features                                                                                                          | ✅ Correct                  |
| State management location                                                                                                                 | ✅ Correct                  |
| Types centralization                                                                                                                      | ✅ Correct                  |
| Mock data organization                                                                                                                    | ⚠️ Split across two folders |
| StatCard duplication                                                                                                                      | 🔴 Must fix                 |
| Dead CSS file ([globals.css](cci:7://file:///Users/adityasj/Documents/Workspace/Projects/Neuron/apps/web/src/styles/globals.css:0:0-0:0)) | ⚠️ Remove or import         |
| [themes.ts](cci:7://file:///Users/adityasj/Documents/Workspace/Projects/Neuron/apps/web/src/styles/themes.ts:0:0-0:0) in `styles/`        | ⚠️ Wrong folder             |
| Router centralization                                                                                                                     | ⚠️ Missing                  |
| Test consistency                                                                                                                          | ⚠️ Inconsistent             |
| E2E coverage                                                                                                                              | ⚠️ Only 1 spec file         |

**Bottom line:** The structure is ~75% correct and follows modern conventions well. The core separation of concerns is sound. The main structural issues are the **StatCard duplication**, **orphaned [globals.css](cci:7://file:///Users/adityasj/Documents/Workspace/Projects/Neuron/apps/web/src/styles/globals.css:0:0-0:0)**, **split mock data**, and the **missing router file**. None are catastrophic — the app will work fine — but they'll cause confusion as the codebase grows.
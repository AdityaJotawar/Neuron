# Git Commit Plan — `apps/web`

Organized chunked commits to push the Neuron web frontend to GitHub.
Each commit is a logical unit of work and should be made in order.

---

## Commit 1 — Project Scaffolding & Configuration

**Message:**
```
chore(web): add project scaffolding and build configuration

Sets up the Vite + React + TypeScript project foundation including
package.json with all dependencies, tsconfig files, vite config,
eslint rules, postcss/tailwind setup, and the main HTML entry point.
```

**Files:**
- `apps/web/package.json`
- `apps/web/package-lock.json`
- `apps/web/vite.config.ts`
- `apps/web/tsconfig.json`
- `apps/web/tsconfig.app.json`
- `apps/web/tsconfig.node.json`
- `apps/web/eslint.config.js`
- `apps/web/postcss.config.js`
- `apps/web/tailwind.config.js`
- `apps/web/index.html`
- `apps/web/.gitignore`
- `apps/web/.env.example`

---

## Commit 2 — Global Styles & Design Tokens

**Message:**
```
style(web): add global styles, CSS design tokens, and theme utilities

Establishes the design system foundation with CSS custom properties
for colors and spacing (index.css), global resets and typography
(globals.css), and a TypeScript theme configuration (themes.ts).
```

**Files:**
- `apps/web/src/styles/index.css`
- `apps/web/src/styles/globals.css`
- `apps/web/src/styles/themes.ts`

---

## Commit 3 — Core Types & Shared Utilities

**Message:**
```
feat(web): add shared TypeScript types, utilities, and constants

Defines the application-wide type system (types/index.ts) covering
accounts, transactions, portfolio, budget, and imports. Also adds
utility helpers for account balance formatting (accountBalance.ts),
shared constants (constants.ts), and a utility barrel export.
```

**Files:**
- `apps/web/src/types/index.ts`
- `apps/web/src/utils/accountBalance.ts`
- `apps/web/src/utils/constants.ts`
- `apps/web/src/utils/index.ts`

---

## Commit 4 — Application Bootstrap & Routing

**Message:**
```
feat(web): add app entrypoint, providers, and client-side router

Wires up the React application with query client and router providers
(app/providers.tsx), defines lazy-loaded routes for all 9 pages
(app/router.tsx), and bootstraps the app into the DOM (main.tsx, App.tsx).
```

**Files:**
- `apps/web/src/main.tsx`
- `apps/web/src/App.tsx`
- `apps/web/src/app/providers.tsx`
- `apps/web/src/app/router.tsx`

---

## Commit 5 — Global State (Zustand Stores)

**Message:**
```
feat(web): add Zustand stores for user and financial global state

Implements the financialStore (net worth, transactions, accounts,
budget snapshots) and userStore (profile, preferences) using Zustand,
with a barrel index for clean imports.
```

**Files:**
- `apps/web/src/stores/financialStore.ts`
- `apps/web/src/stores/userStore.ts`
- `apps/web/src/stores/index.ts`

---

## Commit 6 — API Client & Type Definitions

**Message:**
```
feat(web): add API client layer and shared API types

Adds an Axios-based API client (api/client.ts) with auth interceptors
and centralized error handling, and defines typed request/response
interfaces (api/types.ts) for all backend endpoints.
```

**Files:**
- `apps/web/src/api/client.ts`
- `apps/web/src/api/types.ts`

---

## Commit 7 — Mock API Infrastructure

**Message:**
```
feat(web): add mock API handlers and seed data for all domains

Provides a complete mock backend layer for local development with
handlers for accounts, transactions, and dashboard (api/mock/*.ts),
seed data fixtures for all entities (api/mock/data/*.ts), and a
mock WebSocket client for real-time simulation.
```

**Files:**
- `apps/web/src/api/mock/client.ts`
- `apps/web/src/api/mock/accounts.ts`
- `apps/web/src/api/mock/transactions.ts`
- `apps/web/src/api/mock/dashboard.ts`
- `apps/web/src/api/mock/websocket.ts`
- `apps/web/src/api/mock/data/mockAccounts.ts`
- `apps/web/src/api/mock/data/mockTransactions.ts`
- `apps/web/src/api/mock/data/mockDashboard.ts`
- `apps/web/src/api/mock/data/mockBudgets.ts`
- `apps/web/src/api/mock/data/mockStockHoldings.ts`
- `apps/web/src/api/mock/data/mockImports.ts`

---

## Commit 8 — Mock Data Barrel (mocks/ directory)

**Message:**
```
feat(web): add mocks/ directory with re-exported data and hook mocks

Creates a convenience mocks/ directory that barrel-exports seed data
(mocks/data/) and per-domain mock hooks (mocks/hooks/) to be swapped
in during development and testing without touching production hook code.
```

**Files:**
- `apps/web/src/mocks/client.ts`
- `apps/web/src/mocks/data/accounts.ts`
- `apps/web/src/mocks/data/budgets.ts`
- `apps/web/src/mocks/data/dashboard.ts`
- `apps/web/src/mocks/data/imports.ts`
- `apps/web/src/mocks/data/stockHoldings.ts`
- `apps/web/src/mocks/data/transactions.ts`
- `apps/web/src/mocks/hooks/index.ts`
- `apps/web/src/mocks/hooks/useAccountsMock.ts`
- `apps/web/src/mocks/hooks/useBudgetsMock.ts`
- `apps/web/src/mocks/hooks/useStockHoldingsMock.ts`
- `apps/web/src/mocks/hooks/useTransactionsMock.ts`

---

## Commit 9 — React Query Data Hooks

**Message:**
```
feat(web): add React Query hooks for data fetching across all domains

Implements typed, cached data-fetching hooks — useAccounts, useBudgets,
useDashboard, useStockHoldings, useTransactions — backed by mock
handlers for now and ready to swap to real API calls. Includes mock
variants in hooks/mock/ and a barrel index.ts.
```

**Files:**
- `apps/web/src/hooks/useAccounts.ts`
- `apps/web/src/hooks/useBudgets.ts`
- `apps/web/src/hooks/useDashboard.ts`
- `apps/web/src/hooks/useStockHoldings.ts`
- `apps/web/src/hooks/useTransactions.ts`
- `apps/web/src/hooks/index.ts`
- `apps/web/src/hooks/mock/useAccountsMock.ts`
- `apps/web/src/hooks/mock/useBudgetsMock.ts`
- `apps/web/src/hooks/mock/useStockHoldingsMock.ts`
- `apps/web/src/hooks/mock/useTransactionsMock.ts`

---

## Commit 10 — AI Chat Service

**Message:**
```
feat(web): add AI chat service with streaming support

Implements the aiService module (services/aiService.ts) that handles
streaming WebSocket communication with the Neuron AI backend, message
queuing, and error recovery. Includes unit tests (aiService.test.ts).
```

**Files:**
- `apps/web/src/services/aiService.ts`
- `apps/web/src/services/aiService.test.ts`

---

## Commit 11 — Shared UI Component Library

**Message:**
```
feat(web): add reusable UI component library (Button, Card, Modal, etc.)

Builds the base component library: Badge, Button, Card, EmptyState,
Input, Label, Modal, Skeleton, and StatCard — all typed, accessible,
and styled with Tailwind via the design token system. Barrel exported
from ui/index.ts.
```

**Files:**
- `apps/web/src/components/ui/Badge.tsx`
- `apps/web/src/components/ui/Button.tsx`
- `apps/web/src/components/ui/Card.tsx`
- `apps/web/src/components/ui/EmptyState.tsx`
- `apps/web/src/components/ui/Input.tsx`
- `apps/web/src/components/ui/Label.tsx`
- `apps/web/src/components/ui/Modal.tsx`
- `apps/web/src/components/ui/Skeleton.tsx`
- `apps/web/src/components/ui/StatCard.tsx`
- `apps/web/src/components/ui/index.ts`

---

## Commit 12 — Layout Components (Navigation & Shell)

**Message:**
```
feat(web): add app layout shell with Navigation, Sidebar, and Footer

Creates the persistent navigation bar (Navigation.tsx) with links to
all pages, a collapsible Sidebar.tsx, and Footer.tsx. Together these
form the AppLayout shell referenced in the router.
```

**Files:**
- `apps/web/src/components/layout/Navigation.tsx`
- `apps/web/src/components/layout/Sidebar.tsx`
- `apps/web/src/components/layout/Footer.tsx`
- `apps/web/src/components/layout/index.ts`

---

## Commit 13 — Dashboard Feature Components (Charts)

**Message:**
```
feat(web): add dashboard chart components (NetWorth, Portfolio, etc.)

Implements Recharts-powered chart components for the dashboard:
NetWorthChart (area + bar), PortfolioPerformanceChart (line),
MonthlyExpensesChart (bar), AssetAllocationChart (pie), and
ChartsGrid layout wrapper. Barrel exported from dashboard/charts/.
```

**Files:**
- `apps/web/src/components/features/dashboard/charts/NetWorthChart.tsx`
- `apps/web/src/components/features/dashboard/charts/PortfolioPerformanceChart.tsx`
- `apps/web/src/components/features/dashboard/charts/MonthlyExpensesChart.tsx`
- `apps/web/src/components/features/dashboard/charts/AssetAllocationChart.tsx`
- `apps/web/src/components/features/dashboard/charts/ChartsGrid.tsx`
- `apps/web/src/components/features/dashboard/charts/index.ts`

---

## Commit 14 — Dashboard Feature Components (Widgets)

**Message:**
```
feat(web): add dashboard widget components (Health, Goals, Alerts, etc.)

Builds the non-chart dashboard widgets: FinancialHealthScore (animated
score ring), SavingsGoalsWidget (progress bars), AlertsPanel (smart
notifications), CashFlowCalendar (monthly calendar view), QuickActionsPanel,
AccountsOverview, StatsOverview. Barrel exported from dashboard/widgets/.
```

**Files:**
- `apps/web/src/components/features/dashboard/widgets/FinancialHealthScore.tsx`
- `apps/web/src/components/features/dashboard/widgets/SavingsGoalsWidget.tsx`
- `apps/web/src/components/features/dashboard/widgets/AlertsPanel.tsx`
- `apps/web/src/components/features/dashboard/widgets/CashFlowCalendar.tsx`
- `apps/web/src/components/features/dashboard/widgets/QuickActionsPanel.tsx`
- `apps/web/src/components/features/dashboard/widgets/AccountsOverview.tsx`
- `apps/web/src/components/features/dashboard/widgets/StatsOverview.tsx`
- `apps/web/src/components/features/dashboard/widgets/index.ts`

---

## Commit 15 — Dashboard Feature Components (Top-level)

**Message:**
```
feat(web): add top-level dashboard components (Header, Stats, etc.)

Adds the remaining dashboard-level components: DashboardHeader.tsx,
DashboardStatCard.tsx, StatCard.tsx (dashboard-scoped), and the
feature barrel index.ts. Also includes legacy components that were
refactored into charts/ and widgets/ sub-directories.
```

**Files:**
- `apps/web/src/components/features/dashboard/DashboardHeader.tsx`
- `apps/web/src/components/features/dashboard/DashboardStatCard.tsx`
- `apps/web/src/components/features/dashboard/StatCard.tsx`
- `apps/web/src/components/features/dashboard/index.ts`

---

## Commit 16 — Accounts Feature Components

**Message:**
```
feat(web): add Accounts feature components (AccountCard, DetailsModal)

Implements AccountCard.tsx (compact account summary card) and
AccountDetailsModal.tsx (full-screen modal with transaction history,
charts, and account metadata). Barrel export via accounts/index.ts.
```

**Files:**
- `apps/web/src/components/features/accounts/AccountCard.tsx`
- `apps/web/src/components/features/accounts/AccountDetailsModal.tsx`
- `apps/web/src/components/features/accounts/index.ts`

---

## Commit 17 — Transactions Feature Components

**Message:**
```
feat(web): add Transactions feature components (modals for add/view)

Adds TransactionFormModal.tsx (create/edit transaction form with
validation) and TransactionDetailsModal.tsx (read-only transaction
detail view). Barrel exported from transactions/index.ts.
```

**Files:**
- `apps/web/src/components/features/transactions/TransactionFormModal.tsx`
- `apps/web/src/components/features/transactions/TransactionDetailsModal.tsx`
- `apps/web/src/components/features/transactions/index.ts`

---

## Commit 18 — Chat Feature Components

**Message:**
```
feat(web): add Chat feature components with unit tests

Implements ChatInterface.tsx (full conversation UI with streaming
message support) and MessageBubble.tsx (individual message renderer).
Includes unit tests for both components. Barrel exported from chat/index.ts.
```

**Files:**
- `apps/web/src/components/features/chat/ChatInterface.tsx`
- `apps/web/src/components/features/chat/MessageBubble.tsx`
- `apps/web/src/components/features/chat/ChatInterface.test.tsx`
- `apps/web/src/components/features/chat/MessageBubble.test.tsx`
- `apps/web/src/components/features/chat/index.ts`

---

## Commit 19 — Emergency Fund Feature Component

**Message:**
```
feat(web): add EmergencyFundForm feature component

Adds EmergencyFundForm.tsx used within the Budget page for users to
configure and track their emergency fund target and progress.
```

**Files:**
- `apps/web/src/components/features/emergencyFund/EmergencyFundForm.tsx`
- `apps/web/src/components/features/emergencyFund/index.ts`

---

## Commit 20 — Pages

**Message:**
```
feat(web): add all application pages (Dashboard, Accounts, Transactions, etc.)

Implements all 10 routed pages:
- Dashboard.tsx — main overview with charts and widgets
- Accounts.tsx — accounts list with filtering and detail drill-down
- Transactions.tsx — paginated transaction table with search and filters
- Portfolio.tsx — investment holdings and performance tracking
- Budget.tsx — monthly budget editor with emergency fund widget
- Reports.tsx — financial reports placeholder
- Imports.tsx — CSV/PDF bank statement import flow
- Chat.tsx — AI financial advisor interface
- Settings.tsx — user preferences
- NotFound.tsx — 404 fallback page
```

**Files:**
- `apps/web/src/pages/Dashboard.tsx`
- `apps/web/src/pages/Accounts.tsx`
- `apps/web/src/pages/Transactions.tsx`
- `apps/web/src/pages/Portfolio.tsx`
- `apps/web/src/pages/Budget.tsx`
- `apps/web/src/pages/Reports.tsx`
- `apps/web/src/pages/Imports.tsx`
- `apps/web/src/pages/Chat.tsx`
- `apps/web/src/pages/Settings.tsx`
- `apps/web/src/pages/NotFound.tsx`

---

## Commit 21 — E2E Tests (Playwright)

**Message:**
```
test(web): add Playwright e2e tests for all pages

Adds smoke-level Playwright end-to-end specs for all key pages:
dashboard, accounts, transactions, portfolio, budget, imports, and
chat. Also includes playwright.config.ts and the test-setup file.
```

**Files:**
- `apps/web/playwright.config.ts`
- `apps/web/src/test-setup.ts`
- `apps/web/e2e/dashboard.spec.ts`
- `apps/web/e2e/accounts.spec.ts`
- `apps/web/e2e/transactions.spec.ts`
- `apps/web/e2e/portfolio.spec.ts`
- `apps/web/e2e/budget.spec.ts`
- `apps/web/e2e/imports.spec.ts`
- `apps/web/e2e/chat.spec.ts`

---

## Commit 22 — Documentation & Audit Files

**Message:**
```
docs(web): add codebase audit, ideal structure, and UI structure docs

Adds reference documentation for the web app: CODEBASE_AUDIT.md
(structural analysis and identified issues), IDEAL_STRUCTURE.md
(recommended folder organization), UI_STRUCTURE.md (component
hierarchy and page layouts), and README.md.
```

**Files:**
- `apps/web/README.md`
- `apps/web/CODEBASE_AUDIT.md`
- `apps/web/IDEAL_STRUCTURE.md`
- `apps/web/UI_STRUCTURE.md`

---

## Summary

| #   | Commit Message Prefix | Topic                           |
| --- | --------------------- | ------------------------------- |
| 1   | `chore(web)`          | Project scaffolding & config    |
| 2   | `style(web)`          | Global styles & design tokens   |
| 3   | `feat(web)`           | Types & utilities               |
| 4   | `feat(web)`           | App bootstrap & routing         |
| 5   | `feat(web)`           | Zustand stores                  |
| 6   | `feat(web)`           | API client & types              |
| 7   | `feat(web)`           | Mock API handlers & seed data   |
| 8   | `feat(web)`           | mocks/ directory barrel         |
| 9   | `feat(web)`           | React Query data hooks          |
| 10  | `feat(web)`           | AI chat service                 |
| 11  | `feat(web)`           | Shared UI component library     |
| 12  | `feat(web)`           | Layout shell components         |
| 13  | `feat(web)`           | Dashboard chart components      |
| 14  | `feat(web)`           | Dashboard widget components     |
| 15  | `feat(web)`           | Dashboard top-level components  |
| 16  | `feat(web)`           | Accounts feature components     |
| 17  | `feat(web)`           | Transactions feature components |
| 18  | `feat(web)`           | Chat feature components         |
| 19  | `feat(web)`           | Emergency fund component        |
| 20  | `feat(web)`           | All application pages           |
| 21  | `test(web)`           | Playwright e2e tests            |
| 22  | `docs(web)`           | Documentation & audit files     |

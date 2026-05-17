#!/bin/bash

# Git Commit Script for Neuron Web Application
# This script automates the git workflow for the 22 commits outlined in GIT_COMMIT_PLAN.md
# Run this script from the apps/web directory: ./git-commit-script.sh

set -e  # Exit on any error

echo "🚀 Starting Neuron Web Application Git Commit Process"
echo "=================================================="

# Function to check if we're in a git repository
check_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        echo "❌ Error: Not in a git repository. Please run 'git init' first."
        exit 1
    fi
}

# Function to add files and commit
commit_files() {
    local commit_message="$1"
    local files=("${@:2}")
    
    echo "📝 Commit: $commit_message"
    echo "📁 Files to add:"
    
    # Add files to staging area
    for file in "${files[@]}"; do
        if [ -f "$file" ]; then
            echo "  + $file"
            git add "$file"
        else
            echo "  ⚠️  Warning: $file not found, skipping..."
        fi
    done
    
    # Commit with message
    git commit -m "$commit_message"
    echo "✅ Commit completed successfully"
    echo ""
}

# Function to push to remote repository
push_to_remote() {
    echo "📤 Pushing to remote repository..."
    git push origin main || git push origin master
    echo "✅ Push completed successfully"
    echo ""
}

# Function to show current status
show_status() {
    echo "📊 Current Git Status:"
    git status --short
    echo ""
}

# Check if we're in a git repository
check_git_repo

# Show initial status
show_status

echo "📋 Starting commit sequence..."
echo ""

# Commit 1 — Project Scaffolding & Configuration
commit_files "chore(web): add project scaffolding and build configuration

Sets up the Vite + React + TypeScript project foundation including
package.json with all dependencies, tsconfig files, vite config,
eslint rules, postcss/tailwind setup, and the main HTML entry point." \
"package.json" \
"package-lock.json" \
"vite.config.ts" \
"tsconfig.json" \
"tsconfig.app.json" \
"tsconfig.node.json" \
"eslint.config.js" \
"postcss.config.js" \
"tailwind.config.js" \
"index.html" \
".gitignore" \
".env.example"

# Commit 2 — Global Styles & Design Tokens
commit_files "style(web): add global styles, CSS design tokens, and theme utilities

Establishes the design system foundation with CSS custom properties
for colors and spacing (index.css), global resets and typography
(globals.css), and a TypeScript theme configuration (themes.ts)." \
"src/styles/index.css" \
"src/styles/globals.css" \
"src/styles/themes.ts"

# Commit 3 — Core Types & Shared Utilities
commit_files "feat(web): add shared TypeScript types, utilities, and constants

Defines the application-wide type system (types/index.ts) covering
accounts, transactions, portfolio, budget, and imports. Also adds
utility helpers for account balance formatting (accountBalance.ts),
shared constants (constants.ts), and a utility barrel export." \
"src/types/index.ts" \
"src/utils/accountBalance.ts" \
"src/utils/constants.ts" \
"src/utils/index.ts"

# Commit 4 — Application Bootstrap & Routing
commit_files "feat(web): add app entrypoint, providers, and client-side router

Wires up the React application with query client and router providers
(app/providers.tsx), defines lazy-loaded routes for all 9 pages
(app/router.tsx), and bootstraps the app into the DOM (main.tsx, App.tsx)." \
"src/main.tsx" \
"src/App.tsx" \
"src/app/providers.tsx" \
"src/app/router.tsx"

# Commit 5 — Global State (Zustand Stores)
commit_files "feat(web): add Zustand stores for user and financial global state

Implements the financialStore (net worth, transactions, accounts,
budget snapshots) and userStore (profile, preferences) using Zustand,
with a barrel index for clean imports." \
"src/stores/financialStore.ts" \
"src/stores/userStore.ts" \
"src/stores/index.ts"

# Commit 6 — API Client & Type Definitions
commit_files "feat(web): add API client layer and shared API types

Adds an Axios-based API client (api/client.ts) with auth interceptors
and centralized error handling, and defines typed request/response
interfaces (api/types.ts) for all backend endpoints." \
"src/api/client.ts" \
"src/api/types.ts"

# Commit 7 — Mock API Infrastructure
commit_files "feat(web): add mock API handlers and seed data for all domains

Provides a complete mock backend layer for local development with
handlers for accounts, transactions, and dashboard (api/mock/*.ts),
seed data fixtures for all entities (api/mock/data/*.ts), and a
mock WebSocket client for real-time simulation." \
"src/api/mock/client.ts" \
"src/api/mock/accounts.ts" \
"src/api/mock/transactions.ts" \
"src/api/mock/dashboard.ts" \
"src/api/mock/websocket.ts" \
"src/api/mock/data/mockAccounts.ts" \
"src/api/mock/data/mockTransactions.ts" \
"src/api/mock/data/mockDashboard.ts" \
"src/api/mock/data/mockBudgets.ts" \
"src/api/mock/data/mockStockHoldings.ts" \
"src/api/mock/data/mockImports.ts"

# Commit 8 — Mock Data Barrel (mocks/ directory)
commit_files "feat(web): add mocks/ directory with re-exported data and hook mocks

Creates a convenience mocks/ directory that barrel-exports seed data
(mocks/data/) and per-domain mock hooks (mocks/hooks/) to be swapped
in during development and testing without touching production hook code." \
"src/mocks/client.ts" \
"src/mocks/data/accounts.ts" \
"src/mocks/data/budgets.ts" \
"src/mocks/data/dashboard.ts" \
"src/mocks/data/imports.ts" \
"src/mocks/data/stockHoldings.ts" \
"src/mocks/data/transactions.ts" \
"src/mocks/hooks/index.ts" \
"src/mocks/hooks/useAccountsMock.ts" \
"src/mocks/hooks/useBudgetsMock.ts" \
"src/mocks/hooks/useStockHoldingsMock.ts" \
"src/mocks/hooks/useTransactionsMock.ts"

# Commit 9 — React Query Data Hooks
commit_files "feat(web): add React Query hooks for data fetching across all domains

Implements typed, cached data-fetching hooks — useAccounts, useBudgets,
useDashboard, useStockHoldings, useTransactions — backed by mock
handlers for now and ready to swap to real API calls. Includes mock
variants in hooks/mock/ and a barrel index.ts." \
"src/hooks/useAccounts.ts" \
"src/hooks/useBudgets.ts" \
"src/hooks/useDashboard.ts" \
"src/hooks/useStockHoldings.ts" \
"src/hooks/useTransactions.ts" \
"src/hooks/index.ts" \
"src/hooks/mock/useAccountsMock.ts" \
"src/hooks/mock/useBudgetsMock.ts" \
"src/hooks/mock/useStockHoldingsMock.ts" \
"src/hooks/mock/useTransactionsMock.ts"

# Commit 10 — AI Chat Service
commit_files "feat(web): add AI chat service with streaming support

Implements the aiService module (services/aiService.ts) that handles
streaming WebSocket communication with the Neuron AI backend, message
queuing, and error recovery. Includes unit tests (aiService.test.ts)." \
"src/services/aiService.ts" \
"src/services/aiService.test.ts"

# Commit 11 — Shared UI Component Library
commit_files "feat(web): add reusable UI component library (Button, Card, Modal, etc.)

Builds the base component library: Badge, Button, Card, EmptyState,
Input, Label, Modal, Skeleton, and StatCard — all typed, accessible,
and styled with Tailwind via the design token system. Barrel exported
from ui/index.ts." \
"src/components/ui/Badge.tsx" \
"src/components/ui/Button.tsx" \
"src/components/ui/Card.tsx" \
"src/components/ui/EmptyState.tsx" \
"src/components/ui/Input.tsx" \
"src/components/ui/Label.tsx" \
"src/components/ui/Modal.tsx" \
"src/components/ui/Skeleton.tsx" \
"src/components/ui/StatCard.tsx" \
"src/components/ui/index.ts"

# Commit 12 — Layout Components (Navigation & Shell)
commit_files "feat(web): add app layout shell with Navigation, Sidebar, and Footer

Creates the persistent navigation bar (Navigation.tsx) with links to
all pages, a collapsible Sidebar.tsx, and Footer.tsx. Together these
form the AppLayout shell referenced in the router." \
"src/components/layout/Navigation.tsx" \
"src/components/layout/Sidebar.tsx" \
"src/components/layout/Footer.tsx" \
"src/components/layout/index.ts"

# Commit 13 — Dashboard Feature Components (Charts)
commit_files "feat(web): add dashboard chart components (NetWorth, Portfolio, etc.)

Implements Recharts-powered chart components for the dashboard:
NetWorthChart (area + bar), PortfolioPerformanceChart (line),
MonthlyExpensesChart (bar), AssetAllocationChart (pie), and
ChartsGrid layout wrapper. Barrel exported from dashboard/charts/." \
"src/components/features/dashboard/charts/NetWorthChart.tsx" \
"src/components/features/dashboard/charts/PortfolioPerformanceChart.tsx" \
"src/components/features/dashboard/charts/MonthlyExpensesChart.tsx" \
"src/components/features/dashboard/charts/AssetAllocationChart.tsx" \
"src/components/features/dashboard/charts/ChartsGrid.tsx" \
"src/components/features/dashboard/charts/index.ts"

# Commit 14 — Dashboard Feature Components (Widgets)
commit_files "feat(web): add dashboard widget components (Health, Goals, Alerts, etc.)

Builds the non-chart dashboard widgets: FinancialHealthScore (animated
score ring), SavingsGoalsWidget (progress bars), AlertsPanel (smart
notifications), CashFlowCalendar (monthly calendar view), QuickActionsPanel,
AccountsOverview, StatsOverview. Barrel exported from dashboard/widgets/." \
"src/components/features/dashboard/widgets/FinancialHealthScore.tsx" \
"src/components/features/dashboard/widgets/SavingsGoalsWidget.tsx" \
"src/components/features/dashboard/widgets/AlertsPanel.tsx" \
"src/components/features/dashboard/widgets/CashFlowCalendar.tsx" \
"src/components/features/dashboard/widgets/QuickActionsPanel.tsx" \
"src/components/features/dashboard/widgets/AccountsOverview.tsx" \
"src/components/features/dashboard/widgets/StatsOverview.tsx" \
"src/components/features/dashboard/widgets/index.ts"

# Commit 15 — Dashboard Feature Components (Top-level)
commit_files "feat(web): add top-level dashboard components (Header, Stats, etc.)

Adds the remaining dashboard-level components: DashboardHeader.tsx,
DashboardStatCard.tsx, StatCard.tsx (dashboard-scoped), and the
feature barrel index.ts. Also includes legacy components that were
refactored into charts/ and widgets/ sub-directories." \
"src/components/features/dashboard/DashboardHeader.tsx" \
"src/components/features/dashboard/DashboardStatCard.tsx" \
"src/components/features/dashboard/StatCard.tsx" \
"src/components/features/dashboard/index.ts"

# Commit 16 — Accounts Feature Components
commit_files "feat(web): add Accounts feature components (AccountCard, DetailsModal)

Implements AccountCard.tsx (compact account summary card) and
AccountDetailsModal.tsx (full-screen modal with transaction history,
charts, and account metadata). Barrel export via accounts/index.ts." \
"src/components/features/accounts/AccountCard.tsx" \
"src/components/features/accounts/AccountDetailsModal.tsx" \
"src/components/features/accounts/index.ts"

# Commit 17 — Transactions Feature Components
commit_files "feat(web): add Transactions feature components (modals for add/view)

Adds TransactionFormModal.tsx (create/edit transaction form with
validation) and TransactionDetailsModal.tsx (read-only transaction
detail view). Barrel exported from transactions/index.ts." \
"src/components/features/transactions/TransactionFormModal.tsx" \
"src/components/features/transactions/TransactionDetailsModal.tsx" \
"src/components/features/transactions/index.ts"

# Commit 18 — Chat Feature Components
commit_files "feat(web): add Chat feature components with unit tests

Implements ChatInterface.tsx (full conversation UI with streaming
message support) and MessageBubble.tsx (individual message renderer).
Includes unit tests for both components. Barrel exported from chat/index.ts." \
"src/components/features/chat/ChatInterface.tsx" \
"src/components/features/chat/MessageBubble.tsx" \
"src/components/features/chat/ChatInterface.test.tsx" \
"src/components/features/chat/MessageBubble.test.tsx" \
"src/components/features/chat/index.ts"

# Commit 19 — Emergency Fund Feature Component
commit_files "feat(web): add EmergencyFundForm feature component

Adds EmergencyFundForm.tsx used within the Budget page for users to
configure and track their emergency fund target and progress." \
"src/components/features/emergencyFund/EmergencyFundForm.tsx" \
"src/components/features/emergencyFund/index.ts"

# Commit 20 — Pages
commit_files "feat(web): add all application pages (Dashboard, Accounts, Transactions, etc.)

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
- NotFound.tsx — 404 fallback page" \
"src/pages/Dashboard.tsx" \
"src/pages/Accounts.tsx" \
"src/pages/Transactions.tsx" \
"src/pages/Portfolio.tsx" \
"src/pages/Budget.tsx" \
"src/pages/Reports.tsx" \
"src/pages/Imports.tsx" \
"src/pages/Chat.tsx" \
"src/pages/Settings.tsx" \
"src/pages/NotFound.tsx"

# Commit 21 — E2E Tests (Playwright)
commit_files "test(web): add Playwright e2e tests for all pages

Adds smoke-level Playwright end-to-end specs for all key pages:
dashboard, accounts, transactions, portfolio, budget, imports, and
chat. Also includes playwright.config.ts and the test-setup file." \
"playwright.config.ts" \
"src/test-setup.ts" \
"e2e/dashboard.spec.ts" \
"e2e/accounts.spec.ts" \
"e2e/transactions.spec.ts" \
"e2e/portfolio.spec.ts" \
"e2e/budget.spec.ts" \
"e2e/imports.spec.ts" \
"e2e/chat.spec.ts"

# Commit 22 — Documentation & Audit Files
commit_files "docs(web): add codebase audit, ideal structure, and UI structure docs

Adds reference documentation for the web app: CODEBASE_AUDIT.md
(structural analysis and identified issues), IDEAL_STRUCTURE.md
(recommended folder organization), UI_STRUCTURE.md (component
hierarchy and page layouts), and README.md." \
"README.md" \
"CODEBASE_AUDIT.md" \
"IDEAL_STRUCTURE.md" \
"UI_STRUCTURE.md"

# Final status check
echo "🎉 All commits completed successfully!"
echo "=================================================="
echo ""
echo "📊 Final Git Status:"
git status
echo ""
echo "📈 Recent commits:"
git log --oneline -10
echo ""

# Ask if user wants to push to remote
read -p "📤 Do you want to push all commits to the remote repository? (y/N): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    push_to_remote
else
    echo "ℹ️  Skipping push to remote. You can push manually later with:"
    echo "   git push origin main"
    echo "   or"
    echo "   git push origin master"
fi

echo ""
echo "✅ Git commit process completed!"
echo "💡 Tip: You can run individual commits by editing this script or using git commands manually."
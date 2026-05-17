import { useDashboard } from '@/hooks'
import AccountDetailsModal from '@/components/features/accounts/AccountDetailsModal'
import TransactionFormModal from '@/components/features/transactions/TransactionFormModal'
import {
  DashboardHeader,
  StatsOverview,
  AccountsOverview,
  QuickActionsPanel,
  FinancialHealthScore,
  AlertsPanel,
  SavingsGoalsWidget,
  CashFlowCalendar,
  ChartsGrid,
} from '@/components/features/dashboard'

export default function Dashboard() {
  const dash = useDashboard()

  if (dash.isLoading) {
    return (
      <div className="pt-16">
        <div className="max-w-[1440px] mx-auto px-8 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
              <p className="mt-4 text-slate-600">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!dash.accounts || dash.accounts.length === 0) {
    return (
      <div className="pt-16">
        <div className="max-w-[1440px] mx-auto px-8 py-8">
          <div className="text-center py-12">
            <p className="text-slate-600">No accounts found. Create your first account to get started!</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-16">
      <div className="max-w-[1440px] mx-auto px-8 py-8">

        <DashboardHeader
          autoRefreshInterval={dash.autoRefreshInterval}
          setAutoRefreshInterval={dash.setAutoRefreshInterval}
          showCustomizeMenu={dash.showCustomizeMenu}
          setShowCustomizeMenu={dash.setShowCustomizeMenu}
          visibleWidgets={dash.visibleWidgets}
          toggleWidget={dash.toggleWidget}
          handleRefresh={dash.handleRefresh}
          isRefreshing={dash.isRefreshing}
        />

        <StatsOverview
          visibleWidgets={{ stats: dash.visibleWidgets.stats }}
          stats={dash.stats}
          statSparklineData={dash.statSparklineData}
          setShowTransactionModal={dash.setShowTransactionModal}
        />

        <AccountsOverview
          visibleWidgets={{ accounts: dash.visibleWidgets.accounts }}
          accounts={dash.accounts}
          setSelectedAccount={dash.setSelectedAccount}
          setIsModalOpen={dash.setIsModalOpen}
        />

        {/* Quick Actions and Health Score Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {dash.visibleWidgets.quickActions && (
            <QuickActionsPanel
              onAddTransaction={() => dash.setShowTransactionModal(true)}
              onTransfer={() => console.log('Transfer funds')}
              onAddInvestment={() => console.log('Add investment')}
              onPayBill={() => console.log('Pay bill')}
              onSetGoal={() => console.log('Set goal')}
            />
          )}
          {dash.visibleWidgets.healthScore && (
            <FinancialHealthScore
              overall={dash.financialHealthScore.overall}
              subScores={dash.financialHealthScore.subScores}
              recommendations={dash.financialHealthScore.recommendations}
              benchmark={dash.financialHealthScore.benchmark}
            />
          )}
        </div>

        {/* Alerts Panel */}
        {dash.visibleWidgets.alerts && (
          <div className="mb-8">
            <AlertsPanel alerts={dash.dashboardAlerts} maxDisplay={4} />
          </div>
        )}

        {/* Savings Goals and Cash Flow Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {dash.visibleWidgets.savingsGoals && (
            <SavingsGoalsWidget goals={dash.savingsGoals} maxDisplay={4} />
          )}
          {dash.visibleWidgets.cashFlow && (
            <CashFlowCalendar events={dash.cashFlowCalendarData} />
          )}
        </div>

        <ChartsGrid
          visibleWidgets={{
            netWorth: dash.visibleWidgets.netWorth,
            allocation: dash.visibleWidgets.allocation,
            expenses: dash.visibleWidgets.expenses,
            portfolio: dash.visibleWidgets.portfolio,
          }}
          filteredNetWorthData={dash.filteredNetWorthData}
          netWorthTimeRange={dash.netWorthTimeRange}
          netWorthChartType={dash.netWorthChartType}
          showForecast={dash.showForecast}
          setNetWorthTimeRange={dash.setNetWorthTimeRange}
          setNetWorthChartType={dash.setNetWorthChartType}
          setShowForecast={dash.setShowForecast}
          assetAllocationData={dash.assetAllocationData}
          monthlyExpensesData={dash.monthlyExpensesData}
          filteredPortfolioData={dash.filteredPortfolioData}
          portfolioTimeRange={dash.portfolioTimeRange}
          portfolioChartType={dash.portfolioChartType}
          setPortfolioTimeRange={dash.setPortfolioTimeRange}
          setPortfolioChartType={dash.setPortfolioChartType}
        />
      </div>

      {dash.selectedAccount && (
        <AccountDetailsModal
          account={dash.selectedAccount}
          transactions={dash.selectedAccountTransactions}
          holdings={dash.selectedAccountHoldings}
          isOpen={dash.isModalOpen}
          onClose={() => {
            dash.setIsModalOpen(false)
            dash.setSelectedAccount(null)
          }}
        />
      )}

      {dash.showTransactionModal && (
        <TransactionFormModal
          isOpen={dash.showTransactionModal}
          onClose={() => dash.setShowTransactionModal(false)}
          onSave={async (transactionData) => {
            console.log('New transaction:', transactionData)
            dash.setShowTransactionModal(false)
          }}
          transaction={undefined}
        />
      )}
    </div>
  )
}

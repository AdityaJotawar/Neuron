import {
  useDashboardData,
  useDashboardWidgets,
  useDashboardCharts,
  useDashboardModals,
  useDashboardRefresh,
} from '@/hooks'
import AccountDetailsModal from '@/components/features/accounts/AccountDetailsModal'
import TransactionFormModal from '@/components/features/transactions/TransactionFormModal'
import {
  DashboardHeader,
  StatsOverview,
  QuickActionsPanel,
  FinancialHealthScore,
  AlertsPanel,
  SavingsGoalsWidget,
  CashFlowCalendar,
  ChartsGrid,
} from '@/components/features/dashboard'
import AccountsOverview from '@/components/features/dashboard/widgets/AccountsOverview'
import {
  financialHealthScore,
  dashboardAlerts,
  savingsGoals,
  cashFlowCalendarData,
} from '@/api/mock/data/mockDashboard'

export default function Dashboard() {
  const data = useDashboardData()
  const widgets = useDashboardWidgets()
  const charts = useDashboardCharts(data)
  const modals = useDashboardModals(data)
  const refresh = useDashboardRefresh()

  if (data.isLoading) {
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

  if (!data.accounts || data.accounts.length === 0) {
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
          autoRefreshInterval={refresh.autoRefreshInterval}
          onAutoRefreshIntervalChange={refresh.onAutoRefreshIntervalChange}
          showCustomizeMenu={widgets.showCustomizeMenu}
          onCustomizeMenuToggle={() => widgets.setShowCustomizeMenu(!widgets.showCustomizeMenu)}
          visibleWidgets={widgets.visibleWidgets}
          toggleWidget={widgets.toggleWidget}
          onRefresh={refresh.onRefresh}
          isRefreshing={refresh.isRefreshing}
        />

        <StatsOverview
          visibleWidgets={{ stats: widgets.visibleWidgets.stats }}
          stats={data.stats || {
            netWorth: 0,
            netWorthChange: 0,
            totalAssets: 0,
            assetsChange: 0,
            totalLiabilities: 0,
            liabilitiesChange: 0,
            monthlyCashFlow: 0,
          }}
          statSparklineData={data.statSparklineData}
          onAddTransaction={modals.onTransactionModalOpen}
        />

        <AccountsOverview
          visibleWidgets={{ accounts: widgets.visibleWidgets.accounts }}
          accounts={data.accounts}
          onAccountSelect={modals.onAccountSelect}
          onAccountModalOpen={modals.onAccountModalOpen}
        />

        {/* Quick Actions and Health Score Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {widgets.visibleWidgets.quickActions && (
            <QuickActionsPanel
              onAddTransaction={modals.onTransactionModalOpen}
              onTransfer={() => console.log('Transfer funds')}
              onAddInvestment={() => console.log('Add investment')}
              onPayBill={() => console.log('Pay bill')}
              onSetGoal={() => console.log('Set goal')}
            />
          )}
          {widgets.visibleWidgets.healthScore && (
            <FinancialHealthScore
              overall={financialHealthScore.overall}
              subScores={financialHealthScore.subScores}
              recommendations={financialHealthScore.recommendations}
              benchmark={financialHealthScore.benchmark}
            />
          )}
        </div>

        {/* Alerts Panel */}
        {widgets.visibleWidgets.alerts && (
          <div className="mb-8">
            <AlertsPanel alerts={dashboardAlerts} maxDisplay={4} />
          </div>
        )}

        {/* Savings Goals and Cash Flow Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {widgets.visibleWidgets.savingsGoals && (
            <SavingsGoalsWidget goals={savingsGoals} maxDisplay={4} />
          )}
          {widgets.visibleWidgets.cashFlow && (
            <CashFlowCalendar events={cashFlowCalendarData} />
          )}
        </div>

        <ChartsGrid
          visibleWidgets={{
            netWorth: widgets.visibleWidgets.netWorth,
            allocation: widgets.visibleWidgets.allocation,
            expenses: widgets.visibleWidgets.expenses,
            portfolio: widgets.visibleWidgets.portfolio,
          }}
          filteredNetWorthData={charts.filteredNetWorthData}
          netWorthTimeRange={charts.netWorthTimeRange}
          netWorthChartType={charts.netWorthChartType}
          showForecast={charts.showForecast}
          setNetWorthTimeRange={charts.onNetWorthTimeRangeChange}
          setNetWorthChartType={charts.onNetWorthChartTypeChange}
          setShowForecast={charts.onForecastToggle}
          assetAllocationData={charts.assetAllocationData}
          monthlyExpensesData={charts.monthlyExpensesData}
          filteredPortfolioData={charts.filteredPortfolioData}
          portfolioTimeRange={charts.portfolioTimeRange}
          portfolioChartType={charts.portfolioChartType}
          setPortfolioTimeRange={charts.onPortfolioTimeRangeChange}
          setPortfolioChartType={charts.onPortfolioChartTypeChange}
        />
      </div>

      {modals.selectedAccount && (
        <AccountDetailsModal
          account={modals.selectedAccount}
          transactions={modals.selectedAccountTransactions}
          holdings={modals.selectedAccountHoldings}
          isOpen={modals.isAccountModalOpen}
          onClose={modals.onAccountModalClose}
        />
      )}

      {modals.isTransactionModalOpen && (
        <TransactionFormModal
          isOpen={modals.isTransactionModalOpen}
          onClose={modals.onTransactionModalClose}
          onSave={async (transactionData) => {
            console.log('New transaction:', transactionData)
            modals.onTransactionModalClose()
          }}
          transaction={undefined}
        />
      )}
    </div>
  )
}

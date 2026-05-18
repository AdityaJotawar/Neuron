
import { useNavigate } from 'react-router-dom'
import AccountCard from '@/components/features/accounts/AccountCard'
import type { Account } from '@/types'

interface AccountsOverviewProps {
    visibleWidgets: { accounts: boolean }
    accounts: Account[]
    onAccountSelect: (account: Account) => void
    onAccountModalOpen: () => void
}

export default function AccountsOverview({
    visibleWidgets,
    accounts,
    onAccountSelect,
    onAccountModalOpen
}: AccountsOverviewProps) {
    const navigate = useNavigate()

    if (!visibleWidgets.accounts) return null

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Accounts</h2>
                <button
                    className="text-sm font-medium text-primary-600 hover:text-primary-700 cursor-pointer"
                    onClick={() => navigate('/accounts')}
                >
                    View All →
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
                {accounts.map((account) => (
                    <AccountCard
                        key={account.id}
                        accountType={account.accountType}
                        name={account.name}
                        balance={account.balance}
                        savingsMetrics={account.savingsMetrics}
                        checkingMetrics={account.checkingMetrics}
                        loanDetails={account.loanDetails}
                        tradingMetrics={account.tradingMetrics}
                        propertyMetrics={account.propertyMetrics}
                        onClick={() => {
                            onAccountSelect(account)
                            onAccountModalOpen()
                        }}
                    />
                ))}
            </div>
        </div>
    )
}

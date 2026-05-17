
import { useNavigate } from 'react-router-dom'
import AccountCard from '../accounts/AccountCard.tsx'
import type { Account } from '../../../types/index.ts'

interface AccountsOverviewProps {
    visibleWidgets: { accounts: boolean }
    accounts: Account[]
    setSelectedAccount: (account: Account | null) => void
    setIsModalOpen: (open: boolean) => void
}

export default function AccountsOverview({
    visibleWidgets,
    accounts,
    setSelectedAccount,
    setIsModalOpen
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
                            setSelectedAccount(account)
                            setIsModalOpen(true)
                        }}
                    />
                ))}
            </div>
        </div>
    )
}

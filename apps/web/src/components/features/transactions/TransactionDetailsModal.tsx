
import Modal from '../../ui/Modal'
import Badge from '../../ui/Badge'
import type { Transaction, TransactionCategory } from '../../../types'

interface TransactionDetailsModalProps {
    transaction: Transaction
    isOpen: boolean
    onClose: () => void
}

const categoryVariants: Record<TransactionCategory, 'default' | 'error' | 'success' | 'warning' | 'info'> = {
    salary: 'success',
    bonus: 'success',
    'investment-income': 'success',
    'rental-income': 'success',
    housing: 'warning',
    utilities: 'warning',
    transportation: 'warning',
    food: 'warning',
    shopping: 'default',
    entertainment: 'default',
    healthcare: 'error',
    financial: 'default',
    education: 'info',
    other: 'default'
}

export default function TransactionDetailsModal({ transaction, isOpen, onClose }: TransactionDetailsModalProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount)
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Transaction Details">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                    <p className="text-2xl font-bold text-slate-900">{formatCurrency(transaction.amount)}</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                    <Badge variant={transaction.type === 'deposit' ? 'success' : 'error'}>
                        {transaction.type}
                    </Badge>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <Badge variant={categoryVariants[transaction.category]}>
                        {transaction.category.replace('-', ' ')}
                    </Badge>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <p className="text-slate-900">{transaction.description}</p>
                </div>

                {transaction.merchant && (
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Merchant</label>
                        <p className="text-slate-900">{transaction.merchant}</p>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                    <p className="text-slate-900">{transaction.date.toLocaleDateString()}</p>
                </div>
            </div>
        </Modal>
    )
}

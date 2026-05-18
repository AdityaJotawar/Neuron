import React, { useState } from 'react'
import Modal from '../../ui/Modal'
import Button from '../../ui/Button'
import Input from '../../ui/Input'
import Label from '../../ui/Label'
import Select from '../../ui/Select'
import type { Transaction, TransactionType, TransactionCategory } from '../../../types'

interface TransactionFormModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => void
    transaction?: Transaction
}

const transactionTypes: { value: TransactionType; label: string }[] = [
    { value: 'deposit', label: 'Deposit' },
    { value: 'withdrawal', label: 'Withdrawal' },
    { value: 'transfer', label: 'Transfer' },
    { value: 'purchase', label: 'Purchase' }
]

const transactionCategories: { value: TransactionCategory; label: string }[] = [
    { value: 'salary', label: 'Salary' },
    { value: 'bonus', label: 'Bonus' },
    { value: 'investment-income', label: 'Investment Income' },
    { value: 'rental-income', label: 'Rental Income' },
    { value: 'housing', label: 'Housing' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'food', label: 'Food' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'financial', label: 'Financial' },
    { value: 'education', label: 'Education' },
    { value: 'other', label: 'Other' }
]

export default function TransactionFormModal({ isOpen, onClose, onSave, transaction }: TransactionFormModalProps) {
    const [formData, setFormData] = useState({
        type: transaction?.type || 'deposit' as TransactionType,
        amount: transaction?.amount?.toString() || '',
        category: transaction?.category || 'other' as TransactionCategory,
        description: transaction?.description || '',
        merchant: transaction?.merchant || '',
        date: transaction?.date?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const transactionData: Omit<Transaction, 'id' | 'userId' | 'createdAt'> = {
            accountId: transaction?.accountId || '',
            type: formData.type,
            amount: parseFloat(formData.amount),
            category: formData.category,
            description: formData.description,
            merchant: formData.merchant || undefined,
            date: new Date(formData.date)
        }

        onSave(transactionData)
        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={transaction ? 'Edit Transaction' : 'Add Transaction'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="type">Type</Label>
                    <Select
                        id="type"
                        value={formData.type}
                        onChange={(value) => setFormData(prev => ({ ...prev, type: value as TransactionType }))}
                        options={transactionTypes}
                        className="mt-1"
                    />
                </div>

                <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                        placeholder="0.00"
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                        id="category"
                        value={formData.category}
                        onChange={(value) => setFormData(prev => ({ ...prev, category: value as TransactionCategory }))}
                        options={transactionCategories}
                        className="mt-1"
                    />
                </div>

                <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Transaction description"
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="merchant">Merchant (Optional)</Label>
                    <Input
                        id="merchant"
                        value={formData.merchant}
                        onChange={(e) => setFormData(prev => ({ ...prev, merchant: e.target.value }))}
                        placeholder="Merchant name"
                    />
                </div>

                <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                        required
                    />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit">
                        {transaction ? 'Update' : 'Add'} Transaction
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

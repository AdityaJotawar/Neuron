import { Link, useLocation } from 'react-router-dom'
import { DollarSign, Plus } from 'lucide-react'
import Button from '../ui/Button'

const navItems = [
  { path: '/', label: 'Dashboard' },
  { path: '/accounts', label: 'Accounts' },
  { path: '/transactions', label: 'Transactions' },
  { path: '/portfolio', label: 'Portfolio' },
  { path: '/budget', label: 'Budget' },
  { path: '/reports', label: 'Reports' },
  { path: '/imports', label: 'Imports' },
  { path: '/chat', label: 'Chat' },
]

export default function Navigation() {
  const location = useLocation()

  return (
    <nav className="bg-white border-b border-slate-200 h-16 fixed top-0 left-0 right-0 z-50">
      <div className="h-full px-8 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">FinanceTracker</span>
          </Link>
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 text-sm font-medium ${location.pathname === item.path
                    ? 'text-primary-600 border-b-2 border-primary-500'
                    : 'text-slate-700 hover:text-slate-900'
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Transaction
          </Button>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-700">John Doe</span>
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-semibold">
              JD
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

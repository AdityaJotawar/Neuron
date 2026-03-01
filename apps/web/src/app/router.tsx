import { lazy, Suspense } from 'react'
import { createBrowserRouter, Outlet } from 'react-router-dom'
import Navigation from '../components/layout/Navigation'

// Lazy-loaded page components — each page becomes its own bundle chunk
const Dashboard = lazy(() => import('../pages/Dashboard'))
const Accounts = lazy(() => import('../pages/Accounts'))
const Transactions = lazy(() => import('../pages/Transactions'))
const Portfolio = lazy(() => import('../pages/Portfolio'))
const Budget = lazy(() => import('../pages/Budget'))
const Reports = lazy(() => import('../pages/Reports'))
const Imports = lazy(() => import('../pages/Imports'))
const Chat = lazy(() => import('../pages/Chat'))
const Settings = lazy(() => import('../pages/Settings'))
const NotFound = lazy(() => import('../pages/NotFound'))

// Layout shell: Navigation bar + lazy Suspense wrapped outlet
function AppLayout() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Navigation />
            <Suspense fallback={
                <div className="pt-16 flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
                        <p className="mt-4 text-slate-600">Loading...</p>
                    </div>
                </div>
            }>
                <Outlet />
            </Suspense>
        </div>
    )
}

export const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        children: [
            { index: true, element: <Dashboard /> },
            { path: 'accounts', element: <Accounts /> },
            { path: 'transactions', element: <Transactions /> },
            { path: 'portfolio', element: <Portfolio /> },
            { path: 'budget', element: <Budget /> },
            { path: 'reports', element: <Reports /> },
            { path: 'imports', element: <Imports /> },
            { path: 'chat', element: <Chat /> },
            { path: 'settings', element: <Settings /> },
            { path: '*', element: <NotFound /> },
        ],
    },
])

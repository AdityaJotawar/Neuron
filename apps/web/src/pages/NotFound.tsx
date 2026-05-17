// 404 Not Found page
import { Link } from 'react-router-dom'
import { ROUTES } from '@/utils/constants'

export default function NotFound() {
    return (
        <div className="pt-16 min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center max-w-md mx-auto px-8">
                <div className="text-8xl font-bold text-primary-500 mb-4">404</div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Page not found</h1>
                <p className="text-slate-600 mb-8">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link
                    to={ROUTES.dashboard}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
                >
                    ← Back to Dashboard
                </Link>
            </div>
        </div>
    )
}

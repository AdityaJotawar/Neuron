import { Link } from 'react-router-dom'
import { Home, ChevronRight } from 'lucide-react'
import ChatInterface from '../components/features/chat/ChatInterface'

export default function Chat() {
    return (
        <div className="pt-16">
            <div className="max-w-[1440px] mx-auto px-8 py-8">
                {/* Page Header with Breadcrumbs */}
                <div className="mb-8">
                    <nav className="flex mb-4" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-3">
                            <li className="inline-flex items-center">
                                <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-700 hover:text-primary-600">
                                    <Home className="w-4 h-4 mr-2" />
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <ChevronRight className="w-4 h-4 text-slate-400" />
                                    <span className="ml-1 text-sm font-medium text-slate-500 md:ml-2">Chat</span>
                                </div>
                            </li>
                        </ol>
                    </nav>
                    <h1 className="text-3xl font-bold text-slate-900">AI Chat</h1>
                    <p className="text-slate-600 mt-1">Ask questions about your financial data using natural language</p>
                </div>

                {/* Chat Interface */}
                <div className="h-[600px]">
                    <ChatInterface />
                </div>
            </div>
        </div>
    )
}
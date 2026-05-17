

export default function Footer() {
    return (
        <footer className="bg-white border-t border-slate-200 px-8 py-4">
            <div className="flex items-center justify-between text-sm text-slate-600">
                <div>
                    © 2025 FinanceTracker. All rights reserved.
                </div>
                <div className="flex items-center gap-4">
                    <a href="#" className="hover:text-slate-900">Privacy Policy</a>
                    <a href="#" className="hover:text-slate-900">Terms of Service</a>
                    <a href="#" className="hover:text-slate-900">Support</a>
                </div>
            </div>
        </footer>
    )
}
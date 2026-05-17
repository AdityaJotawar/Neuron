import { Download, FileText } from 'lucide-react'
import Button from '../components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'

export default function Reports() {
  return (
    <div className="pt-16">
      <div className="max-w-[1440px] mx-auto px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Reports</h1>
          <p className="text-slate-600 mt-1">Generate and export financial reports</p>
        </div>

        {/* Report Types */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <FileText className="w-8 h-8 text-blue-500 mb-3" />
              <CardTitle>Monthly Statement</CardTitle>
              <CardDescription>
                View your monthly financial summary including all accounts and transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
                  <option>November 2025</option>
                  <option>October 2025</option>
                  <option>September 2025</option>
                </select>
                <Button variant="secondary" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Generate PDF
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="w-8 h-8 text-emerald-500 mb-3" />
              <CardTitle>Tax Documents</CardTitle>
              <CardDescription>
                Annual income, expenses, and capital gains for tax reporting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
                  <option>2025</option>
                  <option>2024</option>
                  <option>2023</option>
                </select>
                <Button variant="secondary" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Generate PDF
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="w-8 h-8 text-purple-500 mb-3" />
              <CardTitle>Custom Report</CardTitle>
              <CardDescription>
                Create a custom report with specific date ranges and categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  placeholder="Start Date"
                />
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  placeholder="End Date"
                />
                <Button variant="secondary" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

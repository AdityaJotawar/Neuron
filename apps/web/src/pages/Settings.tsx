import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import Button from '../components/ui/Button'

export default function Settings() {
  return (
    <div className="pt-16">
      <div className="max-w-[1440px] mx-auto px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-600 mt-1">Manage your account and preferences</p>
        </div>

        <div className="max-w-3xl space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    defaultValue="John Doe"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue="john.doe@example.com"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Currency</label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Date Format</label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                    <option>MM/DD/YYYY</option>
                    <option>DD/MM/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
                <Button>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button variant="secondary">Change Password</Button>
                <Button variant="secondary">Enable Two-Factor Authentication</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

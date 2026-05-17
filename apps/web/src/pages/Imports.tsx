import { useState, useRef, useCallback } from 'react'
import { Upload, FileText, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card.tsx'
import Button from '../components/ui/Button.tsx'
import Badge from '../components/ui/Badge.tsx'
import { mockAccounts } from '../api/mock/data/mockAccounts.ts'
import { getSortedImportHistory, getFieldMappingsByType } from '../api/mock/data/mockImports.ts'
import { formatDate } from '../utils/index.ts'
import type { ImportHistory, ImportFileType, ParsedCSVRow } from '../types/index.ts'

export default function Imports() {
  const [importHistory, setImportHistory] = useState<ImportHistory[]>(getSortedImportHistory())
  const [selectedAccount, setSelectedAccount] = useState<string>('')
  const [selectedFileType, setSelectedFileType] = useState<ImportFileType>('transactions')
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [columnMappings, setColumnMappings] = useState<Record<string, string>>({})
  const [showMappingModal, setShowMappingModal] = useState(false)
  const [parsedData, setParsedData] = useState<ParsedCSVRow[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }, [])

  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith('.csv')) {
      alert('Please upload a CSV file')
      return
    }

    if (!selectedAccount) {
      alert('Please select an account first')
      return
    }

    setUploadedFile(file)

    // Parse CSV to extract headers
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split('\n')
      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))

      // Parse all rows
      const rows: ParsedCSVRow[] = []
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''))
          const row: ParsedCSVRow = {}
          headers.forEach((header, index) => {
            row[header] = values[index] || ''
          })
          rows.push(row)
        }
      }

      setCsvHeaders(headers)
      setParsedData(rows)

      // Auto-map columns based on common names
      const autoMappings: Record<string, string> = {}
      const fieldMappings = getFieldMappingsByType(selectedFileType)

      fieldMappings.forEach(mapping => {
        const matchingHeader = headers.find(h =>
          h.toLowerCase() === mapping.csvColumn.toLowerCase() ||
          h.toLowerCase().includes(mapping.appField.toLowerCase())
        )
        if (matchingHeader) {
          autoMappings[mapping.appField] = matchingHeader
        }
      })

      setColumnMappings(autoMappings)
      setShowMappingModal(true)
    }
    reader.readAsText(file)
  }, [selectedAccount, selectedFileType])

  const handleImport = useCallback(() => {
    if (!uploadedFile || !selectedAccount) return

    const fieldMappings = getFieldMappingsByType(selectedFileType)
    const requiredFields = fieldMappings.filter(f => f.required).map(f => f.appField)
    const missingFields = requiredFields.filter(field => !columnMappings[field])

    if (missingFields.length > 0) {
      alert(`Please map the following required fields: ${missingFields.join(', ')}`)
      return
    }

    // Simulate import process
    const accountName = mockAccounts.find(a => a.id === selectedAccount)?.name || 'Unknown Account'

    const newImport: ImportHistory = {
      id: `import-${Date.now()}`,
      userId: 'user-123',
      fileName: uploadedFile.name,
      fileType: selectedFileType,
      status: 'completed',
      totalRows: parsedData.length,
      successfulRows: parsedData.length,
      failedRows: 0,
      uploadedAt: new Date(),
      completedAt: new Date(),
      accountId: selectedAccount,
      accountName,
    }

    setImportHistory([newImport, ...importHistory])

    // Reset state
    setUploadedFile(null)
    setCsvHeaders([])
    setColumnMappings({})
    setParsedData([])
    setShowMappingModal(false)
    setSelectedAccount('')

    alert(`Successfully imported ${parsedData.length} ${selectedFileType}!`)
  }, [uploadedFile, selectedAccount, selectedFileType, columnMappings, parsedData, importHistory])

  const getStatusIcon = (status: ImportHistory['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'processing':
        return <Clock className="w-5 h-5 text-blue-500" />
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-amber-500" />
    }
  }

  const getStatusBadge = (status: ImportHistory['status']) => {
    const variants: Record<typeof status, 'success' | 'error' | 'warning' | 'default'> = {
      completed: 'success',
      failed: 'error',
      processing: 'warning',
      pending: 'default',
    }
    return <Badge variant={variants[status]}>{status}</Badge>
  }

  return (
    <div className="pt-16">
      <div className="max-w-[1440px] mx-auto px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Imports</h1>
          <p className="text-slate-600 mt-1">Upload CSV files to import transactions, accounts, or stock holdings.</p>
        </div>

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upload CSV File</CardTitle>
            <CardDescription>Choose an account and upload a CSV file to import data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Account Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Account
                </label>
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Choose an account...</option>
                  {mockAccounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name} - {account.institution}
                    </option>
                  ))}
                </select>
              </div>

              {/* File Type Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Import Type
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedFileType('transactions')}
                    className={`px-4 py-2 rounded-lg border font-medium text-sm transition-colors ${selectedFileType === 'transactions'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                      }`}
                  >
                    Transactions
                  </button>
                  <button
                    onClick={() => setSelectedFileType('stock_holdings')}
                    className={`px-4 py-2 rounded-lg border font-medium text-sm transition-colors ${selectedFileType === 'stock_holdings'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                      }`}
                  >
                    Stock Holdings
                  </button>
                  <button
                    onClick={() => setSelectedFileType('accounts')}
                    className={`px-4 py-2 rounded-lg border font-medium text-sm transition-colors ${selectedFileType === 'accounts'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                      }`}
                  >
                    Accounts
                  </button>
                </div>
              </div>

              {/* File Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${dragActive
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-slate-300 bg-slate-50 hover:border-slate-400'
                  }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-slate-700 mb-2">
                  {uploadedFile ? uploadedFile.name : 'Choose a file or drag and drop'}
                </p>
                <p className="text-sm text-slate-500 mb-4">CSV files only</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileInput}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={!selectedAccount}
                >
                  Choose File
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Column Mapping Modal */}
        {showMappingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900">Map CSV Columns</h2>
                <p className="text-slate-600 mt-1">
                  Map your CSV columns to the appropriate fields. Required fields are marked with *
                </p>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                <div className="space-y-4">
                  {getFieldMappingsByType(selectedFileType).map((field) => (
                    <div key={field.appField} className="flex items-center gap-4">
                      <div className="w-1/3">
                        <label className="block text-sm font-medium text-slate-700">
                          {field.csvColumn}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                      </div>
                      <div className="w-2/3">
                        <select
                          value={columnMappings[field.appField] || ''}
                          onChange={(e) => setColumnMappings({
                            ...columnMappings,
                            [field.appField]: e.target.value
                          })}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${field.required && !columnMappings[field.appField]
                            ? 'border-red-300'
                            : 'border-slate-300'
                            }`}
                        >
                          <option value="">Select column...</option>
                          {csvHeaders.map((header) => (
                            <option key={header} value={header}>
                              {header}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Preview */}
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Preview (First 3 rows)</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200">
                          {getFieldMappingsByType(selectedFileType).map((field) => (
                            <th key={field.appField} className="text-left py-2 px-3 font-medium text-slate-700">
                              {field.csvColumn}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {parsedData.slice(0, 3).map((row, idx) => (
                          <tr key={idx} className="border-b border-slate-100">
                            {getFieldMappingsByType(selectedFileType).map((field) => (
                              <td key={field.appField} className="py-2 px-3 text-slate-600">
                                {row[columnMappings[field.appField] || ''] || '-'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowMappingModal(false)
                    setUploadedFile(null)
                    setCsvHeaders([])
                    setColumnMappings({})
                    setParsedData([])
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleImport}>
                  Import {parsedData.length} Rows
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Import History */}
        <Card>
          <CardHeader>
            <CardTitle>Import History</CardTitle>
            <CardDescription>View past imports and their status</CardDescription>
          </CardHeader>
          <CardContent>
            {importHistory.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 font-medium">No imports yet</p>
                <p className="text-sm text-slate-500 mt-1">Upload your first CSV file to get started</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">File Name</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Type</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Account</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Rows</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Uploaded</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importHistory.map((item) => (
                      <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(item.status)}
                            {getStatusBadge(item.status)}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-slate-400" />
                            <span className="font-medium text-slate-900">{item.fileName}</span>
                          </div>
                          {item.errorMessage && (
                            <p className="text-xs text-red-600 mt-1">{item.errorMessage}</p>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-600 capitalize">
                          {item.fileType.replace('_', ' ')}
                        </td>
                        <td className="py-3 px-4 text-slate-600">{item.accountName}</td>
                        <td className="py-3 px-4">
                          <div className="text-sm">
                            <div className="text-emerald-600 font-medium">
                              {item.successfulRows} successful
                            </div>
                            {item.failedRows > 0 && (
                              <div className="text-red-600">
                                {item.failedRows} failed
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600 text-sm">
                          {formatDate(item.uploadedAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

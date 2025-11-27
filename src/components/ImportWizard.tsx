'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import { Upload } from 'lucide-react'
import { LeadType } from '@/lib/validations'

export function ImportWizard() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [leadType, setLeadType] = useState<string>('Diamond')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: number; errors: any[]; duplicates: number } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setResult(null)
    }
  }

  const handleImport = async () => {
    if (!file) {
      toast({
        title: 'Error',
        description: 'Please select a file to import',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('leadType', leadType)

      const response = await fetch('/api/leads/import', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setResult(data)

        toast({
          title: 'Import Complete',
          description: `Successfully imported ${data.success} leads. ${data.duplicates} duplicates skipped.`,
        })

        if (data.errors.length === 0) {
          setTimeout(() => {
            router.push('/leads')
            router.refresh()
          }, 2000)
        }
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.error || 'Failed to import CSV',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Import Leads from CSV</CardTitle>
          <CardDescription>
            Upload a CSV file containing your leads. Make sure the CSV has the correct headers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="leadType">Lead Type</Label>
            <Select value={leadType} onValueChange={setLeadType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LeadType.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">CSV File</Label>
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <input
                id="file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="file" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  {file ? file.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">CSV files only</p>
              </label>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Expected CSV Headers:</h4>
            <p className="text-sm text-muted-foreground">
              Name, Phone, Email, Address, City, State, Zip Code, Notes, Estimate, MAO, Offer Price, Equity, Status
              {leadType === 'Diamond' && ', Call Recording'}
            </p>
          </div>

          <Button onClick={handleImport} disabled={!file || isLoading} className="w-full">
            {isLoading ? 'Importing...' : 'Import Leads'}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Import Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Successfully imported:</span> {result.success} leads
            </p>
            <p className="text-sm">
              <span className="font-medium">Duplicates skipped:</span> {result.duplicates}
            </p>
            {result.errors.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-destructive mb-2">
                  Errors ({result.errors.length}):
                </p>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {result.errors.map((error, index) => (
                    <p key={index} className="text-xs text-muted-foreground">
                      Row {error.row}: {error.error}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

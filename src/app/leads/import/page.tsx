import { ImportWizard } from '@/components/ImportWizard'

export default function ImportPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Import Leads</h1>
        <p className="text-muted-foreground">
          Import leads from a CSV file
        </p>
      </div>

      <ImportWizard />
    </div>
  )
}

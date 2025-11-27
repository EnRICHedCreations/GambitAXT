import { LeadForm } from '@/components/LeadForm'

export default function NewLeadPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Lead</h1>
        <p className="text-muted-foreground">
          Create a new lead in your CRM
        </p>
      </div>

      <LeadForm mode="create" />
    </div>
  )
}

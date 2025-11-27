import { notFound } from 'next/navigation'
import { LeadForm } from '@/components/LeadForm'

async function getLead(id: string) {
  try {
    const response = await fetch(`http://localhost:3000/api/leads/${id}`, {
      cache: 'no-store',
    })
    if (!response.ok) {
      return null
    }
    return response.json()
  } catch (error) {
    return null
  }
}

export default async function EditLeadPage({ params }: { params: { id: string } }) {
  const lead = await getLead(params.id)

  if (!lead) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Lead</h1>
        <p className="text-muted-foreground">
          Update lead information for {lead.name}
        </p>
      </div>

      <LeadForm lead={lead} mode="edit" />
    </div>
  )
}

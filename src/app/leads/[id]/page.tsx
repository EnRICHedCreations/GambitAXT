import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ActivityTimeline } from '@/components/ActivityTimeline'
import { formatCurrency, formatPhone, formatDate, getEquityColor, getLeadTypeColor } from '@/lib/utils'
import { Pencil, MapPin, Phone, Mail, ExternalLink } from 'lucide-react'

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

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const lead = await getLead(params.id)

  if (!lead) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{lead.name}</h1>
            <Badge className={getLeadTypeColor(lead.leadType)}>
              {lead.leadType}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            Added {formatDate(lead.createdAt)}
          </p>
        </div>
        <Link href={`/leads/${lead.id}/edit`}>
          <Button>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Lead
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {lead.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${lead.phone}`} className="hover:underline">
                  {formatPhone(lead.phone)}
                </a>
              </div>
            )}
            {lead.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${lead.email}`} className="hover:underline">
                  {lead.email}
                </a>
              </div>
            )}
            {(lead.address || lead.city || lead.state) && (
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  {lead.address && <p>{lead.address}</p>}
                  {(lead.city || lead.state) && (
                    <p>
                      {lead.city}
                      {lead.city && lead.state && ', '}
                      {lead.state} {lead.zipCode}
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Estimate</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(lead.estimate ? Number(lead.estimate) : null)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">MAO</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(lead.mao ? Number(lead.mao) : null)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Offer Price</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(lead.offerPrice ? Number(lead.offerPrice) : null)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Equity</p>
                <p className={`text-lg font-semibold ${getEquityColor(lead.equity ? Number(lead.equity) : null)}`}>
                  {lead.equity ? `${Number(lead.equity)}%` : '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {lead.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{lead.notes}</p>
          </CardContent>
        </Card>
      )}

      {lead.callRecording && lead.leadType === 'Diamond' && (
        <Card>
          <CardHeader>
            <CardTitle>Call Recording</CardTitle>
          </CardHeader>
          <CardContent>
            <a
              href={lead.callRecording}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              Listen to Recording
              <ExternalLink className="h-4 w-4" />
            </a>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityTimeline activities={lead.activities || []} />
        </CardContent>
      </Card>
    </div>
  )
}

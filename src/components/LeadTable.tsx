'use client'

import Link from 'next/link'
import { Lead } from '@prisma/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatPhone, getEquityColor, getStatusColor, getLeadTypeColor } from '@/lib/utils'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { StatusDropdown } from './StatusDropdown'

interface LeadTableProps {
  leads: Lead[]
  onDelete?: (id: string) => void
  onStatusChange?: () => void
}

export function LeadTable({ leads, onDelete, onStatusChange }: LeadTableProps) {
  if (leads.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No leads found
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="text-right">Estimate</TableHead>
            <TableHead className="text-right">MAO</TableHead>
            <TableHead className="text-right">Offer</TableHead>
            <TableHead className="text-right">Equity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell>
                <Badge className={getLeadTypeColor(lead.leadType)}>
                  {lead.leadType}
                </Badge>
              </TableCell>
              <TableCell className="font-medium">
                <Link href={`/leads/${lead.id}`} className="hover:underline">
                  {lead.name}
                </Link>
              </TableCell>
              <TableCell>
                {lead.phone ? (
                  <a href={`tel:${lead.phone}`} className="hover:underline">
                    {formatPhone(lead.phone)}
                  </a>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell>
                <div className="max-w-xs">
                  {lead.address && (
                    <div className="font-medium">{lead.address}</div>
                  )}
                  <div className="text-sm text-muted-foreground">
                    {lead.city && lead.state ? `${lead.city}, ${lead.state} ${lead.zipCode || ''}`.trim() : lead.city || lead.state || '-'}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(lead.estimate ? Number(lead.estimate) : null)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(lead.mao ? Number(lead.mao) : null)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(lead.offerPrice ? Number(lead.offerPrice) : null)}
              </TableCell>
              <TableCell className="text-right">
                <span className={getEquityColor(lead.equity ? Number(lead.equity) : null)}>
                  {lead.equity ? `${Number(lead.equity)}%` : '-'}
                </span>
              </TableCell>
              <TableCell>
                <StatusDropdown
                  currentStatus={lead.status}
                  leadId={lead.id}
                  onStatusChange={onStatusChange}
                />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/leads/${lead.id}`}>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/leads/${lead.id}/edit`}>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete?.(lead.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

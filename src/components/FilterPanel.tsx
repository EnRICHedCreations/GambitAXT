'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LeadStatus, LeadType } from '@/lib/validations'

interface FilterPanelProps {
  onFilterChange: (filters: { type?: string; status?: string }) => void
}

export function FilterPanel({ onFilterChange }: FilterPanelProps) {
  return (
    <div className="flex gap-4">
      <Select onValueChange={(value) => onFilterChange({ type: value === 'all' ? undefined : value })}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Lead Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {LeadType.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => onFilterChange({ status: value === 'all' ? undefined : value })}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {LeadStatus.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

'use client'

import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LeadStatus } from '@/lib/validations'
import { getStatusColor } from '@/lib/utils'

interface StatusDropdownProps {
  currentStatus: string
  leadId: string
  onStatusChange?: (newStatus: string) => void
}

export function StatusDropdown({ currentStatus, leadId, onStatusChange }: StatusDropdownProps) {
  const [status, setStatus] = useState(currentStatus)
  const [isLoading, setIsLoading] = useState(false)

  const handleStatusChange = async (newStatus: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setStatus(newStatus)
        onStatusChange?.(newStatus)
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Select value={status} onValueChange={handleStatusChange} disabled={isLoading}>
      <SelectTrigger className="w-[180px]">
        <SelectValue>
          <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(status)}`}>
            {status}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {LeadStatus.map((s) => (
          <SelectItem key={s} value={s}>
            <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(s)}`}>
              {s}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

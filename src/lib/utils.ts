import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return '-'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return '-'
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  return phone
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '-'
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(d)
}

export function parseCurrency(value: string | undefined | null): number | null {
  if (!value || value.trim() === '') return null
  const cleaned = value.replace(/[$,]/g, '').trim()
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? null : parsed
}

export function getEquityColor(equity: number | null | undefined): string {
  if (equity === null || equity === undefined) return 'text-muted-foreground'
  if (equity > 70) return 'text-green-600'
  if (equity >= 40) return 'text-yellow-600'
  return 'text-red-600'
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'New': 'bg-gray-100 text-gray-800',
    'Contacted': 'bg-blue-100 text-blue-800',
    'Qualified': 'bg-purple-100 text-purple-800',
    'Follow-up': 'bg-yellow-100 text-yellow-800',
    'Contracted': 'bg-orange-100 text-orange-800',
    'Closed': 'bg-green-100 text-green-800',
    'Dead': 'bg-red-100 text-red-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export function getLeadTypeColor(leadType: string): string {
  return leadType === 'Diamond'
    ? 'bg-blue-100 text-blue-800 border-blue-300'
    : 'bg-green-100 text-green-800 border-green-300'
}

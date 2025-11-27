import { Lead, Activity } from '@prisma/client'

export type LeadWithActivities = Lead & {
  activities?: Activity[]
}

export type DashboardStats = {
  totalLeads: number
  diamondLeads: number
  dollarLeads: number
  statusBreakdown: Record<string, number>
  recentLeads: number
  closedDeals: number
}

export type ImportResult = {
  success: number
  errors: Array<{ row: number; error: string }>
  duplicates: number
}

import { z } from 'zod'

export const LeadStatus = [
  'New',
  'Contacted',
  'Qualified',
  'Follow-up',
  'Contracted',
  'Closed',
  'Dead',
] as const

export const LeadType = ['Diamond', 'Dollar'] as const

export const ActivityType = ['call', 'email', 'note', 'status_change'] as const

export const leadSchema = z.object({
  leadType: z.enum(LeadType),
  name: z.string().min(1, 'Name is required'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  notes: z.string().optional(),
  callRecording: z.string().url('Invalid URL').optional().or(z.literal('')),
  estimate: z.number().nonnegative().optional(),
  mao: z.number().nonnegative().optional(),
  offerPrice: z.number().nonnegative().optional(),
  equity: z.number().optional(),
  status: z.enum(LeadStatus).default('New'),
})

export const leadUpdateSchema = leadSchema.partial()

export const activitySchema = z.object({
  leadId: z.string(),
  activityType: z.enum(ActivityType),
  description: z.string().min(1, 'Description is required'),
})

export const leadFilterSchema = z.object({
  type: z.enum(LeadType).optional(),
  status: z.enum(LeadStatus).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(50),
  sortBy: z.enum(['name', 'createdAt', 'estimate', 'mao', 'status']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export type LeadFormData = z.infer<typeof leadSchema>
export type LeadUpdateData = z.infer<typeof leadUpdateSchema>
export type ActivityFormData = z.infer<typeof activitySchema>
export type LeadFilterData = z.infer<typeof leadFilterSchema>

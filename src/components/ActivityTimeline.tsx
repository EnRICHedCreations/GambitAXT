'use client'

import { Activity } from '@prisma/client'
import { formatDate } from '@/lib/utils'
import { Phone, Mail, FileText, TrendingUp } from 'lucide-react'

interface ActivityTimelineProps {
  activities: Activity[]
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'call':
      return Phone
    case 'email':
      return Mail
    case 'status_change':
      return TrendingUp
    default:
      return FileText
  }
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No activity yet
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => {
        const Icon = getActivityIcon(activity.activityType)
        return (
          <div key={activity.id} className="flex gap-4">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <Icon className="h-5 w-5 text-muted-foreground" />
              </div>
              {index < activities.length - 1 && (
                <div className="absolute left-5 top-10 h-full w-0.5 bg-muted" />
              )}
            </div>
            <div className="flex-1 space-y-1 pb-8">
              <p className="text-sm font-medium capitalize">{activity.activityType.replace('_', ' ')}</p>
              <p className="text-sm text-muted-foreground">{activity.description}</p>
              <p className="text-xs text-muted-foreground">{formatDate(activity.createdAt)}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

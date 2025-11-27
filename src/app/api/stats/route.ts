import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const [totalLeads, diamondLeads, dollarLeads, statusBreakdown, recentLeads, closedDeals] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { leadType: 'Diamond' } }),
      prisma.lead.count({ where: { leadType: 'Dollar' } }),
      prisma.lead.groupBy({
        by: ['status'],
        _count: true,
      }),
      prisma.lead.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
      }),
      prisma.lead.count({ where: { status: 'Closed' } }),
    ])

    const statusMap = statusBreakdown.reduce((acc, item) => {
      acc[item.status] = item._count
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      totalLeads,
      diamondLeads,
      dollarLeads,
      statusBreakdown: statusMap,
      recentLeads,
      closedDeals,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 })
  }
}

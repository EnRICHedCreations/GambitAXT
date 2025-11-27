import Link from 'next/link'
import { StatsCard } from '@/components/StatsCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Diamond, DollarSign, TrendingUp, Upload, Plus } from 'lucide-react'

async function getStats() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'

    const response = await fetch(`${baseUrl}/api/stats`, {
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

export default async function DashboardPage() {
  const stats = await getStats()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your wholesale real estate CRM
        </p>
      </div>

      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Leads"
            value={stats.totalLeads}
            icon={Users}
            description="All leads in system"
          />
          <StatsCard
            title="Diamond Leads"
            value={stats.diamondLeads}
            icon={Diamond}
            description="Premium leads"
          />
          <StatsCard
            title="Dollar Leads"
            value={stats.dollarLeads}
            icon={DollarSign}
            description="Standard leads"
          />
          <StatsCard
            title="Closed Deals"
            value={stats.closedDeals}
            icon={TrendingUp}
            description="Successfully closed"
          />
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/leads/new" className="block">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add New Lead
              </Button>
            </Link>
            <Link href="/leads/import" className="block">
              <Button className="w-full justify-start" variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Import CSV
              </Button>
            </Link>
            <Link href="/leads" className="block">
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                View All Leads
              </Button>
            </Link>
          </CardContent>
        </Card>

        {stats && stats.statusBreakdown && (
          <Card>
            <CardHeader>
              <CardTitle>Leads by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(stats.statusBreakdown).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{status}</span>
                    <span className="text-2xl font-bold">{count as number}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {!stats && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Unable to load statistics. Make sure your database is configured.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

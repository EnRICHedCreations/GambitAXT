'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { LeadTable } from '@/components/LeadTable'
import { SearchBar } from '@/components/SearchBar'
import { FilterPanel } from '@/components/FilterPanel'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Download, Trash2 } from 'lucide-react'
import { Lead } from '@prisma/client'
import { toast } from '@/components/ui/use-toast'

export const dynamic = 'force-dynamic'

export default function LeadsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 0,
  })
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || undefined,
    status: searchParams.get('status') || undefined,
    search: searchParams.get('search') || undefined,
  })

  useEffect(() => {
    fetchLeads()
  }, [filters, pagination.page])

  const fetchLeads = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.type) params.set('type', filters.type)
      if (filters.status) params.set('status', filters.status)
      if (filters.search) params.set('search', filters.search)
      params.set('page', pagination.page.toString())
      params.set('limit', '50')

      const response = await fetch(`/api/leads?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setLeads(data.leads)
        setPagination(prev => ({
          ...prev,
          total: data.total,
          totalPages: data.totalPages,
        }))
      }
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (query: string) => {
    setFilters({ ...filters, search: query || undefined })
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleFilterChange = (newFilters: { type?: string; status?: string }) => {
    setFilters({ ...filters, ...newFilters })
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return

    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Lead deleted successfully',
        })
        fetchLeads()
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete lead',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    }
  }

  const handleExport = async () => {
    try {
      const response = await fetch('/api/leads/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filters }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `leads_export_${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({
          title: 'Success',
          description: 'Leads exported successfully',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export leads',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteAll = async () => {
    if (!confirm('Are you sure you want to delete ALL leads? This action cannot be undone!')) return

    try {
      // Fetch all lead IDs
      const response = await fetch('/api/leads?limit=1000')
      if (!response.ok) {
        throw new Error('Failed to fetch leads')
      }

      const data = await response.json()
      const leadIds = data.leads.map((lead: Lead) => lead.id)

      // Delete all leads
      let successCount = 0
      for (const id of leadIds) {
        const deleteResponse = await fetch(`/api/leads/${id}`, {
          method: 'DELETE',
        })
        if (deleteResponse.ok) {
          successCount++
        }
      }

      toast({
        title: 'Success',
        description: `Deleted ${successCount} leads successfully`,
      })
      fetchLeads()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete all leads',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground">
            Manage your wholesale real estate leads
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleDeleteAll} variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete All
          </Button>
          <Button onClick={handleExport} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Link href="/leads/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Lead
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Leads</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SearchBar onSearch={handleSearch} />
          <FilterPanel onFilterChange={handleFilterChange} />
        </CardContent>
      </Card>

      {isLoading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Loading leads...</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <LeadTable
            leads={leads}
            onDelete={handleDelete}
            onStatusChange={fetchLeads}
          />

          {pagination.totalPages > 1 && (
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {((pagination.page - 1) * 50) + 1} to {Math.min(pagination.page * 50, pagination.total)} of {pagination.total} leads
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={pagination.page === 1}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                        let pageNum
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1
                        } else if (pagination.page <= 3) {
                          pageNum = i + 1
                        } else if (pagination.page >= pagination.totalPages - 2) {
                          pageNum = pagination.totalPages - 4 + i
                        } else {
                          pageNum = pagination.page - 2 + i
                        }
                        return (
                          <Button
                            key={pageNum}
                            variant={pagination.page === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                          >
                            {pageNum}
                          </Button>
                        )
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      disabled={pagination.page === pagination.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

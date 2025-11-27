'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LeadStatus, LeadType } from '@/lib/validations'
import { toast } from '@/components/ui/use-toast'
import { Lead } from '@prisma/client'

interface LeadFormProps {
  lead?: Lead
  mode: 'create' | 'edit'
}

export function LeadForm({ lead, mode }: LeadFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    leadType: lead?.leadType || 'Diamond',
    name: lead?.name || '',
    phone: lead?.phone || '',
    email: lead?.email || '',
    address: lead?.address || '',
    city: lead?.city || '',
    state: lead?.state || '',
    zipCode: lead?.zipCode || '',
    notes: lead?.notes || '',
    callRecording: lead?.callRecording || '',
    estimate: lead?.estimate ? Number(lead.estimate) : '',
    mao: lead?.mao ? Number(lead.mao) : '',
    offerPrice: lead?.offerPrice ? Number(lead.offerPrice) : '',
    equity: lead?.equity ? Number(lead.equity) : '',
    status: lead?.status || 'New',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const endpoint = mode === 'create' ? '/api/leads' : `/api/leads/${lead?.id}`
      const method = mode === 'create' ? 'POST' : 'PATCH'

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          estimate: formData.estimate ? Number(formData.estimate) : undefined,
          mao: formData.mao ? Number(formData.mao) : undefined,
          offerPrice: formData.offerPrice ? Number(formData.offerPrice) : undefined,
          equity: formData.equity ? Number(formData.equity) : undefined,
        }),
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Lead ${mode === 'create' ? 'created' : 'updated'} successfully`,
        })
        router.push('/leads')
        router.refresh()
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.error || 'Failed to save lead',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{mode === 'create' ? 'Add New Lead' : 'Edit Lead'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="leadType">Lead Type *</Label>
              <Select
                value={formData.leadType}
                onValueChange={(value) => setFormData({ ...formData, leadType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LeadType.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LeadStatus.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimate">Estimate ($)</Label>
              <Input
                id="estimate"
                type="number"
                value={formData.estimate}
                onChange={(e) => setFormData({ ...formData, estimate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mao">MAO ($)</Label>
              <Input
                id="mao"
                type="number"
                value={formData.mao}
                onChange={(e) => setFormData({ ...formData, mao: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="offerPrice">Offer Price ($)</Label>
              <Input
                id="offerPrice"
                type="number"
                value={formData.offerPrice}
                onChange={(e) => setFormData({ ...formData, offerPrice: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="equity">Equity (%)</Label>
              <Input
                id="equity"
                type="number"
                value={formData.equity}
                onChange={(e) => setFormData({ ...formData, equity: e.target.value })}
              />
            </div>
          </div>

          {formData.leadType === 'Diamond' && (
            <div className="space-y-2">
              <Label htmlFor="callRecording">Call Recording URL</Label>
              <Input
                id="callRecording"
                type="url"
                value={formData.callRecording}
                onChange={(e) => setFormData({ ...formData, callRecording: e.target.value })}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : mode === 'create' ? 'Create Lead' : 'Update Lead'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}

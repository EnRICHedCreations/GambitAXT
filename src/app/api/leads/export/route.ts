import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import Papa from 'papaparse'
import { leadFilterSchema } from '@/lib/validations'
import { Prisma } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const filters = body.filters || {}

    const where: Prisma.LeadWhereInput = {}

    if (filters.type) {
      where.leadType = filters.type
    }

    if (filters.status) {
      where.status = filters.status
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search, mode: 'insensitive' } },
        { address: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    const csvData = leads.map((lead) => ({
      'Lead Type': lead.leadType,
      Name: lead.name,
      Phone: lead.phone || '',
      Email: lead.email || '',
      Address: lead.address || '',
      City: lead.city || '',
      State: lead.state || '',
      'Zip Code': lead.zipCode || '',
      Notes: lead.notes || '',
      'Call Recording': lead.callRecording || '',
      Estimate: lead.estimate ? lead.estimate.toString() : '',
      MAO: lead.mao ? lead.mao.toString() : '',
      'Offer Price': lead.offerPrice ? lead.offerPrice.toString() : '',
      Equity: lead.equity ? lead.equity.toString() : '',
      Status: lead.status,
      'Created At': lead.createdAt.toISOString(),
    }))

    const csv = Papa.unparse(csvData)

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="leads_export_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error('Error exporting leads:', error)
    return NextResponse.json({ error: 'Failed to export leads' }, { status: 500 })
  }
}

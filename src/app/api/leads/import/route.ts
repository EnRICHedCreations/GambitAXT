import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import Papa from 'papaparse'
import { Prisma } from '@prisma/client'
import { parseCurrency } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const leadType = formData.get('leadType') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!leadType || !['Diamond', 'Dollar'].includes(leadType)) {
      return NextResponse.json({ error: 'Invalid lead type' }, { status: 400 })
    }

    const text = await file.text()
    const result = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
    })

    const errors: Array<{ row: number; error: string }> = []
    let successCount = 0
    let duplicateCount = 0

    for (let i = 0; i < result.data.length; i++) {
      const row = result.data[i] as any
      try {
        // Check for duplicate by phone number
        if (row.Phone) {
          const existing = await prisma.lead.findFirst({
            where: { phone: row.Phone },
          })

          if (existing) {
            duplicateCount++
            continue
          }
        }

        const leadData = {
          leadType,
          name: row.Name || 'Unknown',
          phone: row.Phone || null,
          email: row.Email || null,
          address: row.Address || null,
          city: row.City || null,
          state: row.State || null,
          zipCode: row['Zip Code'] || row.ZipCode || null,
          notes: row.Notes || null,
          callRecording: leadType === 'Diamond' ? (row['Call Recording'] || null) : null,
          estimate: row.Estimate ? new Prisma.Decimal(parseCurrency(row.Estimate)) : null,
          mao: row.MAO ? new Prisma.Decimal(parseCurrency(row.MAO)) : null,
          offerPrice: row['Offer Price'] || row.OfferPrice ? new Prisma.Decimal(parseCurrency(row['Offer Price'] || row.OfferPrice)) : null,
          equity: row.Equity ? new Prisma.Decimal(parseCurrency(row.Equity)) : null,
          status: row.Status || 'New',
          importedAt: new Date(),
        }

        const lead = await prisma.lead.create({ data: leadData })

        // Create initial activity
        await prisma.activity.create({
          data: {
            leadId: lead.id,
            activityType: 'note',
            description: 'Lead imported from CSV',
          },
        })

        successCount++
      } catch (error) {
        errors.push({
          row: i + 2, // +2 because of 0-index and header row
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    return NextResponse.json({
      success: successCount,
      errors,
      duplicates: duplicateCount,
    })
  } catch (error) {
    console.error('Error importing CSV:', error)
    return NextResponse.json({ error: 'Failed to import CSV' }, { status: 500 })
  }
}

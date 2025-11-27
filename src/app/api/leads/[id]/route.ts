import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { leadUpdateSchema } from '@/lib/validations'
import { Prisma } from '@prisma/client'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const lead = await prisma.lead.findUnique({
      where: { id },
    })

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    const activities = await prisma.activity.findMany({
      where: { leadId: id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ ...lead, activities })
  } catch (error) {
    console.error('Error fetching lead:', error)
    return NextResponse.json({ error: 'Failed to fetch lead' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const data = leadUpdateSchema.parse(body)

    // Track status change
    const existingLead = await prisma.lead.findUnique({
      where: { id },
    })

    if (!existingLead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    const updateData: any = { ...data }

    // Convert number fields to Decimal
    if (data.estimate !== undefined) {
      updateData.estimate = data.estimate ? new Prisma.Decimal(data.estimate) : null
    }
    if (data.mao !== undefined) {
      updateData.mao = data.mao ? new Prisma.Decimal(data.mao) : null
    }
    if (data.offerPrice !== undefined) {
      updateData.offerPrice = data.offerPrice ? new Prisma.Decimal(data.offerPrice) : null
    }
    if (data.equity !== undefined) {
      updateData.equity = data.equity ? new Prisma.Decimal(data.equity) : null
    }

    const lead = await prisma.lead.update({
      where: { id },
      data: updateData,
    })

    // Create activity if status changed
    if (data.status && data.status !== existingLead.status) {
      await prisma.activity.create({
        data: {
          leadId: id,
          activityType: 'status_change',
          description: `Status changed from ${existingLead.status} to ${data.status}`,
        },
      })
    }

    return NextResponse.json(lead)
  } catch (error) {
    console.error('Error updating lead:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Delete associated activities first
    await prisma.activity.deleteMany({
      where: { leadId: id },
    })

    // Then delete the lead
    await prisma.lead.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting lead:', error)
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { leadSchema, leadFilterSchema } from '@/lib/validations'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const filterData = leadFilterSchema.parse({
      type: searchParams.get('type') || undefined,
      status: searchParams.get('status') || undefined,
      search: searchParams.get('search') || undefined,
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '50',
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: searchParams.get('sortOrder') || 'desc',
    })

    const where: Prisma.LeadWhereInput = {}

    if (filterData.type) {
      where.leadType = filterData.type
    }

    if (filterData.status) {
      where.status = filterData.status
    }

    if (filterData.search) {
      where.OR = [
        { name: { contains: filterData.search, mode: 'insensitive' } },
        { phone: { contains: filterData.search, mode: 'insensitive' } },
        { address: { contains: filterData.search, mode: 'insensitive' } },
        { city: { contains: filterData.search, mode: 'insensitive' } },
        { email: { contains: filterData.search, mode: 'insensitive' } },
      ]
    }

    const skip = (filterData.page - 1) * filterData.limit

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: {
          [filterData.sortBy]: filterData.sortOrder,
        },
        skip,
        take: filterData.limit,
      }),
      prisma.lead.count({ where }),
    ])

    return NextResponse.json({
      leads,
      total,
      page: filterData.page,
      limit: filterData.limit,
      totalPages: Math.ceil(total / filterData.limit),
    })
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = leadSchema.parse(body)

    const lead = await prisma.lead.create({
      data: {
        ...data,
        estimate: data.estimate ? new Prisma.Decimal(data.estimate) : null,
        mao: data.mao ? new Prisma.Decimal(data.mao) : null,
        offerPrice: data.offerPrice ? new Prisma.Decimal(data.offerPrice) : null,
        equity: data.equity ? new Prisma.Decimal(data.equity) : null,
      },
    })

    // Create an activity for the new lead
    await prisma.activity.create({
      data: {
        leadId: lead.id,
        activityType: 'note',
        description: 'Lead created',
      },
    })

    return NextResponse.json(lead, { status: 201 })
  } catch (error) {
    console.error('Error creating lead:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 })
  }
}

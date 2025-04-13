import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// GET /api/fees/categories - Get all fee categories
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const frequency = searchParams.get('frequency');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    
    // Build filter object
    const filter: any = {};
    if (frequency && frequency !== 'All') {
      filter.frequency = frequency;
    }
    
    // Fetch fee categories with filters
    const feeCategories = await prisma.feeCategory.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    
    return NextResponse.json(feeCategories);
  } catch (error) {
    console.error('Error fetching fee categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fee categories' },
      { status: 500 }
    );
  }
}

// POST /api/fees/categories - Create a new fee category
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Only admins can create fee categories.' },
        { status: 401 }
      );
    }
    
    // Get request body
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.amount || !data.frequency) {
      return NextResponse.json(
        { error: 'Missing required fields: name, amount, and frequency are required' },
        { status: 400 }
      );
    }
    
    // Check if fee category with the same name already exists
    const existingCategory = await prisma.feeCategory.findUnique({
      where: { name: data.name },
    });
    
    if (existingCategory) {
      return NextResponse.json(
        { error: 'Fee category with this name already exists' },
        { status: 400 }
      );
    }
    
    // Create new fee category
    const feeCategory = await prisma.feeCategory.create({
      data: {
        name: data.name,
        description: data.description,
        amount: parseFloat(data.amount),
        frequency: data.frequency,
      },
    });
    
    return NextResponse.json(feeCategory, { status: 201 });
  } catch (error) {
    console.error('Error creating fee category:', error);
    return NextResponse.json(
      { error: 'Failed to create fee category' },
      { status: 500 }
    );
  }
}

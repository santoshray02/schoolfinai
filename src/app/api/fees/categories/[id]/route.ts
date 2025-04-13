import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// GET /api/fees/categories/[id] - Get a specific fee category
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = params.id;
    
    // Fetch fee category
    const feeCategory = await prisma.feeCategory.findUnique({
      where: { id },
      include: {
        feePayments: {
          include: {
            student: true,
          },
          orderBy: {
            dueDate: 'desc',
          },
        },
      },
    });
    
    if (!feeCategory) {
      return NextResponse.json(
        { error: 'Fee category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(feeCategory);
  } catch (error) {
    console.error('Error fetching fee category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fee category' },
      { status: 500 }
    );
  }
}

// PUT /api/fees/categories/[id] - Update a fee category
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Only admins can update fee categories.' },
        { status: 401 }
      );
    }

    const id = params.id;
    const data = await request.json();
    
    // Check if fee category exists
    const existingCategory = await prisma.feeCategory.findUnique({
      where: { id },
    });
    
    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Fee category not found' },
        { status: 404 }
      );
    }
    
    // If name is being changed, check if the new name already exists
    if (data.name && data.name !== existingCategory.name) {
      const categoryWithSameName = await prisma.feeCategory.findUnique({
        where: { name: data.name },
      });
      
      if (categoryWithSameName) {
        return NextResponse.json(
          { error: 'Fee category with this name already exists' },
          { status: 400 }
        );
      }
    }
    
    // Update fee category
    const updatedCategory = await prisma.feeCategory.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        amount: data.amount ? parseFloat(data.amount) : undefined,
        frequency: data.frequency,
      },
    });
    
    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('Error updating fee category:', error);
    return NextResponse.json(
      { error: 'Failed to update fee category' },
      { status: 500 }
    );
  }
}

// DELETE /api/fees/categories/[id] - Delete a fee category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Only admins can delete fee categories.' },
        { status: 401 }
      );
    }

    const id = params.id;
    
    // Check if fee category exists
    const existingCategory = await prisma.feeCategory.findUnique({
      where: { id },
      include: {
        feePayments: true,
      },
    });
    
    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Fee category not found' },
        { status: 404 }
      );
    }
    
    // Check if fee category has payments
    if (existingCategory.feePayments.length > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete fee category with associated payments.',
          hasPayments: true
        },
        { status: 400 }
      );
    }
    
    // Delete fee category
    await prisma.feeCategory.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting fee category:', error);
    return NextResponse.json(
      { error: 'Failed to delete fee category' },
      { status: 500 }
    );
  }
}

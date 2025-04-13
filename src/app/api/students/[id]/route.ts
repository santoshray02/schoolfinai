import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// GET /api/students/[id] - Get a specific student
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
    
    // Fetch student with fee payments
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        feePayments: {
          include: {
            feeCategory: true,
          },
          orderBy: {
            dueDate: 'desc',
          },
        },
      },
    });
    
    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    return NextResponse.json(
      { error: 'Failed to fetch student' },
      { status: 500 }
    );
  }
}

// PUT /api/students/[id] - Update a student
export async function PUT(
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
    const data = await request.json();
    
    // Check if student exists
    const existingStudent = await prisma.student.findUnique({
      where: { id },
    });
    
    if (!existingStudent) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }
    
    // If studentId is being changed, check if the new ID already exists
    if (data.studentId && data.studentId !== existingStudent.studentId) {
      const studentWithSameId = await prisma.student.findUnique({
        where: { studentId: data.studentId },
      });
      
      if (studentWithSameId) {
        return NextResponse.json(
          { error: 'Student ID already exists' },
          { status: 400 }
        );
      }
    }
    
    // Update student
    const updatedStudent = await prisma.student.update({
      where: { id },
      data: {
        studentId: data.studentId,
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        gender: data.gender,
        address: data.address,
        contactNumber: data.contactNumber,
        email: data.email,
        parentName: data.parentName,
        parentContact: data.parentContact,
        class: data.class,
        section: data.section,
        admissionDate: data.admissionDate ? new Date(data.admissionDate) : undefined,
        status: data.status,
      },
    });
    
    return NextResponse.json(updatedStudent);
  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json(
      { error: 'Failed to update student' },
      { status: 500 }
    );
  }
}

// DELETE /api/students/[id] - Delete a student
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Only admins can delete students.' },
        { status: 401 }
      );
    }

    const id = params.id;
    
    // Check if student exists
    const existingStudent = await prisma.student.findUnique({
      where: { id },
      include: {
        feePayments: true,
      },
    });
    
    if (!existingStudent) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }
    
    // Check if student has fee payments
    if (existingStudent.feePayments.length > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete student with fee payments. Consider marking as inactive instead.',
          hasFeePayments: true
        },
        { status: 400 }
      );
    }
    
    // Delete student
    await prisma.student.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json(
      { error: 'Failed to delete student' },
      { status: 500 }
    );
  }
}

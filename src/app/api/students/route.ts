import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// GET /api/students - Get all students
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const classFilter = searchParams.get('class');
    const section = searchParams.get('section');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    
    // Build filter object
    const filter: any = {};
    if (status && status !== 'All') {
      filter.status = status;
    }
    if (classFilter) {
      filter.class = classFilter;
    }
    if (section) {
      filter.section = section;
    }
    
    // Fetch students with filters
    const students = await prisma.student.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    
    return NextResponse.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}

// POST /api/students - Create a new student
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get request body
    const data = await request.json();
    
    // Validate required fields
    if (!data.firstName || !data.lastName || !data.studentId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if student ID already exists
    const existingStudent = await prisma.student.findUnique({
      where: { studentId: data.studentId },
    });
    
    if (existingStudent) {
      return NextResponse.json(
        { error: 'Student ID already exists' },
        { status: 400 }
      );
    }
    
    // Create new student
    const student = await prisma.student.create({
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
        admissionDate: data.admissionDate ? new Date(data.admissionDate) : new Date(),
        status: data.status || 'Active',
      },
    });
    
    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    );
  }
}

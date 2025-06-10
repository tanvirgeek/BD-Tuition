import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma-dev';

export async function GET(req: NextRequest) {
  try {
    // Fetch students with pagination
    const students = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
        userInfo: {
          AND: [
            { profileImg: { not: null } },
            { profileImg: { not: '' } },
          ],
        },
      },
      include: {
        userInfo: true, // Include userInfo if needed
      },
    });

    const shuffledStudents = students.sort(() => Math.random() - 0.5).slice(0, 20);

    return NextResponse.json({
      success: true,
      data: shuffledStudents,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while fetching stuents.',
      },
      { status: 500 }
    );
  }
}

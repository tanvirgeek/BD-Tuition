import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma-dev';

export async function GET(req: NextRequest) {
  try {
    // Fetch teachers with pagination
    const teachers = await prisma.user.findMany({
      where: {
        role: 'TEACHER',
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

    const shuffledTeachers = teachers.sort(() => Math.random() - 0.5).slice(0, 20);

    return NextResponse.json({
      success: true,
      data: shuffledTeachers,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while fetching teachers.',
      },
      { status: 500 }
    );
  }
}

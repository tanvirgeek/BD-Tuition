import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma-dev';
import { z } from 'zod';
import { userRegistrationSchema } from '@/lib/schema/schema';
import { Role } from '@prisma/client';
import { stringToEnum } from '@/lib/utils';


export async function POST(req: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await req.json();
    const validatedData = userRegistrationSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { firebaseId: validatedData.firebaseId },
    });
    if (validatedData.isGoogleLogin && existingUser) {
      return NextResponse.json({ message: 'login Successful' }, { status: 200 });
    }

    if (!validatedData.isGoogleLogin && existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // Create a new user
    const user = await prisma.user.create({
      data: {
        firebaseId: validatedData.firebaseId,
        name: validatedData.name,
        role: validatedData.role,
        email: validatedData.email,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Extract query parameters
    const roleParam = searchParams.get("role");
    const district = searchParams.get("district") || "";
    const interestedSubjects = searchParams.getAll("interestedSubjects") || [];
    const upazila = searchParams.get("upazila") || "";

    // Pagination parameters
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    // Convert role string to enum or default to TEACHER
    const role: Role = stringToEnum(Role, roleParam || "") || Role.TEACHER;

    // Determine the expected role
    const expectedRole: Role = role === Role.TEACHER ? Role.STUDENT : Role.TEACHER;

    // Calculate the offset for pagination
    const skip = (page - 1) * limit;

    // First query
    const res = await prisma.user.findMany({
      where: {
        role: expectedRole,
        userInfo: {
          isLookingFor: true,
          district: district,
          upazila: upazila,
          interestedSubjects: {
            hasSome: interestedSubjects,
          },
        },
      },
      include: { userInfo: true },
      skip: skip, // Skip the first N records
      take: limit, // Limit the number of records to fetch
    });

    if (!res || res.length === 0) {
      return NextResponse.json({ data: [], message: 'No more users available' }, {status: 200});
  }


    // Remove `undefined` values using a replacer function in JSON.stringify
    const cleanRes = JSON.parse(
      JSON.stringify(res, (key, value) => (value === undefined ? null : value))
    );

    return NextResponse.json(
      {
        data: cleanRes,
        pagination: {
          currentPage: page,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in get users", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


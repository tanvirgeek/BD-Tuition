import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      role,
      firebaseId,
      location,
      district,
      mobileNumber,
      institution,
      department,
      year,
      userClass,
      experience,
      dateOfBirth,
      gender,
      description,
      isLookingFor,
      interestedSubjects,
      institutionName,
      profileImg,
      upazila
    } = body;

    // Validate the required fields
    if (!firebaseId) {
      return NextResponse.json(
        { error: "firebaseId is required" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { firebaseId }, // Match the unique firebaseId
      data: {
        name,
        role, // Fields to update
      },
    });

    // Upsert the UserInfo (update if exists, create if not)
    const upsertedUserInfo = await prisma.userInfo.upsert({
      where: { firebaseId },
      update: {
        location,
        district,
        mobileNumber,
        institution,
        department,
        year,
        userClass,
        experience,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        gender,
        description,
        isLookingFor,
        interestedSubjects,
        institutionName,
        profileImg,
        upazila

      },
      create: {
        firebaseId,
        location,
        district,
        mobileNumber,
        institution,
        department,
        year,
        userClass,
        experience,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : "",
        gender,
        description,
        isLookingFor,
        interestedSubjects,
        institutionName,
        profileImg,
        upazila
      },
    });

    return NextResponse.json({...upsertedUserInfo, ...updatedUser}, { status: 200 });
  } catch (error: any) {
    console.error("Error updating UserInfo:", error.message);
    return NextResponse.json(
      { error: "An error occurred while updating user info" },
      { status: 500 }
    );
  }
}

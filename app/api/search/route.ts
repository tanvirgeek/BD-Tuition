import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma-dev";

export async function POST(req: NextRequest) {
  try {
    const { name, district, gender, interestedSubjects, institutionName, upazila, role, page = 1, limit = 2 } = await req.json();

    if (!role) {
      return NextResponse.json({ error: "Role is required" }, { status: 400 });
    }

    const skip = (page - 1) * limit;

    let filters: any = {
      role,
      userInfo: {
        isLookingFor: true,
      },
    };

    if (name) {
      filters.name = {
        contains: name,
        mode: "insensitive",
      };
    }

    if (institutionName) {
      filters.userInfo = {
        ...filters.userInfo,
        institutionName: {
          contains: institutionName,
          mode: "insensitive",
        },
      };
    }

    if (district) {
      filters.userInfo = {
        ...filters.userInfo,
        district: {
          contains: district,
          mode: "insensitive",
        },
      };
    }

    if (gender) {
      filters.userInfo = {
        ...filters.userInfo,
        gender: {
          equals: gender,
        },
      };
    }

    if (upazila) {
      filters.userInfo = {
        ...filters.userInfo,
        upazila: {
          contains: upazila,
          mode: "insensitive",
        },
      };
    }

    if (interestedSubjects && interestedSubjects.length > 0) {
      filters.userInfo = {
        ...filters.userInfo,
        interestedSubjects: {
          hasSome: interestedSubjects,
        },
      };
    }

    console.log(filters);

    const users = await prisma.user.findMany({
      where: filters,
      include: {
        userInfo: true,
      },
      skip,
      take: limit,
    });

    console.log("res:", users);

    return NextResponse.json({
      data: users,
    });
  } catch (error) {
    console.error("Error in search API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
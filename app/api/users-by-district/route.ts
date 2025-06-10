import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma-dev';
import { stringToEnum } from "@/lib/utils";

export async function GET(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
  
      // Extract query parameters
      const roleParam = searchParams.get("role");
      const district = searchParams.get("district") || "";
  
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
          },
        },
        include: { userInfo: true },
        skip, // Skip the first N records
        take: limit, // Limit the number of records to fetch
      });
    
  
      if (!res || res.length === 0) {
        return NextResponse.json({ error: "No data found" }, { status: 404 });
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
  
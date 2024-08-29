import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const {
      name,
      email,
      phone,
      role,
      employmentType,
      salary,
      status,
      startDate,
      endDate,
    } = await request.json();

    if (!name || !role || !employmentType || !status || !startDate) {
      return NextResponse.json(
        {
          error:
            "Name, role, employment type, status, and start date are required",
        },
        { status: 400 }
      );
    }

    const employee = await prisma.employee.create({
      data: {
        name,
        email: email || null, 
        phone: phone || null, 
        role,
        employmentType,
        salary: salary || null, 
        status,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null, 
      },
    });

    return NextResponse.json(employee);
  } catch (error) {
    console.error("Failed to create employee:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

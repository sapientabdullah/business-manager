import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();
    if (!email || !name) {
      return NextResponse.json(
        { error: "Email and name are required" },
        { status: 400 }
      );
    }
    const user = await prisma.user.create({
      data: {
        email,
        name,
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error adding user", error);
    return NextResponse.json({ error: "Error adding user" }, { status: 500 });
  }
}

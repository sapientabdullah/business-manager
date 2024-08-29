import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const {
      name,
      unitCost,
      quantity,
    }: { name: string; unitCost: number; quantity: number } =
      await request.json();

    if (!name || unitCost == null || quantity == null) {
      return NextResponse.json(
        { error: "Name, unit cost, and quantity are required" },
        { status: 400 }
      );
    }

    const inventory = await prisma.inventory.create({
      data: {
        name,
        quantity,
        unitCost,
      },
    });

    return NextResponse.json(inventory, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

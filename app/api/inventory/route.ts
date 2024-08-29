import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const inventoryItems = await prisma.inventory.findMany();
    return new Response(JSON.stringify(inventoryItems), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "An error occurred while fetching inventory items",
      }),
      {
        status: 500,
      }
    );
  }
}

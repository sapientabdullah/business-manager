import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { customerId, inventoryId, quantity } = await req.json();

    if (!customerId || !inventoryId || quantity <= 0) {
      return new Response(JSON.stringify({ error: "Invalid input data" }), {
        status: 400,
      });
    }

    // Create the purchase
    const newPurchase = await prisma.purchase.create({
      data: {
        customerId,
        inventoryId,
        quantity,
      },
    });

    return new Response(JSON.stringify(newPurchase), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error creating purchase:", error.message);
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred" }),
      {
        status: 500,
      }
    );
  }
}

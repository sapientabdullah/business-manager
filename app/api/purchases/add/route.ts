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

    // Retrieve the inventory item
    const inventoryItem = await prisma.inventory.findUnique({
      where: { id: inventoryId },
    });

    if (!inventoryItem) {
      return new Response(
        JSON.stringify({ error: "Inventory item not found" }),
        {
          status: 404,
        }
      );
    }

    // Check if there is enough quantity in stock
    if (inventoryItem.quantity < quantity) {
      return new Response(
        JSON.stringify({ error: "Not enough stock available" }),
        {
          status: 400,
        }
      );
    }

    // Update the inventory quantity
    const updatedInventory = await prisma.inventory.update({
      where: { id: inventoryId },
      data: { quantity: inventoryItem.quantity - quantity },
    });

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

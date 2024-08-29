import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      postalCode,
      country,
      isRegular,
      inventoryId,
      quantity,
    } = await req.json();

    if (!firstName || !lastName || !inventoryId || quantity <= 0) {
      return new Response(JSON.stringify({ error: "Invalid input data" }), {
        status: 400,
      });
    }

    let customer = await prisma.customer.findFirst({
      where: {
        OR: [{ email: email ?? undefined }, { phone: phone ?? undefined }],
      },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          firstName,
          lastName,
          email,
          phone,
          address,
          city,
          state,
          postalCode,
          country,
          isRegular,
        },
      });
    }

    const newPurchase = await prisma.purchase.create({
      data: {
        customerId: customer.id,
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

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
    } = await req.json();

    if (!firstName || !lastName) {
      return new Response(
        JSON.stringify({ error: "First name and last name are required" }),
        {
          status: 400,
        }
      );
    }

    const existingCustomer = await prisma.customer.findFirst({
      where: {
        OR: [{ email: email ?? undefined }, { phone: phone ?? undefined }],
      },
    });

    if (existingCustomer) {
      return new Response(
        JSON.stringify({ error: "Customer already exists" }),
        {
          status: 400,
        }
      );
    }

    const newCustomer = await prisma.customer.create({
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

    return new Response(JSON.stringify(newCustomer), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error creating customer:", error.message);
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred" }),
      {
        status: 500,
      }
    );
  }
}

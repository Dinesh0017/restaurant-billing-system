import { prisma } from "@/lib/prisma";
import { generateBillNumber } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const bills = await prisma.bill.findMany({
      orderBy: { createdAt: "desc" },
    });

    const formatted = bills.map((bill: any) => ({
      ...bill,
      total: Number(bill.total),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("BILLS GET ERROR:", error);
    return NextResponse.json(
      { message: "Failed to fetch bills" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, customerEmail, customerPhone, items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: "Bill items are required" },
        { status: 400 },
      );
    }

    const result = await prisma.$transaction(async (tx: any) => {
      let total = 0;

      for (const cartItem of items) {
        const dbItem = await tx.item.findUnique({
          where: { id: cartItem.itemId },
        });

        if (!dbItem) {
          throw new Error(`Item not found: ${cartItem.name}`);
        }

        if (dbItem.stockQty < cartItem.quantity) {
          throw new Error(`Not enough stock for ${dbItem.name}`);
        }

        total += Number(dbItem.price) * cartItem.quantity;
      }

      const bill = await tx.bill.create({
        data: {
          billNumber: generateBillNumber(),
          customerName: customerName || null,
          customerEmail: customerEmail || null,
          customerPhone: customerPhone || null,
          total,
        },
      });

      for (const cartItem of items) {
        const dbItem = await tx.item.findUnique({
          where: { id: cartItem.itemId },
        });

        if (!dbItem) continue;

        await tx.billItem.create({
          data: {
            billId: bill.id,
            itemId: dbItem.id,
            quantity: cartItem.quantity,
            unitPrice: dbItem.price,
            lineTotal: Number(dbItem.price) * cartItem.quantity,
          },
        });

        await tx.item.update({
          where: { id: dbItem.id },
          data: {
            stockQty: dbItem.stockQty - cartItem.quantity,
          },
        });
      }

      return bill;
    });

    return NextResponse.json(
      {
        ...result,
        total: Number(result.total),
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("BILLS POST ERROR:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create bill" },
      { status: 500 },
    );
  }
}

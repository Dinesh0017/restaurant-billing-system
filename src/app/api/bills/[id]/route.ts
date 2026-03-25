import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const bill = await prisma.bill.findUnique({
      where: { id: Number(id) },
      include: {
        items: {
          include: {
            item: true,
          },
        },
      },
    });

    if (!bill) {
      return NextResponse.json({ message: "Bill not found" }, { status: 404 });
    }

    const formatted = {
      ...bill,
      total: Number(bill.total),
      items: bill.items.map((item:any) => ({
        ...item,
        unitPrice: Number(item.unitPrice),
        lineTotal: Number(item.lineTotal),
      })),
    };

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("BILL GET BY ID ERROR:", error);
    return NextResponse.json(
      { message: "Failed to fetch bill" },
      { status: 500 }
    );
  }
}
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const totalCategories = await prisma.category.count();
    const totalItems = await prisma.item.count();
    const totalBills = await prisma.bill.count();

    const stockAgg = await prisma.item.aggregate({
      _sum: {
        stockQty: true,
      },
    });

    const revenueAgg = await prisma.bill.aggregate({
      _sum: {
        total: true,
      },
    });

    return NextResponse.json({
      totalCategories,
      totalItems,
      totalStock: stockAgg._sum.stockQty ?? 0,
      totalBills,
      totalRevenue: Number(revenueAgg._sum.total ?? 0),
    });
  } catch (error) {
    console.error("STATS ERROR:", error);
    return NextResponse.json(
      { message: "Failed to load stats" },
      { status: 500 }
    );
  }
}
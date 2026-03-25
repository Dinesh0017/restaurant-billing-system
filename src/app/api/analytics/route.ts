import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type RangeType =
  | "today"
  | "last7days"
  | "weekly"
  | "monthly"
  | "yearly"
  | "custom";

function getDateRange(range: RangeType, start?: string | null, end?: string | null) {
  const now = new Date();
  let startDate = new Date();
  let endDate = new Date();

  if (range === "today") {
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  }

  if (range === "last7days") {
    startDate = new Date();
    startDate.setDate(now.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);

    endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
  }

  if (range === "weekly") {
    const day = now.getDay();
    const diff = day === 0 ? 6 : day - 1;

    startDate = new Date(now);
    startDate.setDate(now.getDate() - diff);
    startDate.setHours(0, 0, 0, 0);

    endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);
  }

  if (range === "monthly") {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  }

  if (range === "yearly") {
    startDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
    endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
  }

  if (range === "custom" && start && end) {
    startDate = new Date(start);
    startDate.setHours(0, 0, 0, 0);

    endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);
  }

  return { startDate, endDate };
}

function formatLabel(date: Date, range: RangeType) {
  if (range === "yearly") {
    return date.toLocaleString("en-US", { month: "short" });
  }

  if (range === "today") {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const range = (searchParams.get("range") || "today") as RangeType;
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    const { startDate, endDate } = getDateRange(range, start, end);

    const bills = await prisma.bill.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        items: {
          include: {
            item: {
              include: {
                category: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const totalRevenue = bills.reduce((sum:any, bill:any) => sum + Number(bill.total), 0);
    const totalBills = bills.length;

    let totalItemsSold = 0;
    for (const bill of bills) {
      for (const item of bill.items) {
        totalItemsSold += item.quantity;
      }
    }

    const averageBill = totalBills > 0 ? totalRevenue / totalBills : 0;

    const salesTrendMap = new Map<string, number>();

    for (const bill of bills) {
      const date = new Date(bill.createdAt);
      let key = "";

      if (range === "yearly") {
        key = date.toLocaleString("en-US", { month: "short" });
      } else if (range === "today") {
        key = date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
      } else {
        key = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }

      salesTrendMap.set(key, (salesTrendMap.get(key) || 0) + Number(bill.total));
    }

    const salesTrend = Array.from(salesTrendMap.entries()).map(([label, sales]) => ({
      label,
      sales,
    }));

    const categoryMap = new Map<string, number>();

    for (const bill of bills) {
      for (const item of bill.items) {
        const categoryName = item.item.category.name;
        const lineTotal = Number(item.lineTotal);

        categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + lineTotal);
      }
    }

    const categoryBreakdown = Array.from(categoryMap.entries()).map(([name, value]) => ({
      name,
      value,
    }));

    const itemMap = new Map<string, { qty: number; revenue: number }>();

    for (const bill of bills) {
      for (const item of bill.items) {
        const itemName = item.item.name;
        const current = itemMap.get(itemName) || { qty: 0, revenue: 0 };

        current.qty += item.quantity;
        current.revenue += Number(item.lineTotal);

        itemMap.set(itemName, current);
      }
    }

    const topItems = Array.from(itemMap.entries())
      .map(([name, value]) => ({
        name,
        qty: value.qty,
        revenue: value.revenue,
      }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 10);

    return NextResponse.json({
      range,
      startDate,
      endDate,
      summary: {
        totalRevenue,
        totalBills,
        totalItemsSold,
        averageBill,
      },
      salesTrend,
      categoryBreakdown,
      topItems,
    });
  } catch (error) {
    console.error("ANALYTICS GET ERROR:", error);
    return NextResponse.json(
      { message: "Failed to load analytics" },
      { status: 500 }
    );
  }
}
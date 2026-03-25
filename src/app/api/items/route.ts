import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const items = await prisma.item.findMany({
      include: {
        category: true,
      },
      orderBy: { id: "desc" },
    });

    const formatted = items.map((item:any) => ({
      ...item,
      price: Number(item.price),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("ITEMS GET ERROR:", error);
    return NextResponse.json(
      { message: "Failed to fetch items" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, price, stockQty, categoryId, imageUrl } = body;

    if (!name || price === undefined || stockQty === undefined || !categoryId) {
      return NextResponse.json(
        { message: "Name, price, stock and category are required" },
        { status: 400 }
      );
    }

    const item = await prisma.item.create({
      data: {
        name,
        price,
        stockQty,
        categoryId,
        imageUrl: imageUrl || null,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(
      {
        ...item,
        price: Number(item.price),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("ITEMS POST ERROR:", error);
    return NextResponse.json(
      { message: "Failed to create item" },
      { status: 500 }
    );
  }
}
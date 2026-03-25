import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.item.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Item deleted" });
  } catch (error) {
    console.error("ITEM DELETE ERROR:", error);
    return NextResponse.json(
      { message: "Failed to delete item" },
      { status: 500 }
    );
  }
}
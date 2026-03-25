import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { billId } = body;

    if (!billId) {
      return NextResponse.json(
        { message: "Bill ID is required" },
        { status: 400 }
      );
    }

    const bill = await prisma.bill.findUnique({
      where: { id: Number(billId) },
      include: {
        items: {
          include: {
            item: true,
          },
        },
      },
    });

    if (!bill) {
      return NextResponse.json(
        { message: "Bill not found" },
        { status: 404 }
      );
    }

    if (
      !bill.customerName?.trim() ||
      !bill.customerEmail?.trim() ||
      !bill.customerPhone?.trim()
    ) {
      return NextResponse.json(
        { message: "Customer name, email and phone are required" },
        { status: 400 }
      );
    }

    const rows = bill.items
      .map(
        (row:any) => `
          <tr>
            <td style="padding:8px;border:1px solid #ddd;">${row.item.name}</td>
            <td style="padding:8px;border:1px solid #ddd;">${row.quantity}</td>
            <td style="padding:8px;border:1px solid #ddd;">LKR ${Number(row.unitPrice).toFixed(2)}</td>
            <td style="padding:8px;border:1px solid #ddd;">LKR ${Number(row.lineTotal).toFixed(2)}</td>
          </tr>
        `
      )
      .join("");

    const html = `
      <div style="font-family: Arial, sans-serif;">
        <h2>Restaurant Bill</h2>
        <p><strong>Bill No:</strong> ${bill.billNumber}</p>
        <p><strong>Customer:</strong> ${bill.customerName}</p>
        <p><strong>Email:</strong> ${bill.customerEmail}</p>
        <p><strong>Phone:</strong> ${bill.customerPhone}</p>
        <p><strong>Date:</strong> ${new Date(bill.createdAt).toLocaleString()}</p>

        <table style="border-collapse:collapse;width:100%;margin-top:16px;">
          <thead>
            <tr>
              <th style="border:1px solid #ddd;padding:8px;">Item</th>
              <th style="border:1px solid #ddd;padding:8px;">Qty</th>
              <th style="border:1px solid #ddd;padding:8px;">Unit Price</th>
              <th style="border:1px solid #ddd;padding:8px;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>

        <h3 style="margin-top:20px;">
          Grand Total: LKR ${Number(bill.total).toFixed(2)}
        </h3>

        <p>Thank you for visiting us!</p>
      </div>
    `;

    const data = await resend.emails.send({
      from: "Restaurant Billing <onboarding@resend.dev>",
      to: bill.customerEmail,
      subject: `Your Bill - ${bill.billNumber}`,
      html,
    });

    return NextResponse.json({
      message: "Bill sent successfully",
      data,
    });
  } catch (error) {
    console.error("SEND BILL ERROR:", error);
    return NextResponse.json(
      { message: "Failed to send bill" },
      { status: 500 }
    );
  }
}
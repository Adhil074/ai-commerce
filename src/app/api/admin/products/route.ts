import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const body = await req.json();

  const { name, price, stock, imageUrl, description } = body;

  if (!name || !price || !stock || !imageUrl || !description) {
    return NextResponse.json(
      { error: "Missing fields" },
      { status: 400 },
    );
  }

  await prisma.product.create({
    data: {
      name,
      price,
      stock,
      imageUrl,
      description,
    },
  });

  return NextResponse.json({ success: true });
}
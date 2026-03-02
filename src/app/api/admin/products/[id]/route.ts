import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    const {id}=await context.params;

    const body = await request.json();

    const { name, price, stock, imageUrl, description } = body;

    if (!name || !price || stock === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        price: Number(price),
        stock: Number(stock),
        imageUrl: imageUrl || null,
        description: description || "",
      },
    });

    return NextResponse.json(updatedProduct);
  } catch  {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    const {id}=await context.params;

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch  {
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}
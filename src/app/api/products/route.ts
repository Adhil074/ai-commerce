import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") ?? "1");
    const limit = Number(searchParams.get("limit") ?? "10");

    if (page < 1 || limit < 1) {
      return NextResponse.json(
        { error: "Invalid pagination values" },
        { status: 400 },
      );
    }

    const skip = (page - 1) * limit;

    const products = await prisma.product.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        imageUrl: true,
        createdAt: true,
      },
    });

    const total = await prisma.product.count();

    return NextResponse.json(
      {
        data: products,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET /api/products error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, description, price, stock, imageUrl } = body as {
      name?: string;
      description?: string;
      price?: number;
      stock?: number;
      imageUrl?: string;
    };

    // Basic validation
    if (
      !name ||
      !description ||
      typeof price !== "number" ||
      typeof stock !== "number"
    ) {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 },
      );
    }

    if (price < 0 || stock < 0) {
      return NextResponse.json(
        { error: "Price and stock must be positive numbers" },
        { status: 400 },
      );
    }

    // Temporary admin simulation (real auth comes later)
    const isAdmin = true;

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        imageUrl: imageUrl ?? null,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        imageUrl: true,
        createdAt: true,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

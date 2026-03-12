//app\api\wishlist\route.ts

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const items = await prisma.wishlist.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      productId: true,
    },
  });

  return NextResponse.json(items);
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId } = body as { productId?: string };

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID required" },
        { status: 400 }
      );
    }

    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId: session.user.id,
        productId,
      },
    });

    return NextResponse.json(wishlistItem);
  } catch {
    return NextResponse.json(
      { error: "Failed to add wishlist" },
      { status: 500 }
    );
  }
}
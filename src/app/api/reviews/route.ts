import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { updateProductIntelligence } from "@/lib/review-intelligence";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const { productId, rating, comment } = body as {
      productId?: string;
      rating?: number;
      comment?: string;
    };

    if (!productId || rating === undefined || !comment) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
    }

    await prisma.review.create({
      data: {
        productId,
        userId: session.user.id,
        rating,
        comment,
      },
    });

    await updateProductIntelligence(productId);

    return NextResponse.json({ message: "Review added" }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

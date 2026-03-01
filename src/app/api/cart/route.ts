//ai-commerce\src\app\api\cart\route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            imageUrl: true,
            stock: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        data: cartItems,
        totalItems: cartItems.length,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET /api/cart error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { productId, quantity } = body as {
      productId?: string;
      quantity?: number;
    };

    if (!productId || !quantity || quantity <= 0) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.stock < quantity) {
      return Response.json({ error: "Not enough stock" }, { status: 400 });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userId: session.user.id,
        productId,
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity > product.stock) {
        return Response.json({ error: "Exceeds stock limit" }, { status: 400 });
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          userId: session.user.id,
          productId,
          quantity,
        },
      });
    }

    return Response.json({ message: "Added to cart" }, { status: 200 });
  } catch (error) {
    console.error("POST /api/cart error:", error);

    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { cartItemId, quantity } = body as {
      cartItemId?: string;
      quantity?: number;
    };

    if (!cartItemId || !quantity || quantity <= 0) {
      return Response.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { product: true },
    });

    if (!cartItem || cartItem.userId !== session.user.id) {
      return Response.json(
        { error: "Not found" },
        { status: 404 }
      );
    }

    if (quantity > cartItem.product.stock) {
      return Response.json(
        { error: "Exceeds stock" },
        { status: 400 }
      );
    }

    await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });

    return Response.json(
      { message: "Cart updated" },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH /api/cart error:", error);

    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { cartItemId } = body as {
      cartItemId?: string;
    };

    if (!cartItemId) {
      return Response.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });

    if (!cartItem || cartItem.userId !== session.user.id) {
      return Response.json(
        { error: "Not found" },
        { status: 404 }
      );
    }

    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    return Response.json(
      { message: "Item removed" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/cart error:", error);

    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
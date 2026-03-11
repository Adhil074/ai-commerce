import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const total = cartItems.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);
    const userId = session.user.id as string;
    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          userId,
          total,
          status: "PENDING",
        },
      });

      await tx.orderItem.createMany({
        data: cartItems.map((item) => ({
          orderId: createdOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        })),
      });

      return createdOrder;
    });

    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: Math.round(total * 100),
        currency: "usd",
        metadata: {
          userId,
          orderId: order.id,
        },
      },
      {
        idempotencyKey: order.id,
      },
    );

    return NextResponse.json(
      { clientSecret: paymentIntent.client_secret },
      { status: 200 },
    );
  } catch (error) {
    console.error("Create payment intent error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// //src\app\api\admin\orders\[id]\route.ts

// import { NextResponse } from "next/server";
// import { auth } from "@/auth";
// import { prisma } from "@/lib/prisma";
// import { OrderStatus } from "@prisma/client";

// interface RouteContext {
//   params: Promise<{
//     id: string;
//   }>;
// }

// export async function PATCH(request: Request, context: RouteContext) {
//   try {
//     const session = await auth();

//     if (!session || session.user.role !== "ADMIN") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { id } = await context.params;
//     const body = await request.json();
//     const { status } = body as { status?: OrderStatus };

//     if (!status) {
//       return NextResponse.json({ error: "Status required" }, { status: 400 });
//     }

//     // Validate enum strictly
//     if (!Object.values(OrderStatus).includes(status)) {
//       return NextResponse.json(
//         { error: "Invalid status value" },
//         { status: 400 },
//       );
//     }

//     const updatedOrder = await prisma.order.update({
//       where: { id },
//       data: { status },
//     });

//     return NextResponse.json(updatedOrder);
//   } catch {
//     return NextResponse.json({ error: "Update failed" }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["PAID", "FAILED", "CANCELLED"],
  PAID: ["SHIPPED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  FAILED: [],
  CANCELLED: [],
};

export async function PATCH(
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

    const { id } = await context.params;
    const body = await request.json();
    const { status } = body as { status?: OrderStatus };

    if (!status || !Object.values(OrderStatus).includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    const existingOrder = await prisma.order.findUnique({
      where: { id },
      select: { status: true },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    const currentStatus = existingOrder.status;

    if (!allowedTransitions[currentStatus].includes(status)) {
      return NextResponse.json(
        { error: `Cannot change status from ${currentStatus} to ${status}` },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedOrder);
  } catch {
    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}

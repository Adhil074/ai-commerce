// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const pool = new Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomBool(): boolean {
  return Math.random() > 0.5;
}

const sampleComments = [
  "Very comfortable and worth the price",
  "Good quality but slightly expensive",
  "Not what I expected",
  "Perfect for daily use",
  "Build quality is solid",
  "Size runs slightly small",
  "Very durable and stable",
  "Would recommend to others",
  "Back support is excellent",
  "Packaging was damaged but product fine",
];

async function main(): Promise<void> {
  await prisma.review.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  const users = await Promise.all(
    Array.from({ length: 5 }).map((_, i) =>
      prisma.user.create({
        data: {
          email: `user${i + 1}@example.com`,
          password: "password123",
          role: "USER",
        },
      }),
    ),
  );

  const productNames = [
    "Ergonomic Standing Desk",
    "Orthopedic Office Chair",
    "Minimal Study Table",
    "Gaming Chair Pro",
    "Compact Laptop Desk",
    "Executive Office Desk",
    "Wooden Bookshelf",
    "Adjustable Monitor Stand",
  ];

  for (const name of productNames) {
    const product = await prisma.product.create({
      data: {
        name,
        description: `${name} designed for comfort and durability.`,
        price: randomInt(100, 500),
        stock: randomInt(10, 50),
        imageUrl: "https://via.placeholder.com/300",
      },
    });

    const reviewsData = [];

    for (let i = 0; i < 50; i++) {
      const randomUser = users[randomInt(0, users.length - 1)];

      reviewsData.push({
        rating: randomInt(1, 5),
        comment: sampleComments[randomInt(0, sampleComments.length - 1)],
        verified: randomBool(),
        helpful: randomInt(0, 25),
        userId: randomUser.id,
        productId: product.id,
      });
    }

    await prisma.review.createMany({
      data: reviewsData,
    });
  }

  console.log("Advanced seeding completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

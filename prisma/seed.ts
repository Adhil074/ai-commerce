//prisma\seed.ts

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcrypt";
import { computeReviewIntelligence } from "@/lib/review-intelligence";

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

async function main(): Promise<void> {
  await prisma.review.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: await bcrypt.hash("admin123", 10),
      role: "ADMIN",
    },
  });

  const users = await Promise.all(
    Array.from({ length: 5 }).map(async (_, i) =>
      prisma.user.create({
        data: {
          email: `user${i + 1}@example.com`,
          password: await bcrypt.hash("password123", 10),
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
    "Wireless Bluetooth Headphones",
    "Smart Fitness Watch",
    "Stainless Steel Water Bottle",
    "LED Desk Lamp",
  ];

  const imageMap: Record<string, string> = {
    "Ergonomic Standing Desk": "/products/desk.jpg",
    "Orthopedic Office Chair": "/products/chair.jpg",
    "Minimal Study Table": "/products/table.jpg",
    "Gaming Chair Pro": "/products/gaming-chair.jpg",
    "Wireless Bluetooth Headphones": "/products/headphones.jpg",
    "Smart Fitness Watch": "/products/watch.jpg",
    "Stainless Steel Water Bottle": "/products/bottle.jpg",
    "LED Desk Lamp": "/products/lamp.jpg",
  };

  type ProductProfile = {
    minRating: number;
    maxRating: number;
    comfortBias: number; // 0 to 1 probability
    durabilityBias: number;
    sizeBias: number;
  };

  const productProfiles: Record<string, ProductProfile> = {
    "Orthopedic Office Chair": {
      minRating: 4,
      maxRating: 5,
      comfortBias: 0.7,
      durabilityBias: 0.2,
      sizeBias: 0.1,
    },
    "Gaming Chair Pro": {
      minRating: 3,
      maxRating: 4,
      comfortBias: 0.5,
      durabilityBias: 0.3,
      sizeBias: 0.2,
    },
    "Smart Fitness Watch": {
      minRating: 3,
      maxRating: 4,
      comfortBias: 0.1,
      durabilityBias: 0.2,
      sizeBias: 0.05,
    },
    "Ergonomic Standing Desk": {
      minRating: 4,
      maxRating: 5,
      comfortBias: 0.4,
      durabilityBias: 0.1,
      sizeBias: 0.1,
    },
  };

  for (const name of productNames) {
    const product = await prisma.product.create({
      data: {
        name,
        description: `${name} designed for comfort and durability.`,
        price: randomInt(100, 500),
        stock: randomInt(10, 50),
        imageUrl: imageMap[name],
      },
    });

    await prisma.productImage.createMany({
      data: [
        { url: imageMap[name], productId: product.id },
        { url: imageMap[name].replace(".jpg", "1.jpg"), productId: product.id },
        { url: imageMap[name].replace(".jpg", "2.jpg"), productId: product.id },
      ],
    });

    const reviewsData = [];

    for (let i = 0; i < 50; i++) {
      const profile = productProfiles[name] ?? {
        minRating: 3,
        maxRating: 4,
        comfortBias: 0.2,
        durabilityBias: 0.2,
        sizeBias: 0.1,
      };

      const rating = randomInt(profile.minRating, profile.maxRating);

      let comment = "Good product overall.";

      const randomValue = Math.random();

      if (randomValue < profile.comfortBias) {
        comment = "Very comfortable and great back support.";
      } else if (randomValue < profile.comfortBias + profile.durabilityBias) {
        comment = "Build quality feels weak and slightly damaged.";
      } else if (
        randomValue <
        profile.comfortBias + profile.durabilityBias + profile.sizeBias
      ) {
        comment = "Size runs small and fit is tight.";
      }

      const randomUser = users[randomInt(0, users.length - 1)];

      reviewsData.push({
        rating,
        comment,
        verified: randomBool(),
        helpful: randomInt(0, 25),
        userId: randomUser.id,
        productId: product.id,
      });
    }

    await prisma.review.createMany({
      data: reviewsData,
    });

    const reviews = await prisma.review.findMany({
      where: { productId: product.id },
      select: {
        rating: true,
        comment: true,
      },
    });

    const intelligence = computeReviewIntelligence(reviews);

    await prisma.product.update({
      where: { id: product.id },
      data: {
        averageRating: intelligence.averageRating,
        positivePercent: intelligence.positivePercent,
        sizeComplaintPct: intelligence.sizeComplaintPct,
        durabilityPct: intelligence.durabilityPct,
        comfortMentionPct: intelligence.comfortMentionPct,
        returnRiskPct: intelligence.returnRiskPct,
      },
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

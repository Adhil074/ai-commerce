export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";
import { detectDoubtType } from "@/lib/doubt-detector";

type RateLimitEntry = {
  count: number;
  expiresAt: number;
};

const rateLimitMap = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5; // 5 requests per minute per user

interface RequestBody {
  productId?: string;
  doubt?: string;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    const ip = req.headers.get("x-forwarded-for") ?? "unknown-ip";

    const now = Date.now();
    const existing = rateLimitMap.get(ip);

    if (existing && existing.expiresAt > now) {
      if (existing.count >= MAX_REQUESTS) {
        return NextResponse.json(
          { error: "Too many requests. Please wait a minute." },
          { status: 429 },
        );
      }

      existing.count += 1;
    } else {
      rateLimitMap.set(ip, {
        count: 1,
        expiresAt: now + WINDOW_MS,
      });
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing Gemini API key" },
        { status: 500 },
      );
    }

    const body = (await req.json()) as RequestBody;

    const { productId, doubt } = body;

    if (!productId || !doubt) {
      return NextResponse.json(
        { error: "productId and doubt required" },
        { status: 400 },
      );
    }

    if (doubt.length > 250) {
      return NextResponse.json({ error: "Input too long" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        name: true,
        averageRating: true,
        positivePercent: true,
        sizeComplaintPct: true,
        durabilityPct: true,
        comfortMentionPct: true,
        returnRiskPct: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const doubtType = detectDoubtType(doubt);

    let relevantStats = "";

    switch (doubtType) {
      case "size":
        relevantStats = `Size complaints: ${product.sizeComplaintPct}%`;
        break;

      case "durability":
        relevantStats = `Durability complaints: ${product.durabilityPct}%`;
        break;

      case "regret":
        relevantStats = `Return risk rate: ${product.returnRiskPct}%`;
        break;

      case "value":
        relevantStats = `Positive reviews: ${product.positivePercent}% | Average rating: ${product.averageRating}`;
        break;

      case "comfort":
        relevantStats = `Comfort mentions: ${product.comfortMentionPct}%`;
        break;

      default:
        relevantStats = `
Average rating: ${product.averageRating}
Positive reviews: ${product.positivePercent}%
Return risk: ${product.returnRiskPct}%
        `;
    }

    const structuredPrompt = `
Product: ${product.name}
User Concern: ${doubt}
Concern Type: ${doubtType}
Relevant Data:
${relevantStats}

Answer clearly in under 100 words.
Use only the provided data.
Do not invent anything.
Be honest.
`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const aiPromise = model.generateContent(structuredPrompt);

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error("AI timeout"));
      }, 15000);
    });

    const result = await Promise.race([aiPromise, timeoutPromise]);

    const response = await (result as Awaited<typeof aiPromise>).response;
    const text = response.text();

    return NextResponse.json({
      concernType: doubtType,
      answer: text,
    });
  } catch (error) {
    console.error("Doubt resolver error:", error);

    return NextResponse.json(
      {
        error:
          "AI service is temporarily unavailable. Please try again in a moment.",
      },
      { status: 500 },
    );
  }
}

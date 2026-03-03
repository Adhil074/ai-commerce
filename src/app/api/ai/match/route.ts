export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";
import { computeMatchScore } from "@/lib/product-match";

type CachedResult = {
  score: number;
  reasons: string[];
  explanation: string;
  expiresAt: number;
};

const matchCache = new Map<string, CachedResult>();

const CACHE_TTL_MS = 30 * 60 * 1000; 

interface RequestBody {
  productId?: string;
  userNeeds?: string;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing Gemini API key" },
        { status: 500 },
      );
    }

    const body = (await req.json()) as RequestBody;

    const { productId, userNeeds } = body;

    if (!productId || !userNeeds) {
      return NextResponse.json(
        { error: "productId and userNeeds required" },
        { status: 400 },
      );
    }

    if (userNeeds.length > 300) {
      return NextResponse.json({ error: "Input too long" }, { status: 400 });
    }

    const cacheKey = `${productId}:${userNeeds.toLowerCase().trim()}`;

    const cached = matchCache.get(cacheKey);

    if (cached && cached.expiresAt > Date.now()) {
      return NextResponse.json({
        score: cached.score,
        reasons: cached.reasons,
        explanation: cached.explanation,
        cached: true,
      });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        averageRating: true,
        positivePercent: true,
        sizeComplaintPct: true,
        durabilityPct: true,
        comfortMentionPct: true,
        returnRiskPct: true,
        name: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const match = computeMatchScore(userNeeds, product);

    const structuredSummary = `
Product: ${product.name}
Match Score: ${match.score}%
Reasons:
${match.reasons.map((r) => `- ${r}`).join("\n")}
User Needs:
${userNeeds}

Explain clearly why this product is or is not a good match.
Keep it under 120 words.
`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(structuredSummary);
    const response = await result.response;
    const explanation = response.text();

    const responsePayload = {
      score: match.score,
      reasons: match.reasons,
      explanation,
    };

    matchCache.set(cacheKey, {
      ...responsePayload,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });

    return NextResponse.json({
      ...responsePayload,
      cached: false,
    });
  } catch (error) {
    console.error("AI match error:", error);

    return NextResponse.json({ error: "AI match failed" }, { status: 500 });
  }
}

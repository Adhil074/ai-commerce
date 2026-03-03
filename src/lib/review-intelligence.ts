import { prisma } from "@/lib/prisma";

type ReviewInput = {
  rating: number;
  comment: string;
};

type IntelligenceResult = {
  averageRating: number;
  positivePercent: number;
  sizeComplaintPct: number;
  durabilityPct: number;
  comfortMentionPct: number;
  returnRiskPct: number;
};

const SIZE_KEYWORDS = ["small", "large", "tight", "loose", "fit"];
const DURABILITY_KEYWORDS = ["broken", "crack", "damage", "weak", "cheap"];
const COMFORT_KEYWORDS = ["comfortable", "comfort", "back support", "soft"];

function containsKeyword(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((word) => lower.includes(word));
}

export function computeReviewIntelligence(
  reviews: ReviewInput[],
): IntelligenceResult {
  if (reviews.length === 0) {
    return {
      averageRating: 0,
      positivePercent: 0,
      sizeComplaintPct: 0,
      durabilityPct: 0,
      comfortMentionPct: 0,
      returnRiskPct: 0,
    };
  }

  let totalRating = 0;
  let positiveCount = 0;
  let sizeCount = 0;
  let durabilityCount = 0;
  let comfortCount = 0;
  let returnRiskCount = 0;

  for (const review of reviews) {
    totalRating += review.rating;

    if (review.rating >= 4) {
      positiveCount++;
    }

    const isSize = containsKeyword(review.comment, SIZE_KEYWORDS);
    const isDurability = containsKeyword(review.comment, DURABILITY_KEYWORDS);
    const isComfort = containsKeyword(review.comment, COMFORT_KEYWORDS);

    if (isSize) sizeCount++;
    if (isDurability) durabilityCount++;
    if (isComfort) comfortCount++;

    if (review.rating <= 2 && (isDurability || isSize)) {
      returnRiskCount++;
    }
  }

  const total = reviews.length;

  return {
    averageRating: Number((totalRating / total).toFixed(2)),
    positivePercent: Number(((positiveCount / total) * 100).toFixed(2)),
    sizeComplaintPct: Number(((sizeCount / total) * 100).toFixed(2)),
    durabilityPct: Number(((durabilityCount / total) * 100).toFixed(2)),
    comfortMentionPct: Number(((comfortCount / total) * 100).toFixed(2)),
    returnRiskPct: Number(((returnRiskCount / total) * 100).toFixed(2)),
  };
}

export async function updateProductIntelligence(
  productId: string,
): Promise<void> {
  const reviews = await prisma.review.findMany({
    where: { productId },
    select: {
      rating: true,
      comment: true,
    },
  });

  const intelligence = computeReviewIntelligence(reviews);

  await prisma.product.update({
    where: { id: productId },
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

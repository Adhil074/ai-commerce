//src\lib\product-match.ts

type ProductIntelligence = {
  averageRating: number;
  positivePercent: number;
  sizeComplaintPct: number;
  durabilityPct: number;
  comfortMentionPct: number;
  returnRiskPct: number;
};

type MatchResult = {
  score: number;
  reasons: string[];
};

export function computeMatchScore(
  userInput: string,
  product: ProductIntelligence,
): MatchResult {
  const text = userInput.toLowerCase();
  let score = 0;
  const reasons: string[] = [];

  // base trust score from overall positivity
  if (product.positivePercent >= 70) {
    score += 25;
    reasons.push("Strong overall positive reviews");
  } else if (product.positivePercent >= 50) {
    score += 15;
    reasons.push("Moderate positive feedback");
  }

  // comfort preference
  if (text.includes("comfort") || text.includes("back")) {
    if (product.comfortMentionPct >= 25) {
      score += 20;
      reasons.push("High comfort feedback");
    } else {
      score -= 10;
      reasons.push("Limited comfort mentions");
    }
  }

  // durability preference
  if (text.includes("durable") || text.includes("long lasting")) {
    if (product.durabilityPct <= 15) {
      score += 20;
      reasons.push("Low durability complaints");
    } else {
      score -= 15;
      reasons.push("Higher durability complaints reported");
    }
  }

  // size sensitivity
  if (text.includes("small") || text.includes("compact")) {
    if (product.sizeComplaintPct <= 20) {
      score += 15;
      reasons.push("Low size complaints");
    } else {
      score -= 10;
      reasons.push("Size-related complaints exist");
    }
  }

  // general daily-use intent
  if (
    text.includes("daily") ||
    text.includes("everyday") ||
    text.includes("decent")
  ) {
    if (product.averageRating >= 4) {
      score += 20;
      reasons.push("Good average rating");
    } else if (product.averageRating >= 3.5) {
      score += 10;
      reasons.push("Moderate rating");
    }

    if (product.returnRiskPct < 15) {
      score += 10;
      reasons.push("Low return risk");
    }
  }

  // return risk penalty
  if (product.returnRiskPct > 25) {
    score -= 20;
    reasons.push("Elevated return risk");
  } else if (product.returnRiskPct < 10) {
    score += 10;
    reasons.push("Low return risk");
  }

  // rating influence
  if (product.averageRating >= 4.2) {
    score += 15;
    reasons.push("High average rating");
  } else if (product.averageRating < 3) {
    score -= 20;
    reasons.push("Low average rating");
  }

  // normalize score between 0 and 100
  score = Math.max(0, Math.min(100, score));

  return {
    score,
    reasons,
  };
}

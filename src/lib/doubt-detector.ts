export type DoubtType =
  | "size"
  | "durability"
  | "regret"
  | "value"
  | "comfort"
  | "general";

export function detectDoubtType(input: string): DoubtType {
  const text = input.toLowerCase();

  if (text.includes("size") || text.includes("fit")) {
    return "size";
  }

  if (
    text.includes("break") ||
    text.includes("quality") ||
    text.includes("durable")
  ) {
    return "durability";
  }

  if (
    text.includes("regret") ||
    text.includes("return") ||
    text.includes("waste")
  ) {
    return "regret";
  }

  if (
    text.includes("worth") ||
    text.includes("price") ||
    text.includes("money")
  ) {
    return "value";
  }

  if (text.includes("comfort") || text.includes("back")) {
    return "comfort";
  }

  return "general";
}
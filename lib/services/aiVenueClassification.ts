import { inferClassificationFromTypes } from "@/lib/explore/ranking";
import { VenueClassification } from "@/lib/explore/types";

type ClassificationInput = {
  googlePlaceId: string;
  name: string;
  address: string;
  types: string[];
  rating: number | null;
  totalReviews: number;
  priceLevel: number | null;
  isOpenNow: boolean | null;
};

export type ClassificationResult = {
  aiClassification: VenueClassification;
  nightlifeRelevanceScore: number;
  confidence: number;
};

type CacheEntry = ClassificationResult & { expiresAt: number };
const classificationCache = new Map<string, CacheEntry>();

export async function getVenueClassification(input: ClassificationInput): Promise<ClassificationResult> {
  const cached = classificationCache.get(input.googlePlaceId);
  if (cached && cached.expiresAt > Date.now()) {
    return {
      aiClassification: cached.aiClassification,
      nightlifeRelevanceScore: cached.nightlifeRelevanceScore,
      confidence: cached.confidence
    };
  }

  const fallback = classifyHeuristically(input);
  let result = fallback;

  if (process.env.OPENAI_API_KEY) {
    const aiResult = await classifyWithLLM(input).catch(() => null);
    if (aiResult) result = aiResult;
  }

  classificationCache.set(input.googlePlaceId, { ...result, expiresAt: Date.now() + 1000 * 60 * 60 * 12 });
  return result;
}

function classifyHeuristically(input: ClassificationInput): ClassificationResult {
  const text = `${input.name} ${input.address} ${input.types.join(" ")}`.toLowerCase();

  const aiClassification =
    text.includes("rooftop") ? "rooftop"
      : text.includes("cocktail") ? "cocktail_bar"
        : text.includes("sports") ? "sports_bar"
          : text.includes("hookah") ? "hookah_lounge"
            : text.includes("lounge") ? "lounge"
              : text.includes("night club") || text.includes("nightclub") || input.types.includes("night_club") ? "club"
                : text.includes("bar") && text.includes("restaurant") ? "bar_restaurant"
                  : text.includes("bar") || input.types.includes("bar") ? "bar"
                    : text.includes("event") ? "event_space"
                      : text.includes("restaurant") ? "restaurant"
                        : inferClassificationFromTypes(input.types);

  const nightlifeBoost = ["club", "bar", "cocktail_bar", "lounge", "rooftop", "sports_bar", "hookah_lounge"].includes(aiClassification)
    ? 0.74
    : aiClassification === "bar_restaurant"
      ? 0.62
      : aiClassification === "event_space"
        ? 0.45
        : aiClassification === "restaurant"
          ? 0.3
          : 0.2;

  const ratingBoost = input.rating ? Math.min(0.2, input.rating / 25) : 0;
  const reviewBoost = Math.min(0.2, Math.log10(input.totalReviews + 1) / 6);

  return {
    aiClassification,
    nightlifeRelevanceScore: Math.max(0, Math.min(1, nightlifeBoost + ratingBoost + reviewBoost)),
    confidence: aiClassification === "unclear" ? 0.45 : 0.68
  };
}

async function classifyWithLLM(input: ClassificationInput): Promise<ClassificationResult> {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_CLASSIFIER_MODEL ?? "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: [
            {
              type: "text",
              text: "Classify venue into nightlife category. Return strict JSON {aiClassification, nightlifeRelevanceScore, confidence}."
            }
          ]
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: JSON.stringify(input)
            }
          ]
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "venue_classification",
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              aiClassification: {
                type: "string",
                enum: ["club", "bar", "cocktail_bar", "sports_bar", "lounge", "rooftop", "hookah_lounge", "bar_restaurant", "restaurant", "event_space", "unclear"]
              },
              nightlifeRelevanceScore: { type: "number", minimum: 0, maximum: 1 },
              confidence: { type: "number", minimum: 0, maximum: 1 }
            },
            required: ["aiClassification", "nightlifeRelevanceScore", "confidence"]
          }
        }
      }
    }),
    next: { revalidate: 60 * 60 * 12 }
  });

  if (!response.ok) throw new Error("LLM classification unavailable");
  const payload = await response.json() as { output_text?: string };
  const parsed = JSON.parse(payload.output_text ?? "{}") as ClassificationResult;

  if (!parsed.aiClassification) throw new Error("Invalid classification payload");

  return {
    aiClassification: parsed.aiClassification,
    nightlifeRelevanceScore: Math.max(0, Math.min(1, parsed.nightlifeRelevanceScore ?? 0.5)),
    confidence: Math.max(0, Math.min(1, parsed.confidence ?? 0.6))
  };
}

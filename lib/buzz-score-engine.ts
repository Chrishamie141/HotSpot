import { ConfidenceLevel, CrowdLabel } from "@prisma/client";

export type BuzzSignalInput = {
  openNow: boolean;
  venueType: "bar" | "club" | "lounge" | "rooftop";
  localHour: number;
  dayOfWeek: number;
  rating: number;
  reviewCount: number;
  reviewRecencyBoost: number;
  eventBoost: number;
  liveReportMomentum: number;
  ownerUpdateBoost: number;
  historicalTrend: number;
  neighborhoodIntensity: number;
};

export type BuzzResult = {
  score: number;
  crowdLabel: CrowdLabel;
  confidence: ConfidenceLevel;
  summaryReason: string;
  comparedToUsual: "slower than normal" | "normal" | "busier than normal";
  lineEstimate: "no line" | "short" | "medium" | "long";
};

const venueTypeWeights: Record<BuzzSignalInput["venueType"], number> = {
  bar: 8,
  lounge: 10,
  rooftop: 12,
  club: 14
};

export function calculateBuzzScore(input: BuzzSignalInput): BuzzResult {
  const timeWeight = input.localHour >= 22 || input.localHour < 2 ? 16 : 8;
  const dayWeight = input.dayOfWeek === 5 || input.dayOfWeek === 6 ? 12 : 6;

  let score = 0;
  score += input.openNow ? 14 : -20;
  score += venueTypeWeights[input.venueType];
  score += timeWeight + dayWeight;
  score += Math.min(input.rating * 3, 15);
  score += Math.min(input.reviewCount / 100, 10);
  score += input.reviewRecencyBoost;
  score += input.eventBoost;
  score += input.liveReportMomentum;
  score += input.ownerUpdateBoost;
  score += input.historicalTrend;
  score += input.neighborhoodIntensity;
  score = Math.max(0, Math.min(100, Math.round(score)));

  const crowdLabel = score >= 85 ? CrowdLabel.PACKED : score >= 70 ? CrowdLabel.HOT : score >= 50 ? CrowdLabel.ACTIVE : score >= 30 ? CrowdLabel.SLOW : CrowdLabel.DEAD;

  const confidence = input.liveReportMomentum >= 14 ? ConfidenceLevel.HIGH : input.liveReportMomentum >= 7 ? ConfidenceLevel.MEDIUM : ConfidenceLevel.LOW;

  const comparedToUsual = score - input.historicalTrend > 12 ? "busier than normal" : score - input.historicalTrend < -8 ? "slower than normal" : "normal";

  const lineEstimate = crowdLabel === CrowdLabel.PACKED ? "long" : crowdLabel === CrowdLabel.HOT ? "medium" : crowdLabel === CrowdLabel.ACTIVE ? "short" : "no line";

  return {
    score,
    crowdLabel,
    confidence,
    summaryReason: `${input.openNow ? "Open now" : "Possibly closed"}; ${comparedToUsual}; ${lineEstimate} line expected`,
    comparedToUsual,
    lineEstimate
  };
}

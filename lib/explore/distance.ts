import { DistanceOption } from "@/lib/explore/types";

export const DISTANCE_OPTIONS: DistanceOption[] = [
  { miles: 5, meters: 8047, label: "5 mi" },
  { miles: 10, meters: 16093, label: "10 mi" },
  { miles: 25, meters: 40234, label: "25 mi" },
  { miles: 50, meters: 80467, label: "50 mi" }
];

export const DEFAULT_DISTANCE_MILES: DistanceOption["miles"] = 10;

export function milesToMeters(miles: number) {
  return DISTANCE_OPTIONS.find((option) => option.miles === miles)?.meters ?? Math.round(miles * 1609.34);
}

export function metersToMiles(meters: number) {
  return Math.round((meters / 1609.34) * 10) / 10;
}

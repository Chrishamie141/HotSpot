import { NextRequest } from "next/server";
import { GET as getNearbyVenues } from "@/app/api/venues/nearby/route";

export async function GET(request: NextRequest) {
  return getNearbyVenues(request);
}

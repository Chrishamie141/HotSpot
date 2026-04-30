import { NextResponse } from "next/server";
import { getCurrentUserFromSession } from "@/lib/auth-session";

export async function GET() {
  try {
    const user = await getCurrentUserFromSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const social = user.socialProfile;
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        onboardingCompleted: social?.onboardingCompleted ?? false,
        socialProfile: {
          handle: social?.handle ?? "",
          displayName: social?.displayName ?? user.displayName ?? "",
          bio: social?.bio ?? "",
          cityLine: social?.cityLine ?? "",
          avatarUrl: social?.avatarUrl ?? "",
          onboardingCompleted: social?.onboardingCompleted ?? false,
          preferredCity: social?.preferredCity ?? "",
          preferredNightlifeTypes: social?.preferredNightlifeTypes ?? [],
          ageRange: social?.ageRange ?? "",
        },
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json({ error: error instanceof Error ? error.message : "Auth configuration error" }, { status: 500 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set("hotspot_user_id", "", { path: "/", maxAge: 0, httpOnly: true, sameSite: "lax" });
  return NextResponse.json({ ok: true });
}

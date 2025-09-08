export const dynamic = "force-dynamic";

import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const doc = await db.collection("forecasts").doc("latest").get();

    if (!doc.exists) {
      return NextResponse.json({ error: "No forecast data found" }, { status: 404 });
    }

    return NextResponse.json(doc.data()?.data || []);
  } catch (err) {
    console.error("Error fetching forecast:", err);
    return NextResponse.json({ error: "Failed to fetch forecast" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";

interface Subscription {
  fuel: string;
  condition: "above" | "below";
  threshold: number;
  frequency: "instant" | "daily" | "weekly";
  telegram: string;
}

export async function GET() {
  const snapshot = await db.collection("subscriptions").get();
  const subscriptions: Subscription[] = snapshot.docs.map(doc => doc.data() as Subscription);
  return NextResponse.json(subscriptions);
}

export async function POST(req: Request) {
  const sub: Subscription = await req.json();
  await db.collection("subscriptions").add(sub);
  return NextResponse.json({ success: true });
}

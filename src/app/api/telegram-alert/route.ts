export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { chat_id, message } = body;
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

    if (!chat_id || !message) {
      return NextResponse.json({ error: "chat_id and message required" }, { status: 400 });
    }

    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id,
      text: message,
      parse_mode: "HTML",
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Telegram API error:", err);
    return NextResponse.json({ error: "Failed to send Telegram message" }, { status: 500 });
  }
}
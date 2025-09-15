import os
import asyncio
import aiohttp
from dotenv import load_dotenv
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes
import firebase_admin
from firebase_admin import credentials, firestore

load_dotenv()
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
if not TELEGRAM_BOT_TOKEN:
    raise ValueError("TELEGRAM_BOT_TOKEN not set!")

cred = credentials.Certificate("src/lib/service_account.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

SUBSCRIPTIONS_COLLECTION = "subscriptions"
FUEL_API_URL = "http://localhost:3000/api/fuel"
last_alerts = {}

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    chat_id = update.message.chat_id
    username = update.message.from_user.username

    db.collection(SUBSCRIPTIONS_COLLECTION).document(username).set(
        {"chat_id": chat_id, "telegram": username}, merge=True
    )

    await update.message.reply_text(
        "Welcome! You will now receive fuel alerts.\n"
        "Alerts will be sent when conditions are met."
    )
    print(f"[REGISTER] User: {username}, chat_id: {chat_id}")


async def list_subs(update: Update, context: ContextTypes.DEFAULT_TYPE):
    subs = db.collection(SUBSCRIPTIONS_COLLECTION).stream()
    message = "Subscriptions:\n"
    for doc in subs:
        message += f"{doc.id}: {doc.to_dict()}\n"
    await update.message.reply_text(message)


async def fetch_latest_fuel_prices():
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(FUEL_API_URL, timeout=10) as resp:
                resp.raise_for_status()
                data = await resp.json()
                level_data = data.get("levelData", [])
                if not level_data:
                    print("[WARN] No levelData received")
                    return None
                latest = level_data[-1]
                return {fuel: float(latest.get(fuel, 0)) for fuel in ["ron95", "ron97", "diesel", "diesel_eastmsia"]}
        except Exception as e:
            print(f"[ERROR] Could not fetch fuel prices: {e}")
            return None


async def send_telegram_message(chat_id: int, message: str):
    async with aiohttp.ClientSession() as session:
        url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
        try:
            async with session.post(url, json={"chat_id": chat_id, "text": message, "parse_mode": "HTML"}, timeout=10) as resp:
                if resp.status == 200:
                    print(f"[SENT] Message to chat_id {chat_id}")
                else:
                    print(f"[ERROR] Failed to send to {chat_id}: {await resp.text()}")
        except Exception as e:
            print(f"[ERROR] Could not send message to {chat_id}: {e}")


async def check_and_send_alerts(prices, username, chat_id, alerts):
    for alert in alerts:
        fuel, condition, threshold = alert.get("fuel"), alert.get("condition"), alert.get("threshold")
        current_price = prices.get(fuel)
        if current_price is None:
            continue

        trigger = (condition == "above" and current_price > threshold) or \
                  (condition == "below" and current_price < threshold)

        key = f"{username}_{fuel}_{condition}_{threshold}"
        if trigger and last_alerts.get(key) != current_price:
            await send_telegram_message(
                chat_id,
                f"🚨 Fuel Alert 🚨\nFuel: {fuel.upper()}\nCondition: {condition} RM {threshold}\nCurrent Price: RM {current_price:.2f}"
            )
            last_alerts[key] = current_price


async def check_fuel_alerts_periodic():
    while True:
        prices = await fetch_latest_fuel_prices()
        if not prices:
            print("[INFO] Retrying fuel fetch in 60 seconds...")
            await asyncio.sleep(60)
            continue

        for doc in db.collection(SUBSCRIPTIONS_COLLECTION).stream():
            data = doc.to_dict()
            chat_id, username, alerts = data.get("chat_id"), data.get("telegram"), data.get("alerts", [])
            if not chat_id or not alerts:
                continue
            await check_and_send_alerts(prices, username, chat_id, alerts)

        await asyncio.sleep(60)


async def on_startup(app):
    await asyncio.sleep(2)
    print("[INFO] Starting background fuel alert task...")
    asyncio.create_task(check_fuel_alerts_periodic())


def main():
    app = ApplicationBuilder().token(TELEGRAM_BOT_TOKEN).post_init(on_startup).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("list", list_subs))
    print("Telegram bot is running...")
    app.run_polling()


if __name__ == "__main__":
    main()
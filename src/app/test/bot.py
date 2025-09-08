import os
import asyncio
from telegram import Bot

# Force IPv4 to avoid httpx ConnectError
os.environ["HTTPX_DISABLE_IPV6"] = "1"

async def main():
    bot = Bot(token="8201208360:AAHNol09tcG2C9REnzQw0qTmTQOOMqL1l9s")
    me = await bot.get_me()  # ✅ await the coroutine
    print(me)

asyncio.run(main())
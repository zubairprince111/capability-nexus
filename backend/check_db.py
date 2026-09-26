import asyncio
import asyncpg

async def check_port(host, port):
    print(f"Checking {host}:{port}...")
    try:
        conn = await asyncpg.connect(host=host, port=port, user='postgres', password='postgres', database='ai5k')
        print(f"SUCCESS on {host}:{port}!")
        await conn.close()
    except Exception as e:
        print(f"FAILED on {host}:{port}: {type(e).__name__} - {e}")

async def main():
    await check_port('127.0.0.1', 5434)
    await check_port('::1', 5434)

asyncio.run(main())

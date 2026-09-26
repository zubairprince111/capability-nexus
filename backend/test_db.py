import asyncio
import asyncpg

async def main():
    try:
        conn = await asyncpg.connect(host='localhost', port=5432, user='postgres', password='postgres', database='postgres')
        print('Connected to native postgres!')
        await conn.execute('CREATE DATABASE ai5k;')
        print('Created ai5k database.')
        await conn.close()
    except asyncpg.exceptions.DuplicateDatabaseError:
        print('Database ai5k already exists.')
    except Exception as e:
        print('Error:', e)

asyncio.run(main())

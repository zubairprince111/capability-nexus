import asyncio
import asyncpg

async def main():
    try:
        # Connect using the current windows username "user"
        conn = await asyncpg.connect(host='localhost', port=5433, user='user', database='postgres')
        print('Connected!')
        
        # Create user postgres
        try:
            await conn.execute("CREATE USER postgres WITH PASSWORD 'postgres' SUPERUSER;")
            print('Created user postgres.')
        except Exception as e:
            print('User error:', e)
            
        # Create database ai5k
        try:
            await conn.execute("CREATE DATABASE ai5k OWNER postgres;")
            print('Created database ai5k.')
        except Exception as e:
            print('DB error:', e)
            
        await conn.close()
    except Exception as e:
        print('Connection error:', e)

asyncio.run(main())

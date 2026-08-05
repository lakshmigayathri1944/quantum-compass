import sqlite3


DATABASE="quantum_compass.db"



def create_database():


    conn = sqlite3.connect(DATABASE)

    cursor = conn.cursor()



    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users(

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        name TEXT,

        email TEXT UNIQUE,

        password TEXT,

        goal TEXT,

        readiness TEXT

    )
    """)




    cursor.execute("""
    CREATE TABLE IF NOT EXISTS progress(

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        user_id INTEGER,

        skill TEXT,

        status TEXT DEFAULT 'Pending',

        completed_date TEXT,

        FOREIGN KEY(user_id)
        REFERENCES users(id)

    )
    """)



    conn.commit()

    conn.close()



create_database()
from flask import request, jsonify
import sqlite3


DATABASE = "quantum_compass.db"



# REGISTER

def register_user():

    data = request.json


    name = data["name"]
    email = data["email"]
    password = data["password"]
    goal = data["goal"]


    conn = sqlite3.connect(DATABASE)

    cursor = conn.cursor()


    try:

        cursor.execute(
        """
        INSERT INTO users
        (name,email,password,goal)

        VALUES(?,?,?,?)
        """,
        (name,email,password,goal)
        )


        conn.commit()


        return jsonify(
        {
        "message":
        "User Registered Successfully 🚀"
        }
        )


    except Exception as e:

        return jsonify(
        {
        "error":str(e)
        }
        ),400



    finally:

        conn.close()






# LOGIN

def login_user():

    data=request.json


    email=data["email"]
    password=data["password"]


    conn=sqlite3.connect(DATABASE)

    cursor=conn.cursor()


    cursor.execute(
    """
    SELECT name,goal
    FROM users
    WHERE email=? AND password=?

    """,
    (email,password)
    )


    user=cursor.fetchone()


    conn.close()



    if user:


        return jsonify(
        {

        "message":
        "Login Successful 🚀",

        "name":
        user[0],

        "goal":
        user[1]

        }
        )


    else:


        return jsonify(
        {
        "error":
        "Invalid Credentials"
        }
        ),401
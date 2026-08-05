import { useState } from "react";

const API_URL = "http://127.0.0.1:5000";

function Login({ setUser }) {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function login(event) {
    event.preventDefault();

    setError("");

    const cleanEmail =
      email.trim();

    const cleanPassword =
      password.trim();

    if (
      !cleanEmail ||
      !cleanPassword
    ) {
      setError(
        "Please enter your email and password."
      );
      return;
    }

    try {
      setLoading(true);

      console.log(
        "Sending login request..."
      );

      const response =
        await fetch(
          `${API_URL}/login`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              email: cleanEmail,
              password:
                cleanPassword,
            }),
          }
        );

      const data =
        await response.json();

      console.log(
        "LOGIN RESPONSE:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Invalid email or password."
        );
      }

      if (!data.user_id) {
        throw new Error(
          "Login succeeded but the backend did not return a user ID."
        );
      }

      const userId =
        String(data.user_id);

      localStorage.setItem(
        "user_id",
        userId
      );

      console.log(
        "LOGIN SUCCESS:",
        userId
      );

      setUser(userId);
    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error
      );

      if (
        error instanceof TypeError
      ) {
        setError(
          "Cannot connect to Flask backend. Make sure py app.py is running."
        );
      } else {
        setError(
          error.message ||
            "Login failed."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-logo">
          ⚛️
        </div>

        <h1>
          Quantum Compass
        </h1>

        <p className="login-subtitle">
          AI-Powered Quantum Learning Platform
        </p>

        <div className="login-welcome">

          <h2>
            Welcome back 👋
          </h2>

          <p>
            Sign in to continue your
            quantum journey.
          </p>

        </div>

        <form onSubmit={login}>

          <label>
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) =>
              setEmail(
                event.target.value
              )
            }
            autoComplete="email"
          />

          <label>
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) =>
              setPassword(
                event.target.value
              )
            }
            autoComplete="current-password"
          />

          {error && (
            <div className="login-error">

              <span>
                ⚠️
              </span>

              <span>
                {error}
              </span>

            </div>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Connecting..."
              : "Login 🚀"}
          </button>

        </form>

        <div className="login-footer">
          ⚛️ Quantum Compass AI
        </div>

      </div>

    </div>
  );
}

export default Login;
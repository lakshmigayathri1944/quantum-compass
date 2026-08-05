import { useState } from "react";
import "./ChatBot.css";

function ChatBot() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const askMentor = async () => {
    const cleanQuestion = question.trim();

    // Don't send empty questions
    if (!cleanQuestion) {
      return;
    }

    const userId = localStorage.getItem("user_id");

    // Add user's message immediately
    const userMessage = {
      type: "user",
      text: cleanQuestion,
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/chat",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            user_id: userId
              ? Number(userId)
              : null,

            question: cleanQuestion,
          }),
        }
      );

      // Check HTTP status
      if (!response.ok) {
        throw new Error(
          `Server error: ${response.status}`
        );
      }

      const data = await response.json();

      // Get answer safely
      const mentorAnswer =
        data.answer ||
        data.message ||
        "Sorry, I could not generate an answer.";

      // Add mentor response
      const mentorMessage = {
        type: "mentor",
        text: mentorAnswer,
      };

      setMessages((previous) => [
        ...previous,
        mentorMessage,
      ]);

    } catch (error) {
      console.error(
        "Quantum Mentor Error:",
        error
      );

      setMessages((previous) => [
        ...previous,
        {
          type: "error",
          text:
            "⚠️ I couldn't connect to the Quantum Compass backend. Please make sure Flask is running.",
        },
      ]);

    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------
  // ENTER KEY
  // ----------------------------------------

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !loading
    ) {
      event.preventDefault();
      askMentor();
    }
  };

  // ----------------------------------------
  // CLEAR CHAT
  // ----------------------------------------

  const clearChat = () => {
    setMessages([]);
    setQuestion("");
  };

  // ----------------------------------------
  // QUICK QUESTIONS
  // ----------------------------------------

  const askQuickQuestion = (text) => {
    setQuestion(text);
  };

  return (
    <div className="quantum-mentor">

      {/* HEADER */}

      <div className="mentor-header">

        <div className="mentor-icon">
          🤖
        </div>

        <div>
          <h2>
            Quantum AI Mentor
          </h2>

          <p>
            Your personal quantum learning guide
          </p>
        </div>

      </div>

      {/* CHAT AREA */}

      <div className="mentor-chat">

        {messages.length === 0 && (
          <div className="welcome-message">

            <div className="welcome-icon">
              ⚛️
            </div>

            <h3>
              Hello, Quantum Explorer! 👋
            </h3>

            <p>
              I'm your Quantum AI Mentor.
              Ask me about quantum computing,
              Qiskit, algorithms, projects,
              or your career roadmap.
            </p>

          </div>
        )}

        {/* MESSAGES */}

        {messages.map((message, index) => (

          <div
            key={index}
            className={`message ${
              message.type === "user"
                ? "user-message"
                : message.type === "error"
                ? "error-message"
                : "mentor-message"
            }`}
          >

            <div className="message-label">

              {message.type === "user"
                ? "👩‍💻 You"
                : message.type === "error"
                ? "⚠️ System"
                : "🤖 Quantum Mentor"}

            </div>

            <div className="message-text">
              {message.text}
            </div>

          </div>

        ))}

        {/* LOADING */}

        {loading && (
          <div className="message mentor-message">

            <div className="message-label">
              🤖 Quantum Mentor
            </div>

            <div className="typing">
              <span></span>
              <span></span>
              <span></span>

              <p>
                Thinking...
              </p>
            </div>

          </div>
        )}

      </div>

      {/* QUICK QUESTIONS */}

      <div className="quick-questions">

        <p>
          💡 Try asking:
        </p>

        <button
          onClick={() =>
            askQuickQuestion(
              "What should I learn next?"
            )
          }
        >
          🎯 What should I learn next?
        </button>

        <button
          onClick={() =>
            askQuickQuestion(
              "Explain quantum computing simply"
            )
          }
        >
          ⚛️ Explain quantum computing
        </button>

        <button
          onClick={() =>
            askQuickQuestion(
              "Give me a quantum project"
            )
          }
        >
          🚀 Give me a project
        </button>

      </div>

      {/* INPUT */}

      <div className="mentor-input-area">

        <textarea
          value={question}
          onChange={(event) =>
            setQuestion(event.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="Ask your Quantum AI Mentor..."
          rows="2"
          disabled={loading}
        />

        <button
          className="ask-button"
          onClick={askMentor}
          disabled={
            loading ||
            !question.trim()
          }
        >
          {loading
            ? "⏳"
            : "🚀"}
        </button>

      </div>

      {/* FOOTER */}

      <div className="mentor-footer">

        <span>
          ⚛️ Quantum Compass AI
        </span>

        {messages.length > 0 && (
          <button
            onClick={clearChat}
            disabled={loading}
          >
            🗑️ Clear Chat
          </button>
        )}

      </div>

    </div>
  );
}

export default ChatBot;
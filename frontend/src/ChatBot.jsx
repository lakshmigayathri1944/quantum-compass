import { useState } from "react";
import "./ChatBot.css";

const API_URL = "http://127.0.0.1:5000";

function ChatBot() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const askMentor = async (customQuestion = null) => {
    const text = (
      customQuestion ?? question
    ).trim();

    if (!text || loading) return;

    const storedUserId =
      localStorage.getItem("user_id");

    const userId =
      Number(storedUserId) || 3;

    setMessages((previous) => [
      ...previous,
      {
        type: "user",
        text,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/chat`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            user_id: userId,
            question: text,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Mentor request failed"
        );
      }

      const answer =
        data.answer ||
        data.mentor_response ||
        "I could not generate an answer.";

      setMessages((previous) => [
        ...previous,
        {
          type: "mentor",
          text: answer,
        },
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
            "Unable to connect to the Quantum AI Mentor. Please make sure Flask is running on port 5000.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      askMentor();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="quantum-chat">

      {/* CHAT HEADER */}

      <div className="chat-top">

        <div className="chat-status">

          <span className="online-dot" />

          <span>
            Online
          </span>

        </div>

        {messages.length > 0 && (
          <button
            className="clear-chat"
            onClick={clearChat}
            disabled={loading}
          >
            Clear
          </button>
        )}

      </div>

      {/* CHAT BODY */}

      <div className="chat-messages">

        {messages.length === 0 && (
          <div className="chat-welcome">

            <div className="chat-welcome-icon">
              ⚛️
            </div>

            <h3>
              Hello, Quantum Explorer 👋
            </h3>

            <p>
              Ask me anything about quantum
              computing, algorithms, Qiskit,
              projects or your career.
            </p>

          </div>
        )}

        {messages.map(
          (message, index) => (
            <div
              key={index}
              className={`chat-message ${
                message.type
              }`}
            >

              <div className="message-avatar">

                {message.type === "user"
                  ? "👩‍💻"
                  : message.type === "error"
                  ? "⚠️"
                  : "🤖"}

              </div>

              <div className="message-content">

                <span className="message-author">

                  {message.type === "user"
                    ? "You"
                    : message.type === "error"
                    ? "System"
                    : "Quantum Mentor"}

                </span>

                <div className="message-bubble">
                  {message.text}
                </div>

              </div>

            </div>
          )
        )}

        {loading && (
          <div className="chat-message mentor">

            <div className="message-avatar">
              🤖
            </div>

            <div className="message-content">

              <span className="message-author">
                Quantum Mentor
              </span>

              <div className="message-bubble thinking">

                <span />
                <span />
                <span />

                <small>
                  Thinking...
                </small>

              </div>

            </div>

          </div>
        )}

      </div>

      {/* QUICK QUESTIONS */}

      <div className="quick-prompts">

        <button
          onClick={() =>
            askMentor(
              "What should I learn next?"
            )
          }
        >
          🎯 Next step
        </button>

        <button
          onClick={() =>
            askMentor(
              "Explain quantum computing simply"
            )
          }
        >
          ⚛️ Quantum basics
        </button>

        <button
          onClick={() =>
            askMentor(
              "Explain QAOA"
            )
          }
        >
          🚀 Explain QAOA
        </button>

        <button
          onClick={() =>
            askMentor(
              "Give me a quantum project"
            )
          }
        >
          🛠️ Project
        </button>

      </div>

      {/* INPUT */}

      <div className="chat-input">

        <textarea
          value={question}
          onChange={(event) =>
            setQuestion(
              event.target.value
            )
          }
          onKeyDown={handleKeyDown}
          placeholder="Ask your Quantum AI Mentor..."
          rows={1}
          disabled={loading}
        />

        <button
          onClick={() => askMentor()}
          disabled={
            loading ||
            !question.trim()
          }
          className="send-button"
        >
          {loading ? "⏳" : "➤"}
        </button>

      </div>

      <div className="chat-footer">
        ⚛️ Powered by Quantum Compass AI
      </div>

    </div>
  );
}

export default ChatBot;

import React, { useState, useRef, useEffect } from 'react';

export default function AiAssistant() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am ScholarBot. Your AI text processing models are operational. Ask me anything about your syllabus subjects!' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  // Automatically scroll down to the newest messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // 1. Append User Message
    const userMessage = { sender: 'user', text: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    // 2. Simulated Bot Response (Replace this with your Axios backend hook later!)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: `I've received your query regarding the platform parameters. Let me run a check on that system element for you.` }
      ]);
    }, 1000);
  };

  return (
    <div
      style={{
        height: "calc(100vh - 120px)",
        background: "#0a0a0f",
        color: "#f0f0f5",
        padding: "1rem",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <h1
        style={{
          fontSize: "1.4rem",
          marginBottom: "0.5rem",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}
      >
        💬 AI Assistant Console
      </h1>
      
      <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
        Query your automated core LLM text pipelines regarding syllabus structures and exam markers.
      </p>

      {/* Main Chat Interface Container Card */}
      <div
        style={{
          background: "#111318",
          borderRadius: "12px",
          border: "1px solid #1c1f26",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
        }}
      >
        {/* 1. Dynamic Message History Panel */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem"
          }}
        >
          {messages.map((msg, index) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: isUser ? "flex-end" : "flex-start",
                  width: "100%"
                }}
              >
                <div
                  style={{
                    maxWidth: "70%",
                    padding: "0.8rem 1.2rem",
                    borderRadius: "12px",
                    border: isUser ? "none" : "1px solid #1c1f26",
                    background: isUser ? "linear-gradient(90deg, #3b82f6, #a855f7)" : "#07080a",
                    color: "#fff",
                    fontSize: "0.88rem",
                    lineHeight: "1.4",
                    wordBreak: "break-word",
                    boxShadow: isUser ? "0 2px 8px rgba(59, 130, 246, 0.2)" : "none"
                  }}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* 2. Interactive Input Control Dock */}
        <form
          onSubmit={handleSendMessage}
          style={{
            padding: "1rem",
            background: "#07080a",
            borderTop: "1px solid #1c1f26",
            display: "flex",
            gap: "0.75rem",
            alignItems: "center"
          }}
        >
          <input
            type="text"
            placeholder="Type your message or ask about your syllabus subjects..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            style={{
              flex: 1,
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              border: "1px solid #1c1f26",
              background: "#111318",
              color: "#fff",
              fontSize: "0.85rem",
              outline: "none"
            }}
          />
          <button
            type="submit"
            style={{
              background: "linear-gradient(90deg, #3b82f6, #a855f7)",
              color: "white",
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              fontSize: "0.85rem",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "opacity 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"}
            onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
          >
            Send Query
          </button>
        </form>
      </div>
    </div>
  );
}
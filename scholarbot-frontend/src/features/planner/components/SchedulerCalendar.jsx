import React, { useState } from "react";

export default function SchedulerCalendar() {
  const [tasks, setTasks] = useState([
    {
      title: "DBMS Revision",
      date: "2026-06-20",
      priority: "High",
    },
    {
      title: "React Project Submission",
      date: "2026-06-22",
      priority: "Medium",
    },
  ]);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [priority, setPriority] = useState("Medium");

  const addTask = () => {
    if (!title || !date) return;

    setTasks([
      ...tasks,
      {
        title,
        date,
        priority,
      },
    ]);

    setTitle("");
    setDate("");
    setPriority("Medium");
  };

  return (
    <div
      style={{
        minHeight: "100%",
        background: "#0a0a0f",
        color: "#f0f0f5",
        padding: "1rem",
      }}
    >
      <h1
        style={{
          fontSize: "1.4rem",
          marginBottom: "1rem",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}
      >
        📅 Smart Scheduler Calendar
      </h1>
      
      <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
        Log and organize impending assignment goals and micro-milestone dependencies below.
      </p>

      {/* Input Form Module Card */}
      <div
        style={{
          background: "#111318",
          padding: "1.5rem",
          borderRadius: "12px",
          border: "1px solid #1c1f26",
          maxWidth: "700px",
          marginBottom: "1.5rem",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: "1rem", fontSize: "1rem", color: "#fff", fontWeight: "600" }}>
          🚀 Create Academic Objective
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <input
            type="text"
            placeholder="Objective Title (e.g., Cloud Computing Viva)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: "100%",
              padding: "0.6rem 0.8rem",
              borderRadius: "6px",
              border: "1px solid #1c1f26",
              background: "#07080a",
              color: "#fff",
              fontSize: "0.85rem",
              outline: "none",
            }}
          />

          <div style={{ display: "flex", gap: "0.75rem", width: "100%" }}>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{
                flex: 1,
                padding: "0.6rem 0.8rem",
                borderRadius: "6px",
                border: "1px solid #1c1f26",
                background: "#07080a",
                color: "#fff",
                fontSize: "0.85rem",
                outline: "none",
              }}
            />

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={{
                flex: 1,
                padding: "0.6rem 0.8rem",
                borderRadius: "6px",
                border: "1px solid #1c1f26",
                background: "#07080a",
                color: "#fff",
                fontSize: "0.85rem",
                outline: "none",
              }}
            >
              <option value="High">High Urgency</option>
              <option value="Medium">Medium Urgency</option>
              <option value="Low">Low Urgency</option>
            </select>
          </div>

          <button
            onClick={addTask}
            style={{
              alignSelf: "flex-start",
              background: "linear-gradient(90deg, #3b82f6, #a855f7)",
              color: "white",
              border: "none",
              padding: "0.6rem 1.2rem",
              borderRadius: "6px",
              fontSize: "0.85rem",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
              transition: "opacity 0.2s",
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"}
            onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
          >
            Deploy New Task
          </button>
        </div>
      </div>

      {/* Target Tasks Dynamic Map Queue */}
      <div
        style={{
          maxWidth: "700px",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        {tasks.map((task, index) => {
          const isHigh = task.priority === "High";
          const isMed = task.priority === "Medium";
          const badgeBg = isHigh ? "#ef4444" : isMed ? "#eab308" : "#22c55e";

          return (
            <div
              key={index}
              style={{
                background: "#111318",
                borderRadius: "12px",
                border: "1px solid #1c1f26",
                padding: "1rem 1.25rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                <h4 style={{ margin: 0, fontSize: "0.95rem", color: "#fff", fontWeight: "600" }}>
                  {task.title}
                </h4>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "#64748b" }}>
                  <span>📅 Target Cycle: {task.date}</span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: "bold",
                    padding: "0.15rem 0.5rem",
                    borderRadius: "4px",
                    background: badgeBg,
                    color: "#fff",
                  }}
                >
                  {task.priority} Priority
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
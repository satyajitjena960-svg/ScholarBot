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
        minHeight: "100vh",
        background: "#f4f7fc",
        padding: "30px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#2c3e50",
        }}
      >
        📅 Smart Scheduler Calendar
      </h1>

      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          maxWidth: "700px",
          margin: "20px auto",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h3>Add New Task</h3>

        <input
          type="text"
          placeholder="Task Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
          }}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
          }}
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <button
          onClick={addTask}
          style={{
            background: "#3498db",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Add Task
        </button>
      </div>

      <div
        style={{
          maxWidth: "700px",
          margin: "auto",
        }}
      >
        {tasks.map((task, index) => (
          <div
            key={index}
            style={{
              background: "white",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "10px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            <h3>{task.title}</h3>
            <p>📅 {task.date}</p>
            <p>⚡ Priority: {task.priority}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
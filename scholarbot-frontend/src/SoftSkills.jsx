import React from "react";

export default function SoftSkills() {
  const skills = [
    {
      skill: "Communication",
      progress: 85,
    },
    {
      skill: "Leadership",
      progress: 70,
    },
    {
      skill: "Team Work",
      progress: 90,
    },
    {
      skill: "Problem Solving",
      progress: 80,
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#eef5ff",
        padding: "30px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#2c3e50",
        }}
      >
        🌟 Soft Skills Development Tracker
      </h1>

      <div
        style={{
          maxWidth: "700px",
          margin: "30px auto",
        }}
      >
        {skills.map((item, index) => (
          <div
            key={index}
            style={{
              background: "white",
              padding: "20px",
              marginBottom: "20px",
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <h3>{item.skill}</h3>

            <div
              style={{
                background: "#ddd",
                height: "20px",
                borderRadius: "20px",
              }}
            >
              <div
                style={{
                  width: `${item.progress}%`,
                  background: "#4CAF50",
                  height: "20px",
                  borderRadius: "20px",
                }}
              ></div>
            </div>

            <p
              style={{
                marginTop: "10px",
                fontWeight: "bold",
              }}
            >
              {item.progress}% Completed
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
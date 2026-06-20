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
        🌟 Soft Skills Development Tracker
      </h1>
      
      <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
        Monitor your non-technical core competencies and academic group presentation readiness levels.
      </p>

      {/* Skills Layout Matrix */}
      <div
        style={{
          maxWidth: "700px",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        {skills.map((item, index) => (
          <div
            key={index}
            style={{
              background: "#111318",
              padding: "1.25rem",
              borderRadius: "12px",
              border: "1px solid #1c1f26",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "0.95rem", color: "#fff", fontWeight: "600" }}>
                {item.skill}
              </h3>
              <span style={{ fontSize: "0.8rem", color: "#3b82f6", fontWeight: "bold" }}>
                {item.progress}% Attained
              </span>
            </div>

            {/* Main Progress Bar Container */}
            <div
              style={{
                background: "#07080a",
                height: "8px",
                borderRadius: "10px",
                overflow: "hidden",
                marginTop: "0.25rem"
              }}
            >
              {/* Animated Gradient Fill Layer */}
              <div
                style={{
                  width: `${item.progress}%`,
                  background: "linear-gradient(90deg, #a855f7, #3b82f6)",
                  height: "100%",
                  borderRadius: "10px",
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
//changed
package com.scholarbot.features.timer;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "timer_sessions")
public class Timer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId; // Connects the session to a specific student

    private String title; // e.g., "Studying DBMS", "Coding Challenge"

    private Long durationInSeconds; // Length of the timer session

    private LocalDateTime createdAt;

    // Constructors
    public Timer() {}

    public Timer(Long userId, String title, Long durationInSeconds) {
        this.userId = userId;
        this.title = title;
        this.durationInSeconds = durationInSeconds;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Long getDurationInSeconds() { return durationInSeconds; }
    public void setDurationInSeconds(Long durationInSeconds) { this.durationInSeconds = durationInSeconds; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

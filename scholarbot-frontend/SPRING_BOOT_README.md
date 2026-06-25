# ScholarBot Spring Boot Integration Blueprint

This guide explains how to connect your pure React frontend to a custom **Spring Boot** backend.

By default, the React app uses a client-side interceptor (`src/lib/mockApi.ts`) that intercepts `/api/*` queries and persists your data directly in your browser's `localStorage`. This makes the frontend fully operational out-of-the-box.

When you are ready to connect to your real Spring Boot server, simply disable or comment out the mock setup in `src/main.tsx` and run your Spring Boot application!

---

## 1. Disconnecting the Client Interceptor

To connect your React app to your real Spring Boot backend, open `src/main.tsx` and comment out the `setupMockApi()` call:

```typescript
// src/main.tsx
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
// import { setupMockApi } from './lib/mockApi.ts';

// Comment this line out when connecting to a real backend server:
// setupMockApi();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

---

## 2. Setting Up Spring Boot CORS & Proxying

Ensure your Spring Boot controllers are annotated with `@CrossOrigin` or configured globally for CORS to allow requests from your React development server (which runs on port `3000`).

Example global CORS configuration in Spring Boot:

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*");
            }
        };
    }
}
```

---

## 3. Spring Boot REST Controllers API Specification

Here are the exact endpoints that your React frontend uses, along with matching Spring Boot `@RestController` structures:

### 1. Authentication & Profiles
*   **POST** `/api/auth/login`
    *   **Payload**: `{ "email": "anya@scholarbot.com", "name": "Anya" }`
    *   **Response**: `UserProfile` object
*   **GET** `/api/profile/{userId}`
    *   **Response**: `UserProfile` object
*   **PUT** `/api/profile/{userId}`
    *   **Payload**: `UserProfile` updates
    *   **Response**: Updated `UserProfile`

```java
@RestController
@RequestMapping("/api")
public class AuthController {
    @PostMapping("/auth/login")
    public ResponseEntity<UserProfile> login(@RequestBody LoginRequest request) {
        // Find or create user profile by email
        return ResponseEntity.ok(userProfile);
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<UserProfile> getProfile(@PathVariable String userId) {
        return ResponseEntity.ok(userProfile);
    }
}
```

### 2. Focus Sessions
*   **GET** `/api/focus/sessions/{userId}`
    *   **Response**: Array of `FocusSession`
*   **POST** `/api/focus/sessions`
    *   **Payload**: `{ "userId": "...", "duration": 25, "category": "Mathematics", "notes": "Worked on integrals", "completed": true }`
    *   **Response**: `{ "session": FocusSession, "updatedUser": UserProfile }` (increments student XP/level)

```java
@RestController
@RequestMapping("/api")
public class FocusController {
    @GetMapping("/focus/sessions/{userId}")
    public List<FocusSession> getSessions(@PathVariable String userId) {
        return focusService.getSessions(userId);
    }

    @PostMapping("/focus/sessions")
    public FocusSessionResponse createSession(@RequestBody FocusSessionRequest request) {
        // 1. Save new focus session record
        // 2. Increment user XP (+duration * 1.5) and study points (+duration * 1.0)
        // 3. Increment streak if consistency requirements are met
        return new FocusSessionResponse(newSession, updatedUser);
    }
}
```

### 3. Syllabus Tracker
*   **GET** `/api/syllabus/{userId}`
    *   **Response**: Array of `SyllabusTopic`
*   **POST** `/api/syllabus`
    *   **Payload**: `{ "userId": "...", "subject": "Mathematics", "chapter": "Calculus", "topic": "Integration" }`
*   **PUT** `/api/syllabus/{topicId}`
    *   **Payload**: `{ "status": "in_progress" | "mastered" }`
*   **DELETE** `/api/syllabus/{topicId}`

```java
@RestController
@RequestMapping("/api/syllabus")
public class SyllabusController {
    @GetMapping("/{userId}")
    public List<SyllabusTopic> getSyllabus(@PathVariable String userId) { ... }

    @PostMapping
    public SyllabusTopic createTopic(@RequestBody SyllabusTopicRequest req) { ... }

    @PutMapping("/{id}")
    public SyllabusTopic updateTopic(@PathVariable String id, @RequestBody SyllabusTopicUpdate req) { ... }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTopic(@PathVariable String id) { ... }
}
```

### 4. Notes & Study Hub
*   **GET** `/api/notes/{userId}`
    *   **Response**: Array of `StudyNote`
*   **POST** `/api/notes`
*   **PUT** `/api/notes/{id}`
*   **DELETE** `/api/notes/{id}`
*   **POST** `/api/notes/{id}/ai-summarize`
    *   **Response**: Returns the updated `StudyNote` containing `summary` (markdown) and `flashcards` (array of `{ front, back }` questions).

### 5. Exam Planner
*   **GET** `/api/exams/{userId}`
*   **POST** `/api/exams`
*   **PUT** `/api/exams/{id}` (updating inline tasks checklist and `preparationLevel`)
*   **DELETE** `/api/exams/{id}`

### 6. Study Rooms
*   **GET** `/api/rooms` (returns list of active chat/study rooms)
*   **POST** `/api/rooms/{roomId}/join`
    *   **Payload**: `{ "userId": "...", "userName": "...", "avatar": "...", "xp": 1240 }`
*   **POST** `/api/rooms/{roomId}/chat`
    *   **Payload**: `{ "userName": "...", "text": "hello library!" }`

### 7. Leaderboards
*   **GET** `/api/leaderboards`
    *   **Response**: Array of globally registered scholars ordered descending by total `xp`.

### 8. AI ScholarBot Endpoints (Optional integrations with Gemini/OpenAI SDKs in Spring Boot)
*   **POST** `/api/ai/chat` (AI query-answering tutor interface)
*   **POST** `/api/ai/quiz` (generate customized MCQs for a given topic)
*   **POST** `/api/ai/softskills` (refining public speaking, admissions interview, or resilience scenario dialogues)

---

## 4. Packing and Exporting Your ZIP

To get your downloadable folder containing this entire pristine React frontend:
1. Open the **Settings** menu at the top-right of your AI Studio screen.
2. Select **Export as ZIP**.
3. You will receive a clean, compiled package containing the entire React client-only application, ready to run on any computer or connect to your Spring Boot backend!

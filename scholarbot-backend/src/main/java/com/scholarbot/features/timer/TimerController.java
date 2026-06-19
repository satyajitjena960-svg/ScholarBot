package com.scholarbot.features.timer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/timer")
public class TimerController {

    @Autowired
    private TimerService timerService;

    // Endpoint to log a completed study session
    // POST http://localhost:8080/api/timer/log?userId=1&title=Maths&duration=1500
    @PostMapping("/log")
    public ResponseEntity<Timer> logSession(
            @RequestParam Long userId,
            @RequestParam String title,
            @RequestParam Long duration) {

        Timer savedSession = timerService.logSession(userId, title, duration);
        return ResponseEntity.ok(savedSession);
    }

    // Endpoint to get a student's study logs
    // GET http://localhost:8080/api/timer/history/1
    @GetMapping("/history/{userId}")
    public ResponseEntity<List<Timer>> getHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(timerService.getUserHistory(userId));
    }
}

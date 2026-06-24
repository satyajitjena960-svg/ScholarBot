package com.scholarbot.features.notifications;

import com.scholarbot.config.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationRepository repository;

    @Autowired
    private JwtTokenProvider tokenProvider;

    private String getUsernameFromToken(String bearerToken) {
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            String token = bearerToken.substring(7);
            if (tokenProvider.validateToken(token)) {
                return tokenProvider.getUsernameFromJWT(token);
            }
        }
        return null;
    }

    // 1. FETCH ALL NOTIFICATIONS FOR USER
    @GetMapping
    public ResponseEntity<?> getNotifications(@RequestHeader("Authorization") String token) {
        String username = getUsernameFromToken(token);
        if (username == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized!");

        List<Notification> list = repository.findByUsernameOrderByCreatedAtDesc(username);
        return ResponseEntity.ok(list);
    }

    // 2. MARK A NOTIFICATION AS READ
    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        String username = getUsernameFromToken(token);
        if (username == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized!");

        Optional<Notification> notifOpt = repository.findById(id);
        if (notifOpt.isPresent() && notifOpt.get().getUsername().equals(username)) {
            Notification notification = notifOpt.get();
            notification.setRead(true);
            return ResponseEntity.ok(repository.save(notification));
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Notification not found.");
    }
}
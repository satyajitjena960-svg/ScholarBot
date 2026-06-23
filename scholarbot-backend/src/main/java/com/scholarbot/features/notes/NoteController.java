package com.scholarbot.features.notes;

import com.scholarbot.config.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "http://localhost:5173")
public class NoteController {

    @Autowired
    private NoteRepository noteRepository;

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

    @PostMapping
    public ResponseEntity<?> createNote(@RequestHeader("Authorization") String token, @RequestBody Note note) {
        String username = getUsernameFromToken(token);
        if (username == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized!");

        note.setUsername(username);
        return ResponseEntity.status(HttpStatus.CREATED).body(noteRepository.save(note));
    }

    @GetMapping
    public ResponseEntity<?> getAllNotes(@RequestHeader("Authorization") String token) {
        String username = getUsernameFromToken(token);
        if (username == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized!");

        List<Note> accessibleNotes = noteRepository.findByUsername(username);
        return ResponseEntity.ok(accessibleNotes);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchNotes(@RequestHeader("Authorization") String token, @RequestParam("query") String query) {
        String username = getUsernameFromToken(token);
        if (username == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized!");

        List<Note> results = noteRepository.searchNotes(username, query);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getNoteById(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        String username = getUsernameFromToken(token);
        if (username == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized!");

        Optional<Note> noteOpt = noteRepository.findById(id);
        if (noteOpt.isPresent() && noteOpt.get().getUsername().equals(username)) {
            return ResponseEntity.ok(noteOpt.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Note not found or access denied.");
    }

    // ✅ FIXED: Enforced JWT ownership verification to prevent cross-user note modifications
    @PutMapping("/{id}")
    public ResponseEntity<?> updateNote(
            @RequestHeader("Authorization") String token,
            @PathVariable Long id,
            @RequestBody Note updatedNoteDetails) {

        String username = getUsernameFromToken(token);
        if (username == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized!");

        return noteRepository.findById(id)
                .filter(note -> note.getUsername().equals(username))
                .map(note -> {
                    note.setTitle(updatedNoteDetails.getTitle());
                    note.setContent(updatedNoteDetails.getContent());
                    note.setIsPublic(updatedNoteDetails.getIsPublic());
                    noteRepository.save(note);
                    return ResponseEntity.ok().body("Note updated successfully.");
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Note not found or access denied."));
    }

    // ✅ FIXED: Enforced JWT ownership check to prevent unauthorized note deletions
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNote(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        String username = getUsernameFromToken(token);
        if (username == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized!");

        Optional<Note> noteOpt = noteRepository.findById(id);
        if (noteOpt.isPresent() && noteOpt.get().getUsername().equals(username)) {
            noteRepository.deleteById(id);
            return ResponseEntity.ok().body("Note deleted successfully.");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Note not found or access denied.");
    }
}

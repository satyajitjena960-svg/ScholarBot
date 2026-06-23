package com.scholarbot.features.notes;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByUsername(String username);

    // ✅ FIXED: Exposes only explicitly public global community entries
    List<Note> findByIsPublicTrue();

    @Query("SELECT n FROM Note n WHERE n.username = :username AND (LOWER(n.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(n.content) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Note> searchNotes(@Param("username") String username, @Param("keyword") String keyword);
}
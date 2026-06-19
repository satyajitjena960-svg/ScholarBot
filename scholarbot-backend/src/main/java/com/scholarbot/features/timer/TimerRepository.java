package com.scholarbot.features.timer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TimerRepository extends JpaRepository<Timer, Long> {
    // Custom query to find all timer logs for a specific user
    List<Timer> findByUserId(Long userId);
}

package com.scholarbot.features.timer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TimerService {

    @Autowired
    private TimerRepository timerRepository;

    // Save a completed timer session
    public Timer logSession(Long userId, String title, Long duration) {
        Timer timer = new Timer(userId, title, duration);
        return timerRepository.save(timer);
    }

    // Get history for a student
    public List<Timer> getUserHistory(Long userId) {
        return timerRepository.findByUserId(userId);
    }
}

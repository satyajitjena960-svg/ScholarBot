package com.scholarbot.backend.service;

import com.scholarbot.backend.model.User;
import com.scholarbot.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User loginOrRegister(String email, String name) {
        Optional<User> existingUser = userRepository.findByEmailIgnoreCase(email.trim());

        if (existingUser.isPresent()) {
            User user = existingUser.get();
            LocalDate today = LocalDate.now();
            LocalDate yesterday = today.minusDays(1);

            if (user.getLastStudyDate() != null) {
                if (user.getLastStudyDate().equals(yesterday)) {
                    user.setStreak(user.getStreak() + 1);
                } else if (!user.getLastStudyDate().equals(today)) {
                    user.setStreak(1);
                }
            }
            user.setLastStudyDate(today);
            return userRepository.save(user);
        }

        // Create a clean new user profile
        String id = "usr-" + UUID.randomUUID().toString().substring(0, 8);
        String finalName = (name != null && !name.trim().isEmpty()) ? name.trim() : email.split("@")[0];
        String avatarSeed = email.trim().toLowerCase();
        String avatarUrl = "https://api.dicebear.com/7.x/bottts/svg?seed=" + avatarSeed;

        // Use the empty constructor and assign variables explicitly to bypass initialization clashes
        User newUser = new User();
        newUser.setId(id);
        newUser.setName(finalName);
        newUser.setEmail(email.trim().toLowerCase());
        newUser.setAvatar(avatarUrl);
        newUser.setLevel(1);
        newUser.setXp(0);
        newUser.setStudyPoints(0);
        newUser.setStreak(1);
        newUser.setLastStudyDate(LocalDate.now());
        newUser.setTargetHours(4);
        newUser.setCategoryTargetsJson("{\"Mathematics\":60,\"Physics\":60,\"Computer Science\":60,\"Language\":30,\"Other\":30}");

        return userRepository.save(newUser);
    }

    public Optional<User> findById(String userId) {
        return userRepository.findById(userId);
    }

    public User save(User user) {
        return userRepository.save(user);
    }
}

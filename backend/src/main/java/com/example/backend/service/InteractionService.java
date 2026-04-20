package com.example.backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.backend.entity.UserInteraction;
import com.example.backend.repository.UserInteractionRepository;

@Service
public class InteractionService {
    private final UserInteractionRepository repo;

    public InteractionService(UserInteractionRepository repo) {
        this.repo = repo;
    }

    public List<Map<String, Object>> getInteractions(Long userId) {
        if (userId == null) {
            return List.of();
        }

        List<UserInteraction> userData = repo.findByUserId(userId);
        List<Map<String, Object>> events = new ArrayList<>();

        for (UserInteraction interaction : userData) {
            if (interaction == null || interaction.getUserId() == null) {
                continue;
            }
            events.add(toEvent(interaction));
        }

        return events;
    }

    public List<Map<String, Object>> getAllInteractions() {
        List<UserInteraction> allData = repo.findAll();
        List<Map<String, Object>> events = new ArrayList<>();
        for (UserInteraction interaction : allData) {
            if (interaction == null || interaction.getUserId() == null) {
                continue;
            }
            events.add(toEvent(interaction));
        }
        return events;
    }

    public List<String> getHistoryLocationIds(Long userId) {
        if (userId == null) {
            return List.of();
        }

        List<UserInteraction> userData = repo.findByUserId(userId);
        List<String> locationIds = new ArrayList<>();

        for (UserInteraction interaction : userData) {
            if (interaction == null) {
                continue;
            }
            if (interaction.getLocationId() != null) {
                locationIds.add(interaction.getLocationId().toString());
            }
        }

        return locationIds;
    }

    private Map<String, Object> toEvent(UserInteraction interaction) {
        Map<String, Object> event = Map.of(
            "user_id", interaction.getUserId(),
            "event_type", interaction.getEventType() == null ? "view" : interaction.getEventType(),
            "value", interaction.getValue() == null ? 1.0 : interaction.getValue()
        );

        if (interaction.getLocationId() != null) {
            return Map.of(
                "user_id", interaction.getUserId(),
                "location_id", interaction.getLocationId(),
                "event_type", interaction.getEventType() == null ? "view" : interaction.getEventType(),
                "value", interaction.getValue() == null ? 1.0 : interaction.getValue()
            );
        }

        return event;
    }
}

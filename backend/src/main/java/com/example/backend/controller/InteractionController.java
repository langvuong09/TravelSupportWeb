package com.example.backend.controller;

import com.example.backend.entity.UserInteraction;
import com.example.backend.repository.UserInteractionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/interactions")
@RequiredArgsConstructor
public class InteractionController {

    private final UserInteractionRepository interactionRepository;

    @PostMapping("/log")
    public ResponseEntity<?> logInteraction(@RequestBody Map<String, Object> payload) {
        try {
            UserInteraction interaction = new UserInteraction();
            interaction.setUserId(Long.parseLong(payload.get("user_id").toString()));
            interaction.setLocationId(Integer.parseInt(payload.get("location_id").toString()));
            interaction.setEventType(payload.get("event_type").toString());
            
            // Trọng số mặc định: view=0.3, click=0.6, booking=1.0 (Khớp với AI Logic)
            double value = switch (interaction.getEventType()) {
                case "click" -> 0.6;
                case "booking" -> 1.0;
                default -> 0.3; // view
            };
            interaction.setValue(value);
            
            interactionRepository.save(interaction);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}

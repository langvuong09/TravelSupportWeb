package com.example.backend.controller;

import com.example.backend.entity.Booking;
import com.example.backend.service.BookingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public Booking create(@RequestBody Map<String, Object> payload) {
        Long userId = Long.valueOf(payload.get("userId").toString());
        String tourId = payload.get("tourId").toString();
        Integer numberOfPeople = Integer.valueOf(payload.get("numberOfPeople").toString());
        String fullName = payload.get("fullName") != null ? payload.get("fullName").toString() : "";
        String phone = payload.get("phone") != null ? payload.get("phone").toString() : "";
        String email = payload.get("email") != null ? payload.get("email").toString() : "";

        return bookingService.createBooking(userId, tourId, numberOfPeople, fullName, phone, email);
    }

    @GetMapping("/my-bookings/{userId}")
    public List<Booking> getMyBookings(@PathVariable Long userId) {
        return bookingService.getUserBookings(userId);
    }

    @GetMapping
    public List<Booking> all() {
        return bookingService.getAllBookings();
    }

    @PutMapping("/{id}/status")
    public Booking updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        return bookingService.updateBookingStatus(id, payload.get("status"));
    }
}

package com.example.backend.service;

import com.example.backend.entity.Booking;
import com.example.backend.entity.Tour;
import com.example.backend.entity.User;
import com.example.backend.repository.BookingRepository;
import com.example.backend.repository.TourRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class BookingService {
    private final BookingRepository bookingRepository;
    private final TourRepository tourRepository;
    private final UserRepository userRepository;

    public BookingService(BookingRepository bookingRepository, TourRepository tourRepository, UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.tourRepository = tourRepository;
        this.userRepository = userRepository;
    }

    public Booking createBooking(Long userId, String tourId, Integer numberOfPeople, String fullName, String phone, String email) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new RuntimeException("Tour not found"));

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setTour(tour);
        booking.setBookingDate(Instant.now());
        booking.setStatus("SUCCESSFUL");
        booking.setNumberOfPeople(numberOfPeople);
        booking.setFullName(fullName);
        booking.setPhone(phone);
        booking.setEmail(email);
        
        // Calculate total price if price exists
        if (tour.getPrice() != null) {
            booking.setTotalPrice((double) tour.getPrice() * numberOfPeople);
        } else {
            booking.setTotalPrice(0.0);
        }

        return bookingRepository.save(booking);
    }

    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUser_UserIdOrderByBookingDateDesc(userId);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking updateBookingStatus(Long bookingId, String status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(status);
        return bookingRepository.save(booking);
    }
}

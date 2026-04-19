package com.example.backend.repository;

import com.example.backend.entity.Booking;
import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUser(User user);
    List<Booking> findByUser_UserIdOrderByBookingDateDesc(Long userId);
}

package com.example.backend.scheduler;

import com.example.backend.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AIScheduler {

    private final RecommendationService recommendationService;

    /**
     * Cấu hình thời gian chạy tự động (Cron Expression):
     * Cấu trúc: "Giây Phút Giờ Ngày Tháng Thứ"
     * 
     * Các ví dụ phổ biến:
     * - "0 * * * * *"     : Chạy mỗi phút 1 lần (Dùng để DEMO)
     * - "0/30 * * * * *"  : Chạy mỗi 30 giây 1 lần (Dùng để DEMO)
     * - "0 0 2 * * *"     : Chạy vào 2:00 sáng mỗi ngày (Dùng cho PRODUCTION)
     * - "0 0 0 * * MON"   : Chạy vào nửa đêm mỗi thứ Hai hàng tuần
     */
    @Scheduled(cron = "0/30 * * * * *")
    public void autoTrainAI() {
        log.info("Bắt đầu tiến trình tự động huấn luyện AI và NLP định kỳ...");
        try {
            // 1. Huấn luyện Collaborative Filtering (ALS)
            recommendationService.trainAIModel();
            
            // 2. Huấn luyện NLP Intent
            recommendationService.trainNLPModel();
            
            log.info("Tự động huấn luyện AI và NLP hoàn tất thành công.");
        } catch (Exception e) {
            log.error("Lỗi khi tự động huấn luyện AI/NLP: {}", e.getMessage());
        }
    }
}

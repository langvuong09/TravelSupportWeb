package com.example.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;

@SpringBootApplication
@EnableScheduling
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner dataLoader(UserRepository repo) {
		return args -> {
			if (repo.count() == 0) {
				User admin = new User();
				admin.setUsername("admin");
				admin.setPassword("admin");
				admin.setRole("ADMIN");
				repo.save(admin);
				System.out.println("Inserted default user admin / admin");
			}
		};
	}

}

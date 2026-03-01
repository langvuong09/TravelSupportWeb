package com.example.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner dataLoader(UserRepository repo) {
		return args -> {
			if (repo.count() == 0) {
				repo.save(new User("admin", "admin"));
				System.out.println("Inserted default user admin / admin");
			}
		};
	}

}

package com.ecocycle;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class EcoCycleApplication {

    public static void main(String[] args) {
        SpringApplication.run(EcoCycleApplication.class, args);
        System.out.println("==================================================");
        System.out.println("🌱 EcoCycle Spring Boot REST API is running!     ");
        System.out.println("🌐 Server URL: http://localhost:8080             ");
        System.out.println("🗄️ H2 Database Console: http://localhost:8080/h2-console ");
        System.out.println("📊 Actuator Metrics: http://localhost:8080/actuator/health");
        System.out.println("==================================================");
    }
}

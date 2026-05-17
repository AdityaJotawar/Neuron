package com.neuron.bff;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

/**
 * Main Spring Boot application class for the BFF (Backend for Frontend)
 * service.
 * 
 * This service acts as an API gateway and aggregation layer for the Neuron
 * platform,
 * providing consolidated endpoints for dashboard, accounts, transactions,
 * budgets,
 * and investment data.
 */
@SpringBootApplication
@ComponentScan(basePackages = "com.neuron.bff")
public class BffApplication {

    public static void main(String[] args) {
        SpringApplication.run(BffApplication.class, args);
    }
}

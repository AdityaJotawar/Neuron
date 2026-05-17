package com.neuron.bff.controller;

import com.neuron.bff.model.ApiResponse;
import com.neuron.bff.model.DashboardStats;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller for dashboard-related endpoints.
 * Provides aggregated financial statistics and overview data.
 */
@Slf4j
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    /**
     * Get dashboard statistics for the current user.
     * 
     * @return ApiResponse containing DashboardStats
     */
    @GetMapping
    public ResponseEntity<ApiResponse<DashboardStats>> getDashboardStats() {
        log.debug("Fetching dashboard statistics");

        DashboardStats stats = DashboardStats.builder()
                .totalBalance(125000.00)
                .monthlyIncome(8500.00)
                .monthlyExpenses(5200.00)
                .savingsRate(38.8)
                .investmentValue(45000.00)
                .recentTransactions(5)
                .build();

        ApiResponse<DashboardStats> response = ApiResponse.success(stats);
        return ResponseEntity.ok(response);
    }
}

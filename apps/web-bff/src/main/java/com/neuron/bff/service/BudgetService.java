package com.neuron.bff.service;

import com.neuron.bff.model.Budget;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service for budget-related business logic.
 */
@Service
public class BudgetService {

    /**
     * Get all budgets with optional filtering.
     * 
     * @param category Filter by budget category
     * @param month    Filter by month
     * @return List of budgets matching filters
     */
    public List<Budget> getBudgets(String category, String month) {
        // TODO: Implement actual data retrieval
        return List.of(
                Budget.builder()
                        .id("budget-001")
                        .name("Monthly Groceries")
                        .category("Groceries")
                        .limit(500.00)
                        .spent(325.50)
                        .remaining(174.50)
                        .period("monthly")
                        .startDate("2026-02-01")
                        .endDate("2026-02-28")
                        .build(),
                Budget.builder()
                        .id("budget-002")
                        .name("Entertainment")
                        .category("Entertainment")
                        .limit(150.00)
                        .spent(89.99)
                        .remaining(60.01)
                        .period("monthly")
                        .startDate("2026-02-01")
                        .endDate("2026-02-28")
                        .build());
    }

    /**
     * Get budget by ID.
     * 
     * @param id Budget ID
     * @return Budget object
     */
    public Budget getBudgetById(String id) {
        // TODO: Implement actual data retrieval
        return Budget.builder()
                .id(id)
                .name("Monthly Groceries")
                .category("Groceries")
                .limit(500.00)
                .spent(325.50)
                .remaining(174.50)
                .period("monthly")
                .startDate("2026-02-01")
                .endDate("2026-02-28")
                .build();
    }
}

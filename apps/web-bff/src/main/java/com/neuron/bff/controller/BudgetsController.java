package com.neuron.bff.controller;

import com.neuron.bff.model.ApiResponse;
import com.neuron.bff.model.Budget;
import com.neuron.bff.service.BudgetService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for budget-related endpoints.
 * Provides budget listing, detail retrieval, and filtering.
 */
@Slf4j
@RestController
@RequestMapping("/api/budgets")
public class BudgetsController {

    private final BudgetService budgetService;

    public BudgetsController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    /**
     * Get all budgets for the current user.
     * Supports filtering via query parameters.
     * 
     * @param category Filter by budget category
     * @param month    Filter by month (YYYY-MM)
     * @return ApiResponse containing list of Budget
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Budget>>> getBudgets(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String month) {

        log.debug("Fetching budgets with category={}, month={}", category, month);

        List<Budget> budgets = budgetService.getBudgets(category, month);
        ApiResponse<List<Budget>> response = ApiResponse.success(budgets);
        return ResponseEntity.ok(response);
    }

    /**
     * Get a specific budget by ID.
     * 
     * @param id Budget ID
     * @return ApiResponse containing Budget
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Budget>> getBudget(@PathVariable String id) {
        log.debug("Fetching budget with id={}", id);

        Budget budget = budgetService.getBudgetById(id);
        ApiResponse<Budget> response = ApiResponse.success(budget);
        return ResponseEntity.ok(response);
    }
}

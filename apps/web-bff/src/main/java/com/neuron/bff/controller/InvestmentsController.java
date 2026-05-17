package com.neuron.bff.controller;

import com.neuron.bff.model.ApiResponse;
import com.neuron.bff.model.Investment;
import com.neuron.bff.model.PortfolioStats;
import com.neuron.bff.service.InvestmentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for investment-related endpoints.
 * Provides investment listing, portfolio statistics, and detail retrieval.
 */
@Slf4j
@RestController
@RequestMapping("/api/investments")
public class InvestmentsController {

    private final InvestmentService investmentService;

    public InvestmentsController(InvestmentService investmentService) {
        this.investmentService = investmentService;
    }

    /**
     * Get all investments for the current user.
     * 
     * @return ApiResponse containing list of Investment
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Investment>>> getInvestments() {
        log.debug("Fetching investments");

        List<Investment> investments = investmentService.getInvestments();
        ApiResponse<List<Investment>> response = ApiResponse.success(investments);
        return ResponseEntity.ok(response);
    }

    /**
     * Get a specific investment by ID.
     * 
     * @param id Investment ID
     * @return ApiResponse containing Investment
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Investment>> getInvestment(@PathVariable String id) {
        log.debug("Fetching investment with id={}", id);

        Investment investment = investmentService.getInvestmentById(id);
        ApiResponse<Investment> response = ApiResponse.success(investment);
        return ResponseEntity.ok(response);
    }

    /**
     * Get portfolio statistics.
     * 
     * @return ApiResponse containing PortfolioStats
     */
    @GetMapping("/portfolio-stats")
    public ResponseEntity<ApiResponse<PortfolioStats>> getPortfolioStats() {
        log.debug("Fetching portfolio statistics");

        PortfolioStats stats = investmentService.getPortfolioStats();
        ApiResponse<PortfolioStats> response = ApiResponse.success(stats);
        return ResponseEntity.ok(response);
    }
}

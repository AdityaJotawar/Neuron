package com.neuron.bff.controller;

import com.neuron.bff.model.ApiResponse;
import com.neuron.bff.model.Transaction;
import com.neuron.bff.service.TransactionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for transaction-related endpoints.
 * Provides transaction listing, detail retrieval, and filtering.
 */
@Slf4j
@RestController
@RequestMapping("/api/transactions")
public class TransactionsController {

    private final TransactionService transactionService;

    public TransactionsController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    /**
     * Get all transactions for the current user.
     * Supports filtering by accountId, category, and date range via query
     * parameters.
     * 
     * @param accountId Filter by account ID
     * @param category  Filter by transaction category
     * @param startDate Start date filter (ISO 8601)
     * @param endDate   End date filter (ISO 8601)
     * @return ApiResponse containing list of Transaction
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Transaction>>> getTransactions(
            @RequestParam(required = false) String accountId,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {

        log.debug("Fetching transactions with accountId={}, category={}, startDate={}, endDate={}",
                accountId, category, startDate, endDate);

        List<Transaction> transactions = transactionService.getTransactions(accountId, category, startDate, endDate);
        ApiResponse<List<Transaction>> response = ApiResponse.success(transactions);
        return ResponseEntity.ok(response);
    }

    /**
     * Get a specific transaction by ID.
     * 
     * @param id Transaction ID
     * @return ApiResponse containing Transaction
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Transaction>> getTransaction(@PathVariable String id) {
        log.debug("Fetching transaction with id={}", id);

        Transaction transaction = transactionService.getTransactionById(id);
        ApiResponse<Transaction> response = ApiResponse.success(transaction);
        return ResponseEntity.ok(response);
    }
}

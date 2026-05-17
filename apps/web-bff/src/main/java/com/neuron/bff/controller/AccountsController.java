package com.neuron.bff.controller;

import com.neuron.bff.model.ApiResponse;
import com.neuron.bff.model.Account;
import com.neuron.bff.service.AccountService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for account-related endpoints.
 * Provides account listing, detail retrieval, and filtering.
 */
@Slf4j
@RestController
@RequestMapping("/api/accounts")
public class AccountsController {

    private final AccountService accountService;

    public AccountsController(AccountService accountService) {
        this.accountService = accountService;
    }

    /**
     * Get all accounts for the current user.
     * Supports filtering by type and status via query parameters.
     * 
     * @param type   Account type filter (checking, savings, credit, investment)
     * @param status Account status filter (active, closed)
     * @return ApiResponse containing list of Account
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Account>>> getAccounts(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status) {

        log.debug("Fetching accounts with type={}, status={}", type, status);

        List<Account> accounts = accountService.getAccounts(type, status);
        ApiResponse<List<Account>> response = ApiResponse.success(accounts);
        return ResponseEntity.ok(response);
    }

    /**
     * Get a specific account by ID.
     * 
     * @param id Account ID
     * @return ApiResponse containing Account
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Account>> getAccount(@PathVariable String id) {
        log.debug("Fetching account with id={}", id);

        Account account = accountService.getAccountById(id);
        ApiResponse<Account> response = ApiResponse.success(account);
        return ResponseEntity.ok(response);
    }
}

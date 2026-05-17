package com.neuron.bff.service;

import com.neuron.bff.model.Account;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for account-related business logic.
 */
@Service
public class AccountService {

    /**
     * Get all accounts with optional filtering.
     * 
     * @param type   Account type filter
     * @param status Account status filter
     * @return List of accounts matching filters
     */
    public List<Account> getAccounts(String type, String status) {
        // TODO: Implement actual data retrieval
        return List.of(
                Account.builder()
                        .id("acc-001")
                        .name("Primary Checking")
                        .type("checking")
                        .status("active")
                        .balance(5200.00)
                        .availableBalance(5200.00)
                        .currency("USD")
                        .institutionName("Neuron Bank")
                        .lastFourDigits("1234")
                        .build(),
                Account.builder()
                        .id("acc-002")
                        .name("Savings Account")
                        .type("savings")
                        .status("active")
                        .balance(25000.00)
                        .availableBalance(25000.00)
                        .currency("USD")
                        .institutionName("Neuron Bank")
                        .lastFourDigits("5678")
                        .build());
    }

    /**
     * Get account by ID.
     * 
     * @param id Account ID
     * @return Account object
     */
    public Account getAccountById(String id) {
        // TODO: Implement actual data retrieval
        return Account.builder()
                .id(id)
                .name("Primary Checking")
                .type("checking")
                .status("active")
                .balance(5200.00)
                .availableBalance(5200.00)
                .currency("USD")
                .institutionName("Neuron Bank")
                .lastFourDigits("1234")
                .build();
    }
}

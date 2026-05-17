package com.neuron.bff.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Transaction model representing a financial transaction.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

    private String id;
    private String accountId;
    private String description;
    private String category;
    private Double amount;
    private String type; // debit, credit
    private String status; // pending, completed, failed
    private String date;
    private String createdAt;
    private String merchantName;
    private String merchantCategoryCode;
    private String referenceNumber;
}

package com.neuron.bff.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Account model representing a financial account.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Account {

    private String id;
    private String name;
    private String type; // checking, savings, credit, investment
    private String status; // active, closed
    private Double balance;
    private Double availableBalance;
    private String currency;
    private String institutionName;
    private String lastFourDigits;
    private String createdAt;
    private String updatedAt;
}

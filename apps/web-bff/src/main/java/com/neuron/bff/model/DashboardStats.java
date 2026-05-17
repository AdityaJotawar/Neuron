package com.neuron.bff.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Dashboard statistics model.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {

    private Double totalBalance;
    private Double monthlyIncome;
    private Double monthlyExpenses;
    private Double savingsRate;
    private Double investmentValue;
    private Integer recentTransactions;
}

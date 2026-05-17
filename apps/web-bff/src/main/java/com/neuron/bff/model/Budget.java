package com.neuron.bff.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Budget model representing a budget plan.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Budget {

    private String id;
    private String name;
    private String category;
    private Double limit;
    private Double spent;
    private Double remaining;
    private String period; // monthly, weekly, yearly
    private String startDate;
    private String endDate;
    private String createdAt;
    private String updatedAt;
}

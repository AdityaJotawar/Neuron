package com.neuron.bff.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Investment model representing an investment holding.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Investment {

    private String id;
    private String symbol;
    private String name;
    private String type; // stock, bond, mutual-fund, etf, crypto
    private Integer quantity;
    private Double purchasePrice;
    private Double currentPrice;
    private Double marketValue;
    private Double gainLoss;
    private Double gainLossPercent;
    private String lastUpdated;
}

package com.neuron.bff.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Portfolio statistics model.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PortfolioStats {

    private Double totalValue;
    private Double totalCostBasis;
    private Double totalGainLoss;
    private Double totalGainLossPercent;
    private Double dayChange;
    private Double dayChangePercent;
    private Integer holdingCount;
    private List<Investment> topPerformers;
    private List<Investment> bottomPerformers;
}

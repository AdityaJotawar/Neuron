package com.neuron.bff.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Error information for API responses.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorInfo {

    private String code;
    private String message;
    private String details;
}

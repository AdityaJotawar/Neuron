package com.neuron.bff.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Standardized API response wrapper.
 * 
 * @param <T> The data type contained in the response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {

    private boolean success;
    private String message;
    private T data;
    private ErrorInfo error;

    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .data(data)
                .build();
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .build();
    }

    public static <T> ApiResponse<T> failure(String message) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .error(ErrorInfo.builder().message(message).build())
                .build();
    }

    public static <T> ApiResponse<T> failure(String message, String code) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .error(ErrorInfo.builder().message(message).code(code).build())
                .build();
    }
}

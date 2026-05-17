package com.tejas.url_shortner.dto.response;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder

public class ErrorResponse {
    private String message;
    private int status;
    private LocalDateTime timestamp;
}

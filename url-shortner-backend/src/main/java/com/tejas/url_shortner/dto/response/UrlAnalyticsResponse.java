package com.tejas.url_shortner.dto.response;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UrlAnalyticsResponse {

    private String originalUrl;
    private String shortUrl;
    private Long clickCount;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
}
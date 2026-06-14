package com.tejas.url_shortner.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tejas.url_shortner.dto.response.ErrorResponse;
import com.tejas.url_shortner.exception.RateLimitExceededException;
import com.tejas.url_shortner.service.RateLimiterService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class RateLimitFilter extends OncePerRequestFilter {

    private final RateLimiterService rateLimiterService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String ipAddress = request.getRemoteAddr();

        try {

            rateLimiterService.validateRateLimit(ipAddress);

            filterChain.doFilter(request, response);

        } catch (RateLimitExceededException ex) {

            ErrorResponse error = ErrorResponse.builder()
                    .status(HttpStatus.TOO_MANY_REQUESTS.value())
                    .message(ex.getMessage())
                    .timestamp(LocalDateTime.now())
                    .build();

            response.setStatus(
                    HttpStatus.TOO_MANY_REQUESTS.value()
            );

            response.setContentType(
                    "application/json"
            );

            new ObjectMapper().writeValue(
                    response.getWriter(),
                    error
            );
        }
    }
}
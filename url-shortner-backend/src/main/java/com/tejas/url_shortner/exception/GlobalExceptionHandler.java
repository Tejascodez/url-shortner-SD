package com.tejas.url_shortner.exception;


import java.time.LocalDateTime;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.tejas.url_shortner.dto.response.ErrorResponse;

@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(UrlNotFoundException.class)
        public ResponseEntity<ErrorResponse> handleNotFound(UrlNotFoundException ex){

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ErrorResponse.builder().message(ex.getMessage()).status(HttpStatus.NOT_FOUND.value()).timestamp(LocalDateTime.now()).build());
        }


        @ExceptionHandler(UrlExpiredException.class)
        public ResponseEntity<ErrorResponse> handleExpired(UrlExpiredException ex) {
            return ResponseEntity.status(HttpStatus.GONE).body(ErrorResponse.builder().message(ex.getMessage()).status(HttpStatus.GONE.value()).timestamp(LocalDateTime.now()).build());
        }

        @ExceptionHandler(UrlInactiveException.class)
        public ResponseEntity<ErrorResponse> handleInactive(UrlInactiveException ex){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ErrorResponse.builder().message(ex.getMessage()).status(HttpStatus.BAD_REQUEST.value()).timestamp(LocalDateTime.now()).build());
        }

        @ExceptionHandler(RateLimitExceededException.class)
        public ResponseEntity<ErrorResponse> handleRateLimit(RateLimitExceededException ex){
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(ErrorResponse.builder().message(ex.getMessage()).status(HttpStatus.TOO_MANY_REQUESTS.value()).timestamp(LocalDateTime.now()).build());
        }
    }




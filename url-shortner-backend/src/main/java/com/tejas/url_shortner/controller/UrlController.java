package com.tejas.url_shortner.controller;

import java.net.URI;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tejas.url_shortner.dto.request.ShortenRequest;
import com.tejas.url_shortner.dto.response.ShortenResponse;
import com.tejas.url_shortner.dto.response.UrlAnalyticsResponse;
import com.tejas.url_shortner.entity.Url;
import com.tejas.url_shortner.service.UrlService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequiredArgsConstructor
public class UrlController {

    private final UrlService urlService;

    // CREATE SHORT URL
    @PostMapping("/api/url/shorten")
    public ResponseEntity<ShortenResponse> shortenUrl(
            @Valid @RequestBody ShortenRequest request
    ) {

        ShortenResponse response =
                urlService.shortenUrl(request);

        return ResponseEntity.ok(response);
    }

    // REDIRECT TO ORIGINAL URL
    @GetMapping("/{shortCode}")
    public ResponseEntity<Void> redirect(
            @PathVariable String shortCode
    ) {

        String originalUrl =
                urlService.redirect(shortCode);

        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(originalUrl))
                .build();
    }

    // GET URL ANALYTICS
    @GetMapping("/api/url/{shortCode}/analytics")
    public ResponseEntity<UrlAnalyticsResponse> getAnalytics(
            @PathVariable String shortCode
    ) {

        UrlAnalyticsResponse response =
                urlService.getAnalytics(shortCode);

        return ResponseEntity.ok(response);
    }

    // GET LOGGED-IN USER URLS
    @GetMapping("/api/url/my-urls")
    public ResponseEntity<List<Url>> getMyUrls() {

        return ResponseEntity.ok(
                urlService.getMyUrls()
        );
    }
}
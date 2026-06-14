package com.tejas.url_shortner.service.impl;

import com.tejas.url_shortner.dto.request.ShortenRequest;
import com.tejas.url_shortner.dto.response.ShortenResponse;
import com.tejas.url_shortner.dto.response.UrlAnalyticsResponse;
import com.tejas.url_shortner.entity.Url;
import com.tejas.url_shortner.entity.User;
import com.tejas.url_shortner.exception.UrlExpiredException;
import com.tejas.url_shortner.exception.UrlInactiveException;
import com.tejas.url_shortner.exception.UrlNotFoundException;
import com.tejas.url_shortner.repository.UrlRepository;
import com.tejas.url_shortner.repository.UserRepository;
import com.tejas.url_shortner.service.UrlService;
import com.tejas.url_shortner.service.hashing.HashingStrategy;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UrlServiceImpl implements UrlService {

    private final UrlRepository urlRepository;
    private final UserRepository userRepository;
    private final HashingStrategy hashingStrategy;
    private final RedisTemplate<String, String> redisTemplate;

    private User getCurrentUser() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        System.out.println("CURRENT USER = " + email);

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }
    @Override
    public ShortenResponse shortenUrl(ShortenRequest request) {

        String shortCode =
                hashingStrategy.generate(
                        request.getOriginalUrl()
                );

        User currentUser = getCurrentUser();

        Url url = Url.builder()
                .originalUrl(request.getOriginalUrl())
                .shortCode(shortCode)
                .expiresAt(LocalDateTime.now().plusDays(30))
                .user(currentUser)
                .build();

        urlRepository.save(url);

        return ShortenResponse.builder()
                .shortUrl(
                        "http://localhost:8080/" + shortCode
                )
                .build();
    }

    @Override
    public String redirect(String shortCode) {

        String cachedUrl =
                redisTemplate.opsForValue().get(shortCode);

        Url url = urlRepository
                .findByShortCode(shortCode)
                .orElseThrow(() ->
                        new UrlNotFoundException(
                                "URL not found"
                        ));

        if (!url.isActive()) {
            throw new UrlInactiveException(
                    "URL is inactive"
            );
        }

        if (url.getExpiresAt() != null &&
                url.getExpiresAt()
                        .isBefore(LocalDateTime.now())) {

            throw new UrlExpiredException(
                    "URL has expired"
            );
        }

        url.setClickCount(
                url.getClickCount() + 1
        );

        urlRepository.save(url);

        if (cachedUrl == null) {

            System.out.println("CACHE MISS");

            redisTemplate.opsForValue().set(
                    shortCode,
                    url.getOriginalUrl(),
                    Duration.ofHours(24)
            );

            return url.getOriginalUrl();
        }

        System.out.println("CACHE HIT");

        return cachedUrl;
    }

    @Override
    public UrlAnalyticsResponse getAnalytics(String shortCode) {

        Url url = urlRepository
                .findByShortCode(shortCode)
                .orElseThrow(() ->
                        new UrlNotFoundException("URL not found")
                );

        User currentUser = getCurrentUser();

        if (!url.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Access Denied");
        }

        return UrlAnalyticsResponse.builder()
                .originalUrl(url.getOriginalUrl())
                .shortUrl("http://localhost:8080/" + shortCode)
                .clickCount(url.getClickCount())
                .active(url.isActive())
                .createdAt(url.getCreatedAt())
                .expiresAt(url.getExpiresAt())
                .build();
    }
    @Override
    public List<Url> getMyUrls() {

        User currentUser = getCurrentUser();

        return urlRepository.findByUser(
                currentUser
        );
    }
}
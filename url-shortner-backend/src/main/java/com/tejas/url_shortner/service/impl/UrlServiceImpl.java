package com.tejas.url_shortner.service.impl;
import java.time.Duration;
import java.time.LocalDateTime;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import com.tejas.url_shortner.dto.request.ShortenRequest;
import com.tejas.url_shortner.dto.response.ShortenResponse;
import com.tejas.url_shortner.entity.Url;
import com.tejas.url_shortner.exception.UrlExpiredException;
import com.tejas.url_shortner.exception.UrlInactiveException;
import com.tejas.url_shortner.exception.UrlNotFoundException;
import com.tejas.url_shortner.repository.UrlRepository;
import com.tejas.url_shortner.service.UrlService;
import com.tejas.url_shortner.service.hashing.HashingStrategy;

import lombok.RequiredArgsConstructor;
import com.tejas.url_shortner.dto.response.UrlAnalyticsResponse;


@Service
@RequiredArgsConstructor
public class UrlServiceImpl implements UrlService{
    private final UrlRepository urlRepository;
    private final HashingStrategy hashingStrategy;
    private final RedisTemplate<String, String> redisTemplate;

    @Override
    public ShortenResponse shortenUrl(ShortenRequest request){
        String shortCode = hashingStrategy.generate(request.getOriginalUrl());


        Url url = Url.builder().originalUrl(request.getOriginalUrl()).shortCode(shortCode).expiresAt(LocalDateTime.now().plusDays(30)).build();

        urlRepository.save(url);


        return ShortenResponse.builder().shortUrl("http://localhost:8080/"+ shortCode).build();
    }

@Override
public String redirect(String shortCode) {

    // CHECK CACHE
    String cachedUrl =
            redisTemplate.opsForValue().get(shortCode);

    // FETCH FROM DATABASE
    Url url = urlRepository.findByShortCode(shortCode)
            .orElseThrow(() ->
                    new UrlNotFoundException("URL not found"));

    // VALIDATE ACTIVE STATUS
    if (!url.isActive()) {

        throw new UrlInactiveException(
                "URL is inactive"
        );
    }

    // VALIDATE EXPIRATION
    if (url.getExpiresAt() != null &&
            url.getExpiresAt()
                    .isBefore(LocalDateTime.now())) {

        throw new UrlExpiredException(
                "URL has expired"
        );
    }

    // INCREMENT CLICK COUNT
    url.setClickCount(
            url.getClickCount() + 1
    );

    urlRepository.save(url);

    // CACHE MISS
    if (cachedUrl == null) {

        System.out.println("CACHE MISS");

        redisTemplate.opsForValue().set(
                shortCode,
                url.getOriginalUrl(),
                Duration.ofHours(24)
        );

        return url.getOriginalUrl();
    }

    // CACHE HIT
    System.out.println("CACHE HIT");

    return cachedUrl;
}
@Override
public UrlAnalyticsResponse getAnalytics(
        String shortCode
) {

    Url url = urlRepository
            .findByShortCode(shortCode)
            .orElseThrow(() ->
                    new UrlNotFoundException(
                            "URL not found"
                    )
            );

    return UrlAnalyticsResponse.builder()
            .originalUrl(url.getOriginalUrl())
            .shortUrl(
                    "http://localhost:8080/" + shortCode
            )
            .clickCount(url.getClickCount())
            .active(url.isActive())
            .createdAt(url.getCreatedAt())
            .expiresAt(url.getExpiresAt())
            .build();
}
}
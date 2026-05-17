package com.tejas.url_shortner.service;

import java.time.Duration;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.tejas.url_shortner.exception.RateLimitExceededException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RateLimiterService {
    private final RedisTemplate<String, String> redisTemplate;
   private static final int MAX_REQUESTS = 10;

   public void validateRateLimit(String ipAddress){
    String key = "rate_limit:" + ipAddress;

    Long count = redisTemplate.opsForValue().increment(key);

    if(count != null && count ==1){
        redisTemplate.expire(key,Duration.ofMinutes(1));
    }

    if(count != null && count > MAX_REQUESTS){
        throw new RateLimitExceededException("To many requests. Try again later");
    }
   }
}

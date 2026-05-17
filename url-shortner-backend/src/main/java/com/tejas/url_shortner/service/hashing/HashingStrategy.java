package com.tejas.url_shortner.service.hashing;

public interface HashingStrategy {
    String generate(String originalUrl);
}

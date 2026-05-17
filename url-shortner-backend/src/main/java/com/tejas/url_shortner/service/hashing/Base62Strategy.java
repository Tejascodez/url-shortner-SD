package com.tejas.url_shortner.service.hashing;

import java.security.SecureRandom;

import org.springframework.stereotype.Component;

import com.tejas.url_shortner.repository.UrlRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class Base62Strategy implements HashingStrategy {

    private static final String BASE62 =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    private static final int SHORT_CODE_LENGTH = 6;

    private final UrlRepository urlRepository;

    private final SecureRandom random = new SecureRandom();

    @Override
    public String generate(String originalUrl) {

        String shortCode;

        do {
            shortCode = generateRandomBase62();
        }
        while (urlRepository.existsByShortCode(shortCode));

        return shortCode;
    }

    private String generateRandomBase62() {

        StringBuilder shortCode = new StringBuilder();

        for (int i = 0; i < SHORT_CODE_LENGTH; i++) {

            int randomIndex = random.nextInt(BASE62.length());

            shortCode.append(BASE62.charAt(randomIndex));
        }

        return shortCode.toString();
    }
}
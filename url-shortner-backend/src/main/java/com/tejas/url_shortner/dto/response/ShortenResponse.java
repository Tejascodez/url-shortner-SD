package com.tejas.url_shortner.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ShortenResponse {

    private String shortUrl;
}
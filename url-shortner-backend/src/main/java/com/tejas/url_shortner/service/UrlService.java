package com.tejas.url_shortner.service;

import com.tejas.url_shortner.dto.request.ShortenRequest;
import com.tejas.url_shortner.dto.response.ShortenResponse;
import com.tejas.url_shortner.dto.response.UrlAnalyticsResponse;
import com.tejas.url_shortner.entity.Url;

import java.util.List;

public interface UrlService {

    ShortenResponse shortenUrl(ShortenRequest request);

    String redirect(String shortCode);

    UrlAnalyticsResponse getAnalytics(String shortCode);

    List<Url> getMyUrls();
}
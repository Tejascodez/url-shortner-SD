package com.tejas.url_shortner.controller;

import com.tejas.url_shortner.dto.response.AuthResponse;
import com.tejas.url_shortner.dto.request.LoginRequest;
import com.tejas.url_shortner.dto.request.RegisterRequest;
import com.tejas.url_shortner.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(
            @RequestBody RegisterRequest request
    ) {

        String token =
                authService.register(request);

        return new AuthResponse(token);
    }

    @PostMapping("/login")
    public AuthResponse login(
            @RequestBody LoginRequest request
    ) {

        String token =
                authService.login(request);

        return new AuthResponse(token);
    }
}
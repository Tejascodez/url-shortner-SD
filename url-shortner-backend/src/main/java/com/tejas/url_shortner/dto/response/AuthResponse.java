package com.tejas.url_shortner.dto.response;

public class AuthResponse {
    private String token;

    public AuthResponse(String token){
        this.token = token;
    }

    public String getToken(){
        return token;
    }
}

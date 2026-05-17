package com.tejas.url_shortner.exception;

public class UrlInactiveException extends RuntimeException {
    public UrlInactiveException(String message){
        super(message);
    }
}

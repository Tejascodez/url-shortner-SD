package com.tejas.url_shortner.repository;

import com.tejas.url_shortner.entity.Url;
import com.tejas.url_shortner.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UrlRepository extends JpaRepository<Url, Long> {

    Optional<Url> findByShortCode(String shortCode);

    boolean existsByShortCode(String shortCode);

    List<Url> findByUser(User user);
}
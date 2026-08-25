package com.kajal.onboarding_assistant.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")

public class AuthController {

    @GetMapping("/me")
    public Map<String, Object> me(
            @AuthenticationPrincipal OidcUser user
    ) {
        return Map.of(
                "authenticated", true,
                "name", user.getFullName(),
                "email", user.getEmail(),
                "picture", user.getPicture()
        );
    }
}
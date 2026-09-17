package EcommerceBackend.controller;

import EcommerceBackend.dto.AuthResponse;
import EcommerceBackend.exception.BadRequestException;
import EcommerceBackend.exception.ResourceNotFoundException;
import EcommerceBackend.model.User;
import EcommerceBackend.repository.UserRepository;
import EcommerceBackend.service.FileStorageService;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserRepository users;
    private final FileStorageService files;

    public ProfileController(UserRepository users, FileStorageService files) {
        this.users = users;
        this.files = files;
    }

    @GetMapping("/me")
    public AuthResponse me(Authentication auth) {
        User u = users.findByEmail(auth.getName())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return toResponse(u, null);
    }

    @PostMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public AuthResponse uploadAvatar(@RequestParam("file") MultipartFile file, Authentication auth) {
        User u = users.findByEmail(auth.getName())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (u.getAvatarUrl() != null && !u.getAvatarUrl().isBlank()) {
            files.delete(u.getAvatarUrl());
        }
        String filename = files.store(file);
        u.setAvatarUrl(filename);
        users.save(u);
        return toResponse(u, null);
    }

    @PutMapping("/name")
    public AuthResponse updateName(@RequestBody Map<String, String> body, Authentication auth) {
        User u = users.findByEmail(auth.getName())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        String name = body.get("name");
        if (name == null || name.isBlank()) throw new BadRequestException("Name is required");
        u.setName(name.trim());
        users.save(u);
        return toResponse(u, null);
    }

    private AuthResponse toResponse(User u, String token) {
        return new AuthResponse(
            token,
            u.getRole().name(),
            u.getName(),
            u.getEmail(),
            u.getId(),
            u.getAvatarUrl(),
            u.getVerified() != null ? u.getVerified() : false
        );
    }
}
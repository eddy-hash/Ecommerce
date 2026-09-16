package EcommerceBackend.service;

import EcommerceBackend.dto.AuthResponse;
import EcommerceBackend.dto.LoginRequest;
import EcommerceBackend.dto.RegisterRequest;
import EcommerceBackend.exception.BadRequestException;
import EcommerceBackend.model.User;
import EcommerceBackend.repository.UserRepository;
import EcommerceBackend.security.JwtUtil;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtUtil jwt;

    public AuthService(UserRepository users, PasswordEncoder encoder, JwtUtil jwt) {
        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        String email = req.getEmail().trim().toLowerCase();
        if (users.existsByEmail(email)) {
            throw new BadRequestException("An account with this email already exists");
        }
        User.Role role;
        try { role = User.Role.valueOf(req.getRole().toUpperCase()); }
        catch (IllegalArgumentException e) { throw new BadRequestException("Role must be CUSTOMER or TRADER"); }

        User u = new User();
        u.setName(req.getName().trim());
        u.setEmail(email);
        u.setPassword(encoder.encode(req.getPassword()));
        u.setRole(role);

        try { users.save(u); }
        catch (DataIntegrityViolationException e) {
            throw new BadRequestException("An account with this email already exists");
        }

        String token = jwt.generateToken(u.getEmail(), u.getRole().name());
        return new AuthResponse(token, u.getRole().name(), u.getName(), u.getEmail(), u.getId(), u.getAvatarUrl());
    }

    public AuthResponse login(LoginRequest req) {
        String email = req.getEmail().trim().toLowerCase();
        User u = users.findByEmail(email)
            .orElseThrow(() -> new BadRequestException("Invalid email or password"));
        if (!encoder.matches(req.getPassword(), u.getPassword()))
            throw new BadRequestException("Invalid email or password");

        String token = jwt.generateToken(u.getEmail(), u.getRole().name());
        return new AuthResponse(token, u.getRole().name(), u.getName(), u.getEmail(), u.getId(), u.getAvatarUrl());
    }
}
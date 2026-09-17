package EcommerceBackend.controller;

import EcommerceBackend.model.User;
import EcommerceBackend.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/traders")
public class TraderController {

    private final UserRepository users;

    public TraderController(UserRepository users) { this.users = users; }

    @GetMapping
    public List<Map<String, Object>> all() {
        return users.findByRole(User.Role.TRADER).stream()
            .map(u -> Map.<String, Object>of(
                "id", u.getId(),
                "name", u.getName(),
                "email", u.getEmail(),
                "verified", u.getVerified() != null && u.getVerified()
            ))
            .collect(Collectors.toList());
    }
}
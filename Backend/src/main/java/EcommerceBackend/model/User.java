package EcommerceBackend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data @NoArgsConstructor @AllArgsConstructor
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank @Column(nullable = false) private String name;
    @Email @NotBlank @Column(nullable = false, unique = true) private String email;
    @NotBlank @Column(nullable = false) private String password;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private Role role;
    @Column(name = "avatar_url", length = 500) private String avatarUrl;
    @Column(name = "verified", nullable = false) private Boolean verified = false;
    @Column(name = "created_at", nullable = false, updatable = false) private LocalDateTime createdAt;
    @PrePersist protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.verified == null) this.verified = false;
    }
    public enum Role { CUSTOMER, TRADER, ADMIN }
}
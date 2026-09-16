package EcommerceBackend.service;

import EcommerceBackend.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${app.upload.dir:C:/Ecommerce/uploads}")
    private String uploadDir;

    private static final long MAX_SIZE = 5 * 1024 * 1024; // 5 MB
    private static final String[] ALLOWED_EXT = {".jpg", ".jpeg", ".png", ".webp", ".gif"};

    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File is empty");
        }
        if (file.getSize() > MAX_SIZE) {
            throw new BadRequestException("File too large (max 5 MB)");
        }

        String original = file.getOriginalFilename();
        if (original == null) throw new BadRequestException("Invalid filename");

        String ext = "";
        int dot = original.lastIndexOf('.');
        if (dot >= 0) ext = original.substring(dot).toLowerCase();

        boolean allowed = false;
        for (String a : ALLOWED_EXT) if (a.equals(ext)) { allowed = true; break; }
        if (!allowed) throw new BadRequestException("Only JPG, PNG, WEBP, or GIF allowed");

        String filename = UUID.randomUUID().toString() + ext;

        try {
            Path dir = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(dir);
            Path target = dir.resolve(filename);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            return filename;
        } catch (IOException e) {
            throw new BadRequestException("Failed to store file: " + e.getMessage());
        }
    }

    public void delete(String filename) {
        if (filename == null || filename.isBlank()) return;
        try {
            Path target = Paths.get(uploadDir).toAbsolutePath().normalize().resolve(filename);
            Files.deleteIfExists(target);
        } catch (IOException ignored) {}
    }
}
package EcommerceBackend.service;

import EcommerceBackend.dto.ProductRequest;
import EcommerceBackend.dto.ProductResponse;
import EcommerceBackend.exception.BadRequestException;
import EcommerceBackend.exception.ResourceNotFoundException;
import EcommerceBackend.model.Category;
import EcommerceBackend.model.Product;
import EcommerceBackend.model.User;
import EcommerceBackend.repository.CategoryRepository;
import EcommerceBackend.repository.ProductRepository;
import EcommerceBackend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {
    private final ProductRepository products;
    private final CategoryRepository categories;
    private final UserRepository users;
    private final FileStorageService files;

    public ProductService(ProductRepository products, CategoryRepository categories,
                          UserRepository users, FileStorageService files) {
        this.products = products;
        this.categories = categories;
        this.users = users;
        this.files = files;
    }

    // PUBLIC: only active products
    public List<ProductResponse> all(Long categoryId, Long traderId) {
        List<Product> list;
        if (categoryId != null && traderId != null) {
            list = products.findByCategoryIdAndTraderIdAndActiveTrue(categoryId, traderId);
        } else if (categoryId != null) {
            list = products.findByCategoryIdAndActiveTrue(categoryId);
        } else if (traderId != null) {
            list = products.findByTraderIdAndActiveTrue(traderId);
        } else {
            list = products.findByActiveTrue();
        }
        return list.stream().map(this::toResponse).collect(Collectors.toList());
    }

    // Public — but trader's own listing includes inactive
    public List<ProductResponse> byTraderEmail(String email) {
        User t = users.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("Trader not found"));
        return products.findByTraderId(t.getId())
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ProductResponse get(Long id) {
        Product p = findById(id);
        // Inactive products visible only to their owner (checked in controller if needed)
        return toResponse(p);
    }

    public ProductResponse create(ProductRequest req, String traderEmail) {
        User t = users.findByEmail(traderEmail)
            .orElseThrow(() -> new ResourceNotFoundException("Trader not found"));
        Product p = new Product();
        apply(p, req);
        p.setTrader(t);
        p.setActive(true);
        return toResponse(products.save(p));
    }

    public ProductResponse update(Long id, ProductRequest req, String traderEmail) {
        Product p = findById(id);
        if (!p.getTrader().getEmail().equals(traderEmail)) throw new BadRequestException("Not your product");
        apply(p, req);
        return toResponse(products.save(p));
    }

    public ProductResponse uploadImage(Long id, MultipartFile file, String traderEmail) {
        Product p = findById(id);
        if (!p.getTrader().getEmail().equals(traderEmail)) throw new BadRequestException("Not your product");
        if (p.getImageUrl() != null && !p.getImageUrl().isBlank()) files.delete(p.getImageUrl());
        String filename = files.store(file);
        p.setImageUrl(filename);
        return toResponse(products.save(p));
    }

    // SOFT DELETE — mark as inactive
    public void delete(Long id, String traderEmail) {
        Product p = findById(id);
        if (!p.getTrader().getEmail().equals(traderEmail)) throw new BadRequestException("Not your product");
        p.setActive(false);
        products.save(p);
    }

    // Reactivate — admin or trader can bring it back
    public ProductResponse reactivate(Long id, String email) {
        Product p = findById(id);
        User u = users.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        // Owner or admin can reactivate
        if (!p.getTrader().getEmail().equals(email) && u.getRole() != User.Role.ADMIN) {
            throw new BadRequestException("Not your product");
        }
        p.setActive(true);
        return toResponse(products.save(p));
    }

    private Product findById(Long id) {
        return products.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }

    private void apply(Product p, ProductRequest req) {
        p.setName(req.getName());
        p.setDescription(req.getDescription());
        p.setPrice(req.getPrice());
        p.setStock(req.getStock() == null ? 0 : req.getStock());
        p.setColors(req.getColors());
        if (req.getImageUrl() != null) p.setImageUrl(req.getImageUrl());
        if (req.getCategoryId() != null) {
            Category c = categories.findById(req.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            p.setCategory(c);
        } else p.setCategory(null);
    }

    private ProductResponse toResponse(Product p) {
        return new ProductResponse(
            p.getId(),
            p.getName(),
            p.getDescription(),
            p.getPrice(),
            p.getStock(),
            p.getColors(),
            p.getCategory() != null ? p.getCategory().getId() : null,
            p.getCategory() != null ? p.getCategory().getName() : null,
            p.getTrader().getId(),
            p.getTrader().getName(),
            p.getTrader().getVerified() != null ? p.getTrader().getVerified() : false,
            p.getImageUrl(),
            p.getCreatedAt()
        );
    }
}

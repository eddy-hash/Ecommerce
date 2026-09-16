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

    public List<ProductResponse> all(Long categoryId, Long traderId) {
        List<Product> list;
        if (categoryId != null && traderId != null) list = products.findByCategoryIdAndTraderId(categoryId, traderId);
        else if (categoryId != null) list = products.findByCategoryId(categoryId);
        else if (traderId != null) list = products.findByTraderId(traderId);
        else list = products.findAll();
        return list.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ProductResponse get(Long id) { return toResponse(findById(id)); }

    public List<ProductResponse> byTraderEmail(String email) {
        User t = users.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("Trader not found"));
        return products.findByTraderId(t.getId()).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ProductResponse create(ProductRequest req, String traderEmail) {
        User t = users.findByEmail(traderEmail).orElseThrow(() -> new ResourceNotFoundException("Trader not found"));
        Product p = new Product();
        apply(p, req);
        p.setTrader(t);
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

    public void delete(Long id, String traderEmail) {
        Product p = findById(id);
        if (!p.getTrader().getEmail().equals(traderEmail)) throw new BadRequestException("Not your product");
        if (p.getImageUrl() != null) files.delete(p.getImageUrl());
        products.delete(p);
    }

    private Product findById(Long id) {
        return products.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
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
            p.getImageUrl(),
            p.getCreatedAt()
        );
    }
}
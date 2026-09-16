package EcommerceBackend.controller;

import EcommerceBackend.model.Category;
import EcommerceBackend.service.CategoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    private final CategoryService svc;
    public CategoryController(CategoryService svc) { this.svc = svc; }

    @GetMapping
    public List<Category> all() { return svc.all(); }

    @PostMapping
    public Category create(@RequestBody Map<String, String> body) { return svc.create(body.get("name")); }
}

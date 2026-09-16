package EcommerceBackend.service;

import EcommerceBackend.exception.BadRequestException;
import EcommerceBackend.exception.ResourceNotFoundException;
import EcommerceBackend.model.Category;
import EcommerceBackend.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepository repo;
    public CategoryService(CategoryRepository repo) { this.repo = repo; }
    public List<Category> all() { return repo.findAll(); }
    public Category get(Long id) {
        return repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
    }
    public Category create(String name) {
        if (name == null || name.isBlank()) throw new BadRequestException("Category name required");
        if (repo.existsByName(name)) throw new BadRequestException("Category already exists");
        Category c = new Category(); c.setName(name); return repo.save(c);
    }
}

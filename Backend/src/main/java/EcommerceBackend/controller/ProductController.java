package EcommerceBackend.controller;

import EcommerceBackend.dto.ProductRequest;
import EcommerceBackend.dto.ProductResponse;
import EcommerceBackend.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService svc;

    public ProductController(ProductService svc) { this.svc = svc; }

    @GetMapping
    public List<ProductResponse> list(@RequestParam(required = false) Long categoryId,
                                      @RequestParam(required = false) Long traderId) {
        return svc.all(categoryId, traderId);
    }

    @GetMapping("/{id}")
    public ProductResponse get(@PathVariable Long id) { return svc.get(id); }

    @GetMapping("/mine")
    public List<ProductResponse> mine(Authentication auth) { return svc.byTraderEmail(auth.getName()); }

    @PostMapping
    public ProductResponse create(@Valid @RequestBody ProductRequest req, Authentication auth) {
        return svc.create(req, auth.getName());
    }

    @PutMapping("/{id}")
    public ProductResponse update(@PathVariable Long id, @Valid @RequestBody ProductRequest req, Authentication auth) {
        return svc.update(id, req, auth.getName());
    }

    @PostMapping(value = "/{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ProductResponse uploadImage(@PathVariable Long id,
                                       @RequestParam("file") MultipartFile file,
                                       Authentication auth) {
        return svc.uploadImage(id, file, auth.getName());
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, Authentication auth) { svc.delete(id, auth.getName()); }
}
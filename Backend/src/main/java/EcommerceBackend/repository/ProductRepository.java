package EcommerceBackend.repository;

import EcommerceBackend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    // Public queries — only active products
    List<Product> findByActiveTrue();
    List<Product> findByCategoryIdAndActiveTrue(Long categoryId);
    List<Product> findByTraderIdAndActiveTrue(Long traderId);
    List<Product> findByCategoryIdAndTraderIdAndActiveTrue(Long categoryId, Long traderId);

    // Trader's own list — includes inactive
    List<Product> findByTraderId(Long traderId);
}
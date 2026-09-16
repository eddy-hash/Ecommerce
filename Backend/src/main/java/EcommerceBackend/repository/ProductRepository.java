package EcommerceBackend.repository;

import EcommerceBackend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryId(Long categoryId);
    List<Product> findByTraderId(Long traderId);
    List<Product> findByCategoryIdAndTraderId(Long categoryId, Long traderId);
}

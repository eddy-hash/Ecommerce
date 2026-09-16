package EcommerceBackend.repository;

import EcommerceBackend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    @Query("SELECT DISTINCT o FROM Order o JOIN o.items i WHERE i.product.trader.id = :traderId ORDER BY o.createdAt DESC")
    List<Order> findOrdersForTrader(@Param("traderId") Long traderId);
}
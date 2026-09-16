package EcommerceBackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data @AllArgsConstructor
public class OrderResponse {
    private Long id;
    private BigDecimal totalAmount;
    private String status;
    private LocalDateTime createdAt;
    private String customerName;
    private List<Item> items;

    @Data @AllArgsConstructor
    public static class Item {
        private Long productId;
        private String productName;
        private Integer quantity;
        private BigDecimal priceAtPurchase;
    }
}

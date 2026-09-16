package EcommerceBackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data @AllArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private List<String> colors;
    private Long categoryId;
    private String categoryName;
    private Long traderId;
    private String traderName;
    private String imageUrl;
    private LocalDateTime createdAt;
}
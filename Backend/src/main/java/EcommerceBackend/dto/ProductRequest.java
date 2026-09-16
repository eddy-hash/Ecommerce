package EcommerceBackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductRequest {
    @NotBlank private String name;
    private String description;
    @NotNull private BigDecimal price;
    @PositiveOrZero private Integer stock;
    private List<String> colors;
    private Long categoryId;
    private String imageUrl;
}
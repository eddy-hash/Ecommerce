package EcommerceBackend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {
    @NotNull private List<OrderItemRequest> items;

    @Data
    public static class OrderItemRequest {
        @NotNull private Long productId;
        @NotNull @Min(1) private Integer quantity;
    }
}

package EcommerceBackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class TraderStats {
    private long totalProducts;
    private long totalStock;
    private long totalOrders;
    private long pendingOrders;
    private long paidOrders;
    private long shippedOrders;
    private long deliveredOrders;
    private BigDecimal totalRevenue;
}
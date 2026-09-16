package EcommerceBackend.service;

import EcommerceBackend.dto.OrderRequest;
import EcommerceBackend.dto.OrderResponse;
import EcommerceBackend.dto.TraderStats;
import EcommerceBackend.exception.BadRequestException;
import EcommerceBackend.exception.ResourceNotFoundException;
import EcommerceBackend.model.*;
import EcommerceBackend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orders;
    private final ProductRepository products;
    private final UserRepository users;

    public OrderService(OrderRepository orders, ProductRepository products, UserRepository users) {
        this.orders = orders;
        this.products = products;
        this.users = users;
    }

    @Transactional
    public OrderResponse create(OrderRequest req, String customerEmail) {
        if (req.getItems() == null || req.getItems().isEmpty())
            throw new BadRequestException("Order must contain at least one item");

        User customer = users.findByEmail(customerEmail)
            .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        Order order = new Order();
        order.setCustomer(customer);
        order.setStatus(Order.Status.PENDING);

        List<OrderItem> items = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (OrderRequest.OrderItemRequest line : req.getItems()) {
            Product p = products.findById(line.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + line.getProductId()));
            if (p.getStock() < line.getQuantity())
                throw new BadRequestException("Insufficient stock for " + p.getName());
            p.setStock(p.getStock() - line.getQuantity());
            products.save(p);

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(p);
            item.setQuantity(line.getQuantity());
            item.setPriceAtPurchase(p.getPrice());
            items.add(item);
            total = total.add(p.getPrice().multiply(BigDecimal.valueOf(line.getQuantity())));
        }

        order.setItems(items);
        order.setTotalAmount(total);
        return toResponse(orders.save(order));
    }

    public List<OrderResponse> byCustomerEmail(String email) {
        User customer = users.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        return orders.findByCustomerIdOrderByCreatedAtDesc(customer.getId())
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse pay(Long id, String customerEmail) {
        Order o = orders.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        if (!o.getCustomer().getEmail().equals(customerEmail)) throw new BadRequestException("Not your order");
        if (o.getStatus() != Order.Status.PENDING) throw new BadRequestException("Order is not pending");
        o.setStatus(Order.Status.PAID);
        return toResponse(orders.save(o));
    }

    // ─────────── Trader methods ───────────

    public List<OrderResponse> receivedByTrader(String traderEmail) {
        User trader = users.findByEmail(traderEmail)
            .orElseThrow(() -> new ResourceNotFoundException("Trader not found"));
        return orders.findOrdersForTrader(trader.getId())
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse ship(Long id, String traderEmail) {
        Order o = orders.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        verifyTraderOwns(o, traderEmail);
        if (o.getStatus() != Order.Status.PAID) throw new BadRequestException("Order must be PAID before shipping");
        o.setStatus(Order.Status.SHIPPED);
        return toResponse(orders.save(o));
    }

    @Transactional
    public OrderResponse deliver(Long id, String traderEmail) {
        Order o = orders.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        verifyTraderOwns(o, traderEmail);
        if (o.getStatus() != Order.Status.SHIPPED) throw new BadRequestException("Order must be SHIPPED before delivering");
        o.setStatus(Order.Status.DELIVERED);
        return toResponse(orders.save(o));
    }

    @Transactional
    public OrderResponse cancel(Long id, String traderEmail) {
        Order o = orders.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        verifyTraderOwns(o, traderEmail);
        if (o.getStatus() == Order.Status.DELIVERED || o.getStatus() == Order.Status.CANCELLED)
            throw new BadRequestException("Cannot cancel this order");
        o.setStatus(Order.Status.CANCELLED);
        // Restore stock
        for (OrderItem item : o.getItems()) {
            Product p = item.getProduct();
            p.setStock(p.getStock() + item.getQuantity());
            products.save(p);
        }
        return toResponse(orders.save(o));
    }

    public TraderStats statsForTrader(String traderEmail) {
        User trader = users.findByEmail(traderEmail)
            .orElseThrow(() -> new ResourceNotFoundException("Trader not found"));

        List<Order> traderOrders = orders.findOrdersForTrader(trader.getId());
        List<Product> traderProducts = products.findByTraderId(trader.getId());

        long pending = traderOrders.stream().filter(o -> o.getStatus() == Order.Status.PENDING).count();
        long paid = traderOrders.stream().filter(o -> o.getStatus() == Order.Status.PAID).count();
        long shipped = traderOrders.stream().filter(o -> o.getStatus() == Order.Status.SHIPPED).count();
        long delivered = traderOrders.stream().filter(o -> o.getStatus() == Order.Status.DELIVERED).count();

        BigDecimal revenue = traderOrders.stream()
            .filter(o -> o.getStatus() == Order.Status.PAID
                     || o.getStatus() == Order.Status.SHIPPED
                     || o.getStatus() == Order.Status.DELIVERED)
            .map(Order::getTotalAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        long totalStock = traderProducts.stream().mapToLong(Product::getStock).sum();

        return new TraderStats(
            traderProducts.size(),
            totalStock,
            traderOrders.size(),
            pending,
            paid,
            shipped,
            delivered,
            revenue
        );
    }

    private void verifyTraderOwns(Order o, String traderEmail) {
        boolean owns = o.getItems().stream()
            .anyMatch(i -> i.getProduct().getTrader().getEmail().equals(traderEmail));
        if (!owns) throw new BadRequestException("Not your order");
    }

    private OrderResponse toResponse(Order o) {
        List<OrderResponse.Item> items = o.getItems().stream()
            .map(i -> new OrderResponse.Item(
                i.getProduct().getId(),
                i.getProduct().getName(),
                i.getQuantity(),
                i.getPriceAtPurchase()))
            .collect(Collectors.toList());

        return new OrderResponse(
            o.getId(),
            o.getTotalAmount(),
            o.getStatus().name(),
            o.getCreatedAt(),
            o.getCustomer().getName(),
            items
        );
    }
}
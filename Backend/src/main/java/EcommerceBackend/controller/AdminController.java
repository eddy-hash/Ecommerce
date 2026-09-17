package EcommerceBackend.controller;

import EcommerceBackend.exception.ResourceNotFoundException;
import EcommerceBackend.model.Order;
import EcommerceBackend.model.Product;
import EcommerceBackend.model.User;
import EcommerceBackend.repository.OrderRepository;
import EcommerceBackend.repository.ProductRepository;
import EcommerceBackend.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository users;
    private final ProductRepository products;
    private final OrderRepository orders;

    public AdminController(UserRepository users, ProductRepository products, OrderRepository orders) {
        this.users = users;
        this.products = products;
        this.orders = orders;
    }

    @GetMapping("/stats")
    public Map<String, Object> stats() {
        Map<String, Object> stats = new HashMap<>();
        List<User> allUsers = users.findAll();
        long customers = allUsers.stream().filter(u -> u.getRole() == User.Role.CUSTOMER).count();
        long traders = allUsers.stream().filter(u -> u.getRole() == User.Role.TRADER).count();
        long verifiedTraders = allUsers.stream()
            .filter(u -> u.getRole() == User.Role.TRADER && Boolean.TRUE.equals(u.getVerified())).count();

        List<Order> allOrders;
        try {
            allOrders = orders.findAll();
        } catch (Exception e) {
            allOrders = java.util.Collections.emptyList();
        }

        BigDecimal revenue = allOrders.stream()
            .filter(o -> o.getStatus() == Order.Status.PAID
                     || o.getStatus() == Order.Status.SHIPPED
                     || o.getStatus() == Order.Status.DELIVERED)
            .map(Order::getTotalAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        stats.put("totalUsers", allUsers.size());
        stats.put("totalCustomers", customers);
        stats.put("totalTraders", traders);
        stats.put("verifiedTraders", verifiedTraders);
        stats.put("totalProducts", products.count());
        stats.put("totalOrders", allOrders.size());
        stats.put("totalRevenue", revenue);

        long pending = allOrders.stream().filter(o -> o.getStatus() == Order.Status.PENDING).count();
        long paid = allOrders.stream().filter(o -> o.getStatus() == Order.Status.PAID).count();
        long shipped = allOrders.stream().filter(o -> o.getStatus() == Order.Status.SHIPPED).count();
        long delivered = allOrders.stream().filter(o -> o.getStatus() == Order.Status.DELIVERED).count();

        stats.put("pendingOrders", pending);
        stats.put("paidOrders", paid);
        stats.put("shippedOrders", shipped);
        stats.put("deliveredOrders", delivered);

        return stats;
    }

    @GetMapping("/users")
    public List<Map<String, Object>> allUsers() {
        return users.findAll().stream().map(u -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", u.getId());
            m.put("name", u.getName());
            m.put("email", u.getEmail());
            m.put("role", u.getRole().name());
            m.put("verified", Boolean.TRUE.equals(u.getVerified()));
            m.put("avatarUrl", u.getAvatarUrl());
            m.put("createdAt", u.getCreatedAt());
            return m;
        }).toList();
    }

    @PostMapping("/users/{id}/verify")
    public Map<String, Object> verify(@PathVariable Long id) {
        User u = users.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        u.setVerified(!Boolean.TRUE.equals(u.getVerified()));
        users.save(u);
        Map<String, Object> m = new HashMap<>();
        m.put("id", u.getId());
        m.put("verified", u.getVerified());
        return m;
    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id) {
        users.deleteById(id);
    }

    @GetMapping("/products")
    public List<Product> allProducts() {
        return products.findAll();
    }

    // SOFT DELETE — admin marks product inactive
    @DeleteMapping("/products/{id}")
    public void deleteProduct(@PathVariable Long id) {
        Product p = products.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        p.setActive(false);
        products.save(p);
    }

    // Admin can reactivate any product
    @PostMapping("/products/{id}/reactivate")
    public Product reactivateProduct(@PathVariable Long id) {
        Product p = products.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        p.setActive(true);
        return products.save(p);
    }

    @GetMapping("/orders")
    public List<Order> allOrders() {
        return orders.findAll();
    }
}
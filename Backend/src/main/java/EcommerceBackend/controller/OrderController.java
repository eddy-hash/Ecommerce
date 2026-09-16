package EcommerceBackend.controller;

import EcommerceBackend.dto.OrderRequest;
import EcommerceBackend.dto.OrderResponse;
import EcommerceBackend.dto.TraderStats;
import EcommerceBackend.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService svc;

    public OrderController(OrderService svc) { this.svc = svc; }

    // CUSTOMER endpoints
    @PostMapping
    public OrderResponse create(@Valid @RequestBody OrderRequest req, Authentication auth) {
        return svc.create(req, auth.getName());
    }

    @GetMapping("/mine")
    public List<OrderResponse> mine(Authentication auth) {
        return svc.byCustomerEmail(auth.getName());
    }

    @PostMapping("/{id}/pay")
    public OrderResponse pay(@PathVariable Long id, Authentication auth) {
        return svc.pay(id, auth.getName());
    }

    // TRADER endpoints
    @GetMapping("/received")
    public List<OrderResponse> received(Authentication auth) {
        return svc.receivedByTrader(auth.getName());
    }

    @GetMapping("/stats")
    public TraderStats stats(Authentication auth) {
        return svc.statsForTrader(auth.getName());
    }

    @PostMapping("/{id}/ship")
    public OrderResponse ship(@PathVariable Long id, Authentication auth) {
        return svc.ship(id, auth.getName());
    }

    @PostMapping("/{id}/deliver")
    public OrderResponse deliver(@PathVariable Long id, Authentication auth) {
        return svc.deliver(id, auth.getName());
    }

    @PostMapping("/{id}/cancel")
    public OrderResponse cancel(@PathVariable Long id, Authentication auth) {
        return svc.cancel(id, auth.getName());
    }
}
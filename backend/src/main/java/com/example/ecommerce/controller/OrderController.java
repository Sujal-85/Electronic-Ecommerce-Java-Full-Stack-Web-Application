package com.example.ecommerce.controller;

import com.example.ecommerce.model.Order;
import com.example.ecommerce.service.OrderService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<Order> myOrders(@AuthenticationPrincipal UserDetails principal) {
        return orderService.listMyOrders(principal.getUsername());
    }

    @PostMapping("/place")
    public Order place(@AuthenticationPrincipal UserDetails principal, @RequestBody(required = false) java.util.Map<String, String> body) {
        String paymentMethod = (body != null && body.containsKey("paymentMethod")) ? body.get("paymentMethod") : "COD";
        return orderService.placeOrder(principal.getUsername(), paymentMethod);
    }

    @GetMapping("/track/{id}")
    public Order trackOrder(@PathVariable Long id) {
        return orderService.findById(id);
    }
}






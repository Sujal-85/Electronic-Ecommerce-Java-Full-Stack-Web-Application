package com.example.ecommerce.controller;

import com.example.ecommerce.model.CartItem;
import com.example.ecommerce.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public List<CartItem> getCart(@AuthenticationPrincipal UserDetails principal) {
        return cartService.getCart(principal.getUsername());
    }

    public record AddRequest(Long productId, int quantity) {}

    @PostMapping("/add")
    public CartItem add(@AuthenticationPrincipal UserDetails principal, @RequestBody AddRequest req) {
        return cartService.addToCart(principal.getUsername(), req.productId(), req.quantity());
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<?> remove(@AuthenticationPrincipal UserDetails principal, @PathVariable Long productId) {
        cartService.removeFromCart(principal.getUsername(), productId);
        return ResponseEntity.ok(Map.of("status", "removed"));
    }

    @PostMapping("/clear")
    public ResponseEntity<?> clear(@AuthenticationPrincipal UserDetails principal) {
        cartService.clearCart(principal.getUsername());
        return ResponseEntity.ok(Map.of("status", "cleared"));
    }
}






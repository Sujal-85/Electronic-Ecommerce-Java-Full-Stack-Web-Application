package com.example.ecommerce.service;

import com.example.ecommerce.model.CartItem;
import com.example.ecommerce.model.Product;
import com.example.ecommerce.model.User;
import com.example.ecommerce.repository.CartItemRepository;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(CartItemRepository cartItemRepository, ProductRepository productRepository, UserRepository userRepository) {
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public List<CartItem> getCart(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return cartItemRepository.findByUser(user);
    }

    public CartItem addToCart(String email, Long productId, int quantity) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Product product = productRepository.findById(productId).orElseThrow();
        CartItem item = cartItemRepository.findByUserIdAndProductId(user.getId(), productId)
                .orElseGet(() -> {
                    CartItem ci = new CartItem();
                    ci.setUser(user);
                    ci.setProduct(product);
                    ci.setQuantity(0);
                    return ci;
                });
        item.setQuantity(item.getQuantity() + quantity);
        return cartItemRepository.save(item);
    }

    public void removeFromCart(String email, Long productId) {
        User user = userRepository.findByEmail(email).orElseThrow();
        cartItemRepository.findByUserIdAndProductId(user.getId(), productId)
                .ifPresent(cartItemRepository::delete);
    }

    public void clearCart(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        cartItemRepository.deleteByUser(user);
    }
}






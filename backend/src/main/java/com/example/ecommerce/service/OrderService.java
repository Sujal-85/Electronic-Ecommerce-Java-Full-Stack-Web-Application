package com.example.ecommerce.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.ecommerce.model.CartItem;
import com.example.ecommerce.model.Order;
import com.example.ecommerce.model.OrderItem;
import com.example.ecommerce.model.User;
import com.example.ecommerce.repository.CartItemRepository;
import com.example.ecommerce.repository.OrderItemRepository;
import com.example.ecommerce.repository.OrderRepository;
import com.example.ecommerce.repository.UserRepository;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;

    public OrderService(OrderRepository orderRepository, OrderItemRepository orderItemRepository, CartItemRepository cartItemRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
    }

    public List<Order> listMyOrders(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        List<Order> orders = orderRepository.findByUserOrderByCreatedAtDesc(user);
        // Force initialization of items
        orders.forEach(order -> order.getItems().size());
        return orders;
    }

    @Transactional
    public Order placeOrder(String email, String paymentMethod) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        List<CartItem> items = cartItemRepository.findByUser(user);
        if (items.isEmpty()) throw new IllegalStateException("Cart is empty");
        
        // Validate payment method
        if (paymentMethod == null || (!"COD".equals(paymentMethod) && !"RAZORPAY".equals(paymentMethod))) {
            paymentMethod = "COD"; // Default to COD if invalid
        }
        
        Order order = new Order();
        order.setUser(user);
        order.setPaymentMethod(paymentMethod);
        order.setPaymentStatus("PENDING");
        
        if ("COD".equals(paymentMethod)) {
            order.setStatus("PLACED");
            order.setPaymentStatus("PENDING");
        } else if ("RAZORPAY".equals(paymentMethod)) {
            order.setStatus("PENDING");
            order.setPaymentStatus("PENDING");
        } else {
            order.setStatus("PENDING");
            order.setPaymentStatus("PENDING");
        }
        
        order.setTotalAmount(BigDecimal.ZERO);
        order = orderRepository.save(order);
        BigDecimal total = BigDecimal.ZERO;
        for (CartItem ci : items) {
            OrderItem oi = new OrderItem();
            oi.setProduct(ci.getProduct());
            oi.setQuantity(ci.getQuantity());
            oi.setPriceAtPurchase(ci.getProduct().getPrice());
            order.addItem(oi); // Use helper method to manage bidirectional relationship
            total = total.add(ci.getProduct().getPrice().multiply(BigDecimal.valueOf(ci.getQuantity())));
        }
        order.setTotalAmount(total);
        order = orderRepository.save(order);
        cartItemRepository.deleteByUser(user);
        return order;
    }

    public Order findById(Long id) {
        return orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public Order saveOrder(Order order) {
        return orderRepository.save(order);
    }

    public Order findByTrackingId(String trackingId) {
        return orderRepository.findById(Long.parseLong(trackingId)).orElse(null);
    }
}
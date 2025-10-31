package com.example.ecommerce.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.ecommerce.dto.AnalyticsDTO;
import com.example.ecommerce.model.Order;
import com.example.ecommerce.model.OrderItem;
import com.example.ecommerce.model.Product;
import com.example.ecommerce.model.User;
import com.example.ecommerce.repository.OrderItemRepository;
import com.example.ecommerce.repository.OrderRepository;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.repository.UserRepository;

@Service
public class AdminService {
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    public AdminService(UserRepository userRepository, ProductRepository productRepository, 
                       OrderRepository orderRepository, OrderItemRepository orderItemRepository) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
    }

    public AnalyticsDTO getAnalytics() {
        AnalyticsDTO analytics = new AnalyticsDTO();
        
        // Basic counts
        analytics.setTotalUsers(userRepository.count());
        analytics.setTotalProducts(productRepository.count());
        analytics.setTotalOrders(orderRepository.count());
        
        // Order statistics
        List<Order> allOrders = orderRepository.findAll();
        analytics.setPendingOrders(allOrders.stream()
            .filter(order -> "PENDING".equals(order.getStatus()) || "PLACED".equals(order.getStatus()))
            .count());
        analytics.setCompletedOrders(allOrders.stream()
            .filter(order -> "DELIVERED".equals(order.getStatus()))
            .count());
        
        // Revenue calculation
        BigDecimal totalRevenue = allOrders.stream()
            .filter(order -> "PAID".equals(order.getPaymentStatus()) || "DELIVERED".equals(order.getStatus()))
            .map(Order::getTotalAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        analytics.setTotalRevenue(totalRevenue);
        
        // Daily sales data (last 30 days)
        analytics.setDailySales(getDailySalesData(allOrders));
        
        // Order status distribution
        Map<String, Long> statusDistribution = allOrders.stream()
            .collect(Collectors.groupingBy(Order::getStatus, Collectors.counting()));
        analytics.setOrderStatusDistribution(statusDistribution);
        
        // Payment method distribution
        Map<String, Long> paymentDistribution = allOrders.stream()
            .collect(Collectors.groupingBy(Order::getPaymentMethod, Collectors.counting()));
        analytics.setPaymentMethodDistribution(paymentDistribution);
        
        // Top selling products
        analytics.setTopSellingProducts(getTopSellingProducts());
        
        return analytics;
    }
    
    private List<AnalyticsDTO.DailySalesData> getDailySalesData(List<Order> allOrders) {
        LocalDate today = LocalDate.now();
        LocalDate thirtyDaysAgo = today.minusDays(30);
        
        Map<LocalDate, List<Order>> ordersByDate = allOrders.stream()
            .filter(order -> order.getCreatedAt() != null)
            .filter(order -> {
                LocalDate orderDate = order.getCreatedAt().atZone(ZoneId.systemDefault()).toLocalDate();
                return !orderDate.isBefore(thirtyDaysAgo) && !orderDate.isAfter(today);
            })
            .collect(Collectors.groupingBy(order -> 
                order.getCreatedAt().atZone(ZoneId.systemDefault()).toLocalDate()));
        
        List<AnalyticsDTO.DailySalesData> dailySales = new ArrayList<>();
        for (int i = 0; i < 30; i++) {
            LocalDate date = thirtyDaysAgo.plusDays(i);
            List<Order> orders = ordersByDate.getOrDefault(date, new ArrayList<>());
            
            BigDecimal dailySalesAmount = orders.stream()
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            dailySales.add(new AnalyticsDTO.DailySalesData(date, dailySalesAmount, orders.size()));
        }
        
        return dailySales;
    }
    
    private List<AnalyticsDTO.ProductSalesData> getTopSellingProducts() {
        List<OrderItem> allOrderItems = orderItemRepository.findAll();
        
        Map<Product, Long> productQuantityMap = new HashMap<>();
        Map<Product, BigDecimal> productRevenueMap = new HashMap<>();
        
        for (OrderItem item : allOrderItems) {
            Product product = item.getProduct();
            long quantity = item.getQuantity();
            BigDecimal revenue = item.getPriceAtPurchase().multiply(BigDecimal.valueOf(quantity));
            
            productQuantityMap.merge(product, quantity, Long::sum);
            productRevenueMap.merge(product, revenue, BigDecimal::add);
        }
        
        return productQuantityMap.entrySet().stream()
            .sorted(Map.Entry.<Product, Long>comparingByValue().reversed())
            .limit(10)
            .map(entry -> new AnalyticsDTO.ProductSalesData(
                entry.getKey().getName(),
                entry.getValue(),
                productRevenueMap.get(entry.getKey())
            ))
            .collect(Collectors.toList());
    }
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public User updateUserRole(Long userId, String role) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(role);
        return userRepository.save(user);
    }
    
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
    
    public Order updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        return orderRepository.save(order);
    }
    
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }
    
    public Product updateProduct(Long productId, Product productDetails) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        
        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setImageUrl(productDetails.getImageUrl());
        product.setStock(productDetails.getStock());
        
        return productRepository.save(product);
    }
    
    public void deleteProduct(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new RuntimeException("Product not found");
        }
        productRepository.deleteById(productId);
    }
}
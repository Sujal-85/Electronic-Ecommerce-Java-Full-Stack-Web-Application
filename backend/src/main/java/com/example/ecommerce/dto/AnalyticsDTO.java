package com.example.ecommerce.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public class AnalyticsDTO {
    private long totalUsers;
    private long totalProducts;
    private long totalOrders;
    private BigDecimal totalRevenue;
    private long pendingOrders;
    private long completedOrders;
    
    // Sales data for charts
    private List<DailySalesData> dailySales;
    private Map<String, Long> orderStatusDistribution;
    private Map<String, Long> paymentMethodDistribution;
    private List<ProductSalesData> topSellingProducts;
    
    // Getters and setters
    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }
    
    public long getTotalProducts() { return totalProducts; }
    public void setTotalProducts(long totalProducts) { this.totalProducts = totalProducts; }
    
    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }
    
    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }
    
    public long getPendingOrders() { return pendingOrders; }
    public void setPendingOrders(long pendingOrders) { this.pendingOrders = pendingOrders; }
    
    public long getCompletedOrders() { return completedOrders; }
    public void setCompletedOrders(long completedOrders) { this.completedOrders = completedOrders; }
    
    public List<DailySalesData> getDailySales() { return dailySales; }
    public void setDailySales(List<DailySalesData> dailySales) { this.dailySales = dailySales; }
    
    public Map<String, Long> getOrderStatusDistribution() { return orderStatusDistribution; }
    public void setOrderStatusDistribution(Map<String, Long> orderStatusDistribution) { this.orderStatusDistribution = orderStatusDistribution; }
    
    public Map<String, Long> getPaymentMethodDistribution() { return paymentMethodDistribution; }
    public void setPaymentMethodDistribution(Map<String, Long> paymentMethodDistribution) { this.paymentMethodDistribution = paymentMethodDistribution; }
    
    public List<ProductSalesData> getTopSellingProducts() { return topSellingProducts; }
    public void setTopSellingProducts(List<ProductSalesData> topSellingProducts) { this.topSellingProducts = topSellingProducts; }
    
    public static class DailySalesData {
        private LocalDate date;
        private BigDecimal sales;
        private long orders;
        
        public DailySalesData() {}
        
        public DailySalesData(LocalDate date, BigDecimal sales, long orders) {
            this.date = date;
            this.sales = sales;
            this.orders = orders;
        }
        
        public LocalDate getDate() { return date; }
        public void setDate(LocalDate date) { this.date = date; }
        
        public BigDecimal getSales() { return sales; }
        public void setSales(BigDecimal sales) { this.sales = sales; }
        
        public long getOrders() { return orders; }
        public void setOrders(long orders) { this.orders = orders; }
    }
    
    public static class ProductSalesData {
        private String productName;
        private long quantitySold;
        private BigDecimal revenue;
        
        public ProductSalesData() {}
        
        public ProductSalesData(String productName, long quantitySold, BigDecimal revenue) {
            this.productName = productName;
            this.quantitySold = quantitySold;
            this.revenue = revenue;
        }
        
        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }
        
        public long getQuantitySold() { return quantitySold; }
        public void setQuantitySold(long quantitySold) { this.quantitySold = quantitySold; }
        
        public BigDecimal getRevenue() { return revenue; }
        public void setRevenue(BigDecimal revenue) { this.revenue = revenue; }
    }
}
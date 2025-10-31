package com.example.ecommerce.config;

import java.math.BigDecimal;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.ecommerce.model.Product;
import com.example.ecommerce.model.User;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.repository.UserRepository;

@Configuration
public class DataLoader {
    @Bean
    CommandLineRunner init(ProductRepository productRepository, UserRepository userRepository, PasswordEncoder encoder) {
        return args -> {
            if (userRepository.count() == 0) {
                User admin = new User();
                admin.setName("Admin");
                admin.setEmail("admin@elect.com");
                admin.setPasswordHash(encoder.encode("admin@123"));
                admin.setRole("ROLE_ADMIN");
                userRepository.save(admin);
            }

            if (productRepository.count() == 0) {
                Product p1 = new Product();
                p1.setName("Smartphone X");
                p1.setDescription("Flagship smartphone with OLED display, 128GB storage, and triple camera system. Perfect for photography enthusiasts and power users.");
                p1.setPrice(new BigDecimal("699.99"));
                p1.setImageUrl("https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop");
                p1.setStock(50);
                productRepository.save(p1);

                Product p2 = new Product();
                p2.setName("Laptop Pro");
                p2.setDescription("Powerful laptop for professionals with Intel i7 processor, 16GB RAM, and 512GB SSD. Ideal for designers and developers.");
                p2.setPrice(new BigDecimal("1299.00"));
                p2.setImageUrl("https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop");
                p2.setStock(25);
                productRepository.save(p2);

                Product p3 = new Product();
                p3.setName("Wireless Headphones");
                p3.setDescription("Premium noise-cancelling over-ear headphones with 30-hour battery life and Bluetooth 5.0 connectivity.");
                p3.setPrice(new BigDecimal("199.99"));
                p3.setImageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop");
                p3.setStock(100);
                productRepository.save(p3);

                Product p4 = new Product();
                p4.setName("Smart Watch");
                p4.setDescription("Feature-rich smartwatch with fitness tracking, heart rate monitor, and waterproof design.");
                p4.setPrice(new BigDecimal("249.99"));
                p4.setImageUrl("https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop");
                p4.setStock(75);
                productRepository.save(p4);

                Product p5 = new Product();
                p5.setName("Tablet Pro");
                p5.setDescription("10-inch tablet with high-resolution display, perfect for reading, gaming, and productivity.");
                p5.setPrice(new BigDecimal("399.99"));
                p5.setImageUrl("https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=600&fit=crop");
                p5.setStock(40);
                productRepository.save(p5);

                Product p6 = new Product();
                p6.setName("Wireless Speaker");
                p6.setDescription("Portable Bluetooth speaker with 360-degree sound and 20-hour battery life.");
                p6.setPrice(new BigDecimal("129.99"));
                p6.setImageUrl("https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=600&fit=crop");
                p6.setStock(60);
                productRepository.save(p6);
            }
        };
    }
}






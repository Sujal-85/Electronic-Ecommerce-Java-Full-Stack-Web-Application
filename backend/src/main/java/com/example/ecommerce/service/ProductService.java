package com.example.ecommerce.service;

import com.example.ecommerce.model.Product;
import com.example.ecommerce.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> findAll() { return productRepository.findAll(); }
    public Product findById(Long id) { return productRepository.findById(id).orElseThrow(); }
    public Product create(Product p) { return productRepository.save(p); }
    public Product update(Long id, Product p) {
        Product existing = findById(id);
        existing.setName(p.getName());
        existing.setDescription(p.getDescription());
        existing.setPrice(p.getPrice());
        existing.setImageUrl(p.getImageUrl());
        existing.setStock(p.getStock());
        return productRepository.save(existing);
    }
    public void delete(Long id) { productRepository.deleteById(id); }
}






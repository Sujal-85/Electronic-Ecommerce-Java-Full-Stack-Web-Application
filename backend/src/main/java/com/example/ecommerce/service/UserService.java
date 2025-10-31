package com.example.ecommerce.service;

import com.example.ecommerce.model.User;
import com.example.ecommerce.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> listUsers() { return userRepository.findAll(); }
    public User setRole(Long id, String role) {
        User u = userRepository.findById(id).orElseThrow();
        u.setRole(role);
        return userRepository.save(u);
    }
}






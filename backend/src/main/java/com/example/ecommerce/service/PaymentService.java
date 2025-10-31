package com.example.ecommerce.service;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;

@Service
public class PaymentService {
    private final RazorpayClient razorpayClient;
    private final String keySecret;

    public PaymentService(@Value("${razorpay.key.id}") String keyId,
                          @Value("${razorpay.key.secret}") String keySecret) {
        this.keySecret = keySecret;
        try {
            // RazorpayClient expects key_id and key_secret as separate constructor parameters
            this.razorpayClient = new RazorpayClient(keyId, keySecret);
        } catch (RazorpayException e) {
            throw new RuntimeException("Failed to initialize Razorpay client: " + e.getMessage(), e);
        }
    }

    public Order createRazorpayOrder(BigDecimal amount, String receipt) throws RazorpayException {
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amount.multiply(BigDecimal.valueOf(100)).intValue()); // Amount in paise
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", receipt);
        
        return razorpayClient.orders.create(orderRequest);
    }

    public boolean verifyPayment(String orderId, String paymentId, String signature) {
        // Validate input parameters
        if (orderId == null || orderId.isEmpty() || 
            paymentId == null || paymentId.isEmpty() || 
            signature == null || signature.isEmpty()) {
            return false;
        }
        
        try {
            String message = orderId + "|" + paymentId;
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(keySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] hash = mac.doFinal(message.getBytes(StandardCharsets.UTF_8));
            String generatedSignature = bytesToHex(hash);
            
            return generatedSignature.equals(signature);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder result = new StringBuilder();
        for (byte b : bytes) {
            result.append(String.format("%02x", b));
        }
        return result.toString();
    }
}


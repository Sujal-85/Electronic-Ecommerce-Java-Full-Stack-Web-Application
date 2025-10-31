package com.example.ecommerce.controller;

import java.math.BigDecimal;
import java.util.Map;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ecommerce.model.Order;
import com.example.ecommerce.service.OrderService;
import com.example.ecommerce.service.PaymentService;
import com.razorpay.RazorpayException;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {
    private final PaymentService paymentService;
    private final OrderService orderService;
    private final String razorpayKeyId;

    public PaymentController(PaymentService paymentService, OrderService orderService,
                            @Value("${razorpay.key.id}") String razorpayKeyId) {
        this.paymentService = paymentService;
        this.orderService = orderService;
        this.razorpayKeyId = razorpayKeyId;
    }

    @PostMapping("/create-order")
    public ResponseEntity<?> createRazorpayOrder(@AuthenticationPrincipal UserDetails principal,
                                                   @RequestBody Map<String, Object> request) {
        try {
            Object amountObj = request.get("amount");
            if (amountObj == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Missing amount parameter"));
            }
            
            BigDecimal amount;
            try {
                amount = new BigDecimal(amountObj.toString());
                if (amount.compareTo(BigDecimal.ZERO) <= 0) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Amount must be greater than zero"));
                }
            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid amount format"));
            }
            
            String receipt = "receipt_" + System.currentTimeMillis();
            
            com.razorpay.Order rzOrder = paymentService.createRazorpayOrder(amount, receipt);
            
            // Convert Razorpay order to JSONObject for safe extraction
            JSONObject orderJson = rzOrder.toJson();
            
            JSONObject response = new JSONObject();
            response.put("orderId", orderJson.getString("id"));
            response.put("amount", orderJson.getInt("amount"));
            response.put("currency", orderJson.getString("currency"));
            response.put("keyId", razorpayKeyId);
            
            return ResponseEntity.ok(response.toMap());
        } catch (RazorpayException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to create payment order: " + e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid request: " + e.getMessage()));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@AuthenticationPrincipal UserDetails principal,
                                           @RequestBody Map<String, String> request) {
        try {
            String orderId = request.get("razorpayOrderId");
            String paymentId = request.get("razorpayPaymentId");
            String signature = request.get("razorpaySignature");
            String orderDbIdStr = request.get("orderId");
            
            // Validate required parameters
            if (orderId == null || orderId.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Missing razorpayOrderId"));
            }
            
            if (paymentId == null || paymentId.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Missing razorpayPaymentId"));
            }
            
            if (signature == null || signature.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Missing razorpaySignature"));
            }
            
            if (orderDbIdStr == null || orderDbIdStr.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Missing orderId"));
            }
            
            Long orderDbId;
            try {
                orderDbId = Long.parseLong(orderDbIdStr);
            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid orderId format"));
            }
            
            boolean isValid = paymentService.verifyPayment(orderId, paymentId, signature);
            
            if (isValid) {
                Order order = orderService.findById(orderDbId);
                order.setPaymentStatus("PAID");
                order.setStatus("PLACED");
                order.setRazorpayOrderId(orderId);
                order.setRazorpayPaymentId(paymentId);
                order.setRazorpaySignature(signature);
                orderService.saveOrder(order);
                
                return ResponseEntity.ok(Map.of("status", "success", "message", "Payment verified successfully"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("status", "failed", "message", "Payment verification failed"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Verification error: " + e.getMessage()));
        }
    }
}


package com.creditcard.management.controller;

import com.creditcard.management.dto.TransactionQueryRequest;
import com.creditcard.management.entity.Transaction;
import com.creditcard.management.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/transactions")
@PreAuthorize("hasRole('USER')")
public class TransactionController {
    
    @Autowired
    private TransactionService transactionService;
    
    @GetMapping
    public ResponseEntity<Page<Transaction>> getAllTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "transactionDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection) {
        
        Page<Transaction> transactions = transactionService.getAllTransactions(page, size, sortBy, sortDirection);
        return ResponseEntity.ok(transactions);
    }
    
    @PostMapping("/search")
    public ResponseEntity<Page<Transaction>> searchTransactions(@RequestBody TransactionQueryRequest request) {
        Page<Transaction> transactions = transactionService.searchTransactions(request);
        return ResponseEntity.ok(transactions);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long id) {
        Transaction transaction = transactionService.getTransactionById(id);
        if (transaction != null) {
            return ResponseEntity.ok(transaction);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/card/{cardNumber}")
    public ResponseEntity<List<Transaction>> getTransactionsByCardNumber(@PathVariable String cardNumber) {
        List<Transaction> transactions = transactionService.getTransactionsByCardNumber(cardNumber);
        return ResponseEntity.ok(transactions);
    }
    
    @GetMapping("/stats/total-amount")
    public ResponseEntity<BigDecimal> getTotalAmountByDateRange(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        
        LocalDateTime start = LocalDateTime.parse(startDate);
        LocalDateTime end = LocalDateTime.parse(endDate);
        
        BigDecimal totalAmount = transactionService.getTotalAmountByDateRange(start, end);
        return ResponseEntity.ok(totalAmount != null ? totalAmount : BigDecimal.ZERO);
    }
    
    @GetMapping("/stats/count/{status}")
    public ResponseEntity<Long> getTransactionCountByStatus(@PathVariable String status) {
        try {
            Transaction.TransactionStatus transactionStatus = Transaction.TransactionStatus.valueOf(status.toUpperCase());
            Long count = transactionService.getTransactionCountByStatus(transactionStatus);
            return ResponseEntity.ok(count != null ? count : 0L);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
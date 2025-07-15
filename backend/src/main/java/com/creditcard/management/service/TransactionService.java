package com.creditcard.management.service;

import com.creditcard.management.dto.TransactionQueryRequest;
import com.creditcard.management.entity.Transaction;
import com.creditcard.management.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionService {
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    public Page<Transaction> getAllTransactions(int page, int size, String sortBy, String sortDirection) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return transactionRepository.findAll(pageable);
    }
    
    public Page<Transaction> searchTransactions(TransactionQueryRequest request) {
        // Parse status
        Transaction.TransactionStatus status = null;
        if (StringUtils.hasText(request.getStatus())) {
            try {
                status = Transaction.TransactionStatus.valueOf(request.getStatus().toUpperCase());
            } catch (IllegalArgumentException e) {
                // Invalid status, ignore
            }
        }
        
        // Create sort and pageable
        Sort sort = Sort.by(Sort.Direction.fromString(request.getSortDirection()), request.getSortBy());
        Pageable pageable = PageRequest.of(request.getPage(), request.getSize(), sort);
        
        // Apply filters
        return transactionRepository.findTransactionsWithFilters(
                StringUtils.hasText(request.getCardNumber()) ? request.getCardNumber() : null,
                StringUtils.hasText(request.getMerchantName()) ? request.getMerchantName() : null,
                request.getStartDate(),
                request.getEndDate(),
                request.getMinAmount(),
                request.getMaxAmount(),
                status,
                StringUtils.hasText(request.getCurrency()) ? request.getCurrency() : null,
                pageable
        );
    }
    
    public Transaction getTransactionById(Long id) {
        return transactionRepository.findById(id).orElse(null);
    }
    
    public List<Transaction> getTransactionsByCardNumber(String cardNumber) {
        return transactionRepository.findByCardNumber(cardNumber);
    }
    
    public BigDecimal getTotalAmountByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return transactionRepository.getTotalAmountByDateRange(startDate, endDate);
    }
    
    public Long getTransactionCountByStatus(Transaction.TransactionStatus status) {
        return transactionRepository.countByStatus(status);
    }
}
package com.creditcard.management.repository;

import com.creditcard.management.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    Page<Transaction> findAll(Pageable pageable);
    
    List<Transaction> findByCardNumber(String cardNumber);
    
    List<Transaction> findByMerchantNameContainingIgnoreCase(String merchantName);
    
    List<Transaction> findByStatus(Transaction.TransactionStatus status);
    
    List<Transaction> findByTransactionDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Transaction> findByAmountBetween(BigDecimal minAmount, BigDecimal maxAmount);
    
    @Query("SELECT t FROM Transaction t WHERE " +
           "(:cardNumber IS NULL OR t.cardNumber = :cardNumber) AND " +
           "(:merchantName IS NULL OR LOWER(t.merchantName) LIKE LOWER(CONCAT('%', :merchantName, '%'))) AND " +
           "(:startDate IS NULL OR t.transactionDate >= :startDate) AND " +
           "(:endDate IS NULL OR t.transactionDate <= :endDate) AND " +
           "(:minAmount IS NULL OR t.amount >= :minAmount) AND " +
           "(:maxAmount IS NULL OR t.amount <= :maxAmount) AND " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:currency IS NULL OR t.currency = :currency)")
    Page<Transaction> findTransactionsWithFilters(
            @Param("cardNumber") String cardNumber,
            @Param("merchantName") String merchantName,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("minAmount") BigDecimal minAmount,
            @Param("maxAmount") BigDecimal maxAmount,
            @Param("status") Transaction.TransactionStatus status,
            @Param("currency") String currency,
            Pageable pageable
    );
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.status = :status")
    Long countByStatus(@Param("status") Transaction.TransactionStatus status);
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.status = 'SUCCESS' AND t.transactionDate BETWEEN :startDate AND :endDate")
    BigDecimal getTotalAmountByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
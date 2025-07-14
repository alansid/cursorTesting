package com.creditcard.management.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "TRANSACTIONS")
public class Transaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;
    
    @NotBlank
    @Column(name = "CARD_NUMBER", nullable = false, length = 16)
    private String cardNumber;
    
    @NotNull
    @Column(name = "TRANSACTION_DATE", nullable = false)
    private LocalDateTime transactionDate;
    
    @NotNull
    @Column(name = "AMOUNT", nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;
    
    @NotBlank
    @Column(name = "MERCHANT_NAME", nullable = false)
    private String merchantName;
    
    @Column(name = "MERCHANT_LOCATION")
    private String merchantLocation;
    
    @NotBlank
    @Column(name = "CURRENCY", nullable = false, length = 3)
    private String currency;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS", nullable = false)
    private TransactionStatus status;
    
    @Column(name = "TRANSACTION_TYPE", length = 50)
    private String transactionType;
    
    @Column(name = "REFERENCE_NUMBER")
    private String referenceNumber;
    
    @Column(name = "DESCRIPTION")
    private String description;
    
    public enum TransactionStatus {
        SUCCESS, FAILED, REFUND, PENDING
    }
    
    public Transaction() {}
    
    public Transaction(String cardNumber, LocalDateTime transactionDate, BigDecimal amount, 
                      String merchantName, String merchantLocation, String currency, 
                      TransactionStatus status) {
        this.cardNumber = cardNumber;
        this.transactionDate = transactionDate;
        this.amount = amount;
        this.merchantName = merchantName;
        this.merchantLocation = merchantLocation;
        this.currency = currency;
        this.status = status;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getCardNumber() {
        return cardNumber;
    }
    
    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }
    
    public LocalDateTime getTransactionDate() {
        return transactionDate;
    }
    
    public void setTransactionDate(LocalDateTime transactionDate) {
        this.transactionDate = transactionDate;
    }
    
    public BigDecimal getAmount() {
        return amount;
    }
    
    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
    
    public String getMerchantName() {
        return merchantName;
    }
    
    public void setMerchantName(String merchantName) {
        this.merchantName = merchantName;
    }
    
    public String getMerchantLocation() {
        return merchantLocation;
    }
    
    public void setMerchantLocation(String merchantLocation) {
        this.merchantLocation = merchantLocation;
    }
    
    public String getCurrency() {
        return currency;
    }
    
    public void setCurrency(String currency) {
        this.currency = currency;
    }
    
    public TransactionStatus getStatus() {
        return status;
    }
    
    public void setStatus(TransactionStatus status) {
        this.status = status;
    }
    
    public String getTransactionType() {
        return transactionType;
    }
    
    public void setTransactionType(String transactionType) {
        this.transactionType = transactionType;
    }
    
    public String getReferenceNumber() {
        return referenceNumber;
    }
    
    public void setReferenceNumber(String referenceNumber) {
        this.referenceNumber = referenceNumber;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
}
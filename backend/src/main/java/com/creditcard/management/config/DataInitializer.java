package com.creditcard.management.config;

import com.creditcard.management.entity.Transaction;
import com.creditcard.management.entity.User;
import com.creditcard.management.repository.TransactionRepository;
import com.creditcard.management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create test user if not exists
        if (!userRepository.existsByUsername("00000")) {
            User testUser = new User("00000", passwordEncoder.encode("12345"));
            userRepository.save(testUser);
            System.out.println("Test user created: username=00000, password=12345");
        }

        // Create sample transactions if not exists
        if (transactionRepository.count() == 0) {
            List<Transaction> sampleTransactions = Arrays.asList(
                new Transaction("1234567890123456", LocalDateTime.now().minusDays(1), 
                               new BigDecimal("150.00"), "Amazon", "Online", "USD", Transaction.TransactionStatus.SUCCESS),
                new Transaction("1234567890123456", LocalDateTime.now().minusDays(2), 
                               new BigDecimal("75.50"), "Starbucks", "New York", "USD", Transaction.TransactionStatus.SUCCESS),
                new Transaction("1234567890123456", LocalDateTime.now().minusDays(3), 
                               new BigDecimal("1200.00"), "Apple Store", "California", "USD", Transaction.TransactionStatus.SUCCESS),
                new Transaction("1234567890123456", LocalDateTime.now().minusDays(4), 
                               new BigDecimal("25.99"), "McDonald's", "Texas", "USD", Transaction.TransactionStatus.FAILED),
                new Transaction("9876543210987654", LocalDateTime.now().minusDays(5), 
                               new BigDecimal("500.00"), "Best Buy", "Florida", "USD", Transaction.TransactionStatus.SUCCESS),
                new Transaction("9876543210987654", LocalDateTime.now().minusDays(6), 
                               new BigDecimal("89.99"), "Target", "Illinois", "USD", Transaction.TransactionStatus.REFUND),
                new Transaction("9876543210987654", LocalDateTime.now().minusDays(7), 
                               new BigDecimal("299.99"), "Home Depot", "Nevada", "USD", Transaction.TransactionStatus.SUCCESS),
                new Transaction("1111222233334444", LocalDateTime.now().minusDays(8), 
                               new BigDecimal("45.00"), "Uber", "Washington", "USD", Transaction.TransactionStatus.SUCCESS),
                new Transaction("1111222233334444", LocalDateTime.now().minusDays(9), 
                               new BigDecimal("120.00"), "Hotel Booking", "Las Vegas", "USD", Transaction.TransactionStatus.PENDING),
                new Transaction("1111222233334444", LocalDateTime.now().minusDays(10), 
                               new BigDecimal("67.80"), "Gas Station", "Arizona", "USD", Transaction.TransactionStatus.SUCCESS)
            );

            // Set additional properties for transactions
            for (int i = 0; i < sampleTransactions.size(); i++) {
                Transaction t = sampleTransactions.get(i);
                t.setTransactionType("PURCHASE");
                t.setReferenceNumber("REF" + String.format("%06d", i + 1));
                t.setDescription("Sample transaction " + (i + 1));
            }

            transactionRepository.saveAll(sampleTransactions);
            System.out.println("Sample transactions created: " + sampleTransactions.size() + " records");
        }
    }
}
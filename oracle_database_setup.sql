-- =============================================================================
-- Oracle Database Setup Script for Credit Card Management System
-- =============================================================================

-- 删除现有表（如果存在）
DROP TABLE TRANSACTIONS CASCADE CONSTRAINTS;
DROP TABLE USERS CASCADE CONSTRAINTS;

-- 删除序列（如果存在）
DROP SEQUENCE USERS_SEQ;
DROP SEQUENCE TRANSACTIONS_SEQ;

-- =============================================================================
-- 创建序列
-- =============================================================================

-- 用户表序列
CREATE SEQUENCE USERS_SEQ
START WITH 1
INCREMENT BY 1
NOCACHE
NOCYCLE;

-- 交易表序列
CREATE SEQUENCE TRANSACTIONS_SEQ
START WITH 1
INCREMENT BY 1
NOCACHE
NOCYCLE;

-- =============================================================================
-- 创建表结构
-- =============================================================================

-- 用户表
CREATE TABLE USERS (
    ID NUMBER(19) PRIMARY KEY,
    USERNAME VARCHAR2(50) NOT NULL UNIQUE,
    PASSWORD VARCHAR2(120) NOT NULL,
    ENABLED NUMBER(1) DEFAULT 1 NOT NULL,
    CONSTRAINT CHK_USERS_ENABLED CHECK (ENABLED IN (0, 1))
);

-- 交易表
CREATE TABLE TRANSACTIONS (
    ID NUMBER(19) PRIMARY KEY,
    CARD_NUMBER VARCHAR2(16) NOT NULL,
    TRANSACTION_DATE TIMESTAMP NOT NULL,
    AMOUNT NUMBER(15,2) NOT NULL,
    MERCHANT_NAME VARCHAR2(200) NOT NULL,
    MERCHANT_LOCATION VARCHAR2(200),
    CURRENCY VARCHAR2(3) NOT NULL,
    STATUS VARCHAR2(20) NOT NULL,
    TRANSACTION_TYPE VARCHAR2(50),
    REFERENCE_NUMBER VARCHAR2(100),
    DESCRIPTION VARCHAR2(500),
    CONSTRAINT CHK_TRANSACTIONS_STATUS CHECK (STATUS IN ('SUCCESS', 'FAILED', 'REFUND', 'PENDING')),
    CONSTRAINT CHK_TRANSACTIONS_AMOUNT CHECK (AMOUNT >= 0)
);

-- =============================================================================
-- 创建索引
-- =============================================================================

-- 用户表索引
CREATE INDEX IDX_USERS_USERNAME ON USERS(USERNAME);

-- 交易表索引
CREATE INDEX IDX_TRANSACTIONS_CARD_NUMBER ON TRANSACTIONS(CARD_NUMBER);
CREATE INDEX IDX_TRANSACTIONS_DATE ON TRANSACTIONS(TRANSACTION_DATE);
CREATE INDEX IDX_TRANSACTIONS_MERCHANT ON TRANSACTIONS(MERCHANT_NAME);
CREATE INDEX IDX_TRANSACTIONS_STATUS ON TRANSACTIONS(STATUS);
CREATE INDEX IDX_TRANSACTIONS_AMOUNT ON TRANSACTIONS(AMOUNT);

-- =============================================================================
-- 创建触发器（自动生成ID）
-- =============================================================================

-- 用户表触发器
CREATE OR REPLACE TRIGGER TRG_USERS_ID
BEFORE INSERT ON USERS
FOR EACH ROW
BEGIN
    IF :NEW.ID IS NULL THEN
        :NEW.ID := USERS_SEQ.NEXTVAL;
    END IF;
END;
/

-- 交易表触发器
CREATE OR REPLACE TRIGGER TRG_TRANSACTIONS_ID
BEFORE INSERT ON TRANSACTIONS
FOR EACH ROW
BEGIN
    IF :NEW.ID IS NULL THEN
        :NEW.ID := TRANSACTIONS_SEQ.NEXTVAL;
    END IF;
END;
/

-- =============================================================================
-- 插入初始数据
-- =============================================================================

-- 插入测试用户
-- 密码: 12345 (已加密，实际使用时应该用BCrypt加密)
INSERT INTO USERS (USERNAME, PASSWORD, ENABLED) VALUES 
('00000', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSfFtt/jJ8zWAhJPgzgY/9G/u', 1);

-- 插入样本交易数据
INSERT INTO TRANSACTIONS (CARD_NUMBER, TRANSACTION_DATE, AMOUNT, MERCHANT_NAME, MERCHANT_LOCATION, CURRENCY, STATUS, TRANSACTION_TYPE, REFERENCE_NUMBER, DESCRIPTION) VALUES
('1234567890123456', TIMESTAMP '2024-01-15 10:30:00', 150.00, '7-Eleven', '台北市信义區', 'TWD', 'SUCCESS', 'PURCHASE', 'TXN20240115001', '便利商店購物'),
('1234567890123456', TIMESTAMP '2024-01-15 14:20:00', 1200.00, '全家便利商店', '台北市大安區', 'TWD', 'SUCCESS', 'PURCHASE', 'TXN20240115002', '便利商店購物'),
('1234567890123456', TIMESTAMP '2024-01-16 09:15:00', 2500.00, '誠品書店', '台北市信義區', 'TWD', 'SUCCESS', 'PURCHASE', 'TXN20240116001', '書籍購買'),
('1234567890123456', TIMESTAMP '2024-01-16 16:45:00', 680.00, '麥當勞', '台北市松山區', 'TWD', 'SUCCESS', 'PURCHASE', 'TXN20240116002', '餐飲消費'),
('1234567890123456', TIMESTAMP '2024-01-17 11:30:00', 50.00, '星巴克', '台北市中山區', 'TWD', 'FAILED', 'PURCHASE', 'TXN20240117001', '咖啡購買'),
('1234567890123456', TIMESTAMP '2024-01-17 19:20:00', 3200.00, '新光三越', '台北市信義區', 'TWD', 'SUCCESS', 'PURCHASE', 'TXN20240117002', '百貨購物'),
('1234567890123456', TIMESTAMP '2024-01-18 08:45:00', 120.00, '85度C', '台北市內湖區', 'TWD', 'SUCCESS', 'PURCHASE', 'TXN20240118001', '早餐購買'),
('1234567890123456', TIMESTAMP '2024-01-18 13:10:00', 1500.00, '屈臣氏', '台北市士林區', 'TWD', 'SUCCESS', 'PURCHASE', 'TXN20240118002', '藥妝購買'),
('1234567890123456', TIMESTAMP '2024-01-19 15:30:00', 800.00, '家樂福', '台北市北投區', 'TWD', 'PENDING', 'PURCHASE', 'TXN20240119001', '生鮮購買'),
('1234567890123456', TIMESTAMP '2024-01-19 18:15:00', 450.00, '台北101美食街', '台北市信義區', 'TWD', 'SUCCESS', 'PURCHASE', 'TXN20240119002', '餐飲消費'),

-- 額外的不同卡號交易數據
('2345678901234567', TIMESTAMP '2024-01-15 12:00:00', 2000.00, 'SOGO百貨', '台北市忠孝東路', 'TWD', 'SUCCESS', 'PURCHASE', 'TXN20240115003', '服飾購買'),
('2345678901234567', TIMESTAMP '2024-01-16 14:30:00', 500.00, '康是美', '台北市西門町', 'TWD', 'SUCCESS', 'PURCHASE', 'TXN20240116003', '藥妝購買'),
('2345678901234567', TIMESTAMP '2024-01-17 10:15:00', 1800.00, '遠百信義A13', '台北市信義區', 'TWD', 'SUCCESS', 'PURCHASE', 'TXN20240117003', '百貨購物'),
('2345678901234567', TIMESTAMP '2024-01-18 16:45:00', 350.00, '鼎泰豐', '台北市東區', 'TWD', 'SUCCESS', 'PURCHASE', 'TXN20240118003', '中式料理'),
('2345678901234567', TIMESTAMP '2024-01-19 11:20:00', 100.00, '路易莎咖啡', '台北市大直', 'TWD', 'FAILED', 'PURCHASE', 'TXN20240119003', '咖啡購買'),

-- 國外交易數據
('3456789012345678', TIMESTAMP '2024-01-20 09:30:00', 50.00, 'Starbucks', 'New York, USA', 'USD', 'SUCCESS', 'PURCHASE', 'TXN20240120001', 'Coffee Purchase'),
('3456789012345678', TIMESTAMP '2024-01-20 15:45:00', 200.00, 'Apple Store', 'California, USA', 'USD', 'SUCCESS', 'PURCHASE', 'TXN20240120002', 'Electronics Purchase'),
('3456789012345678', TIMESTAMP '2024-01-21 10:15:00', 85.00, 'McDonalds', 'Tokyo, Japan', 'JPY', 'SUCCESS', 'PURCHASE', 'TXN20240121001', 'Food Purchase'),
('3456789012345678', TIMESTAMP '2024-01-21 14:20:00', 30.00, 'Lawson', 'Shibuya, Japan', 'JPY', 'SUCCESS', 'PURCHASE', 'TXN20240121002', 'Convenience Store'),
('3456789012345678', TIMESTAMP '2024-01-22 08:30:00', 150.00, 'Tesco', 'London, UK', 'GBP', 'PENDING', 'PURCHASE', 'TXN20240122001', 'Grocery Shopping');

-- =============================================================================
-- 創建視圖（可選）
-- =============================================================================

-- 交易統計視圖
CREATE OR REPLACE VIEW V_TRANSACTION_STATS AS
SELECT 
    CARD_NUMBER,
    COUNT(*) AS TOTAL_TRANSACTIONS,
    SUM(CASE WHEN STATUS = 'SUCCESS' THEN AMOUNT ELSE 0 END) AS TOTAL_SUCCESS_AMOUNT,
    SUM(CASE WHEN STATUS = 'FAILED' THEN 1 ELSE 0 END) AS FAILED_COUNT,
    SUM(CASE WHEN STATUS = 'PENDING' THEN 1 ELSE 0 END) AS PENDING_COUNT,
    MIN(TRANSACTION_DATE) AS FIRST_TRANSACTION,
    MAX(TRANSACTION_DATE) AS LAST_TRANSACTION
FROM TRANSACTIONS
GROUP BY CARD_NUMBER;

-- 每日交易統計視圖
CREATE OR REPLACE VIEW V_DAILY_TRANSACTION_STATS AS
SELECT 
    TRUNC(TRANSACTION_DATE) AS TRANSACTION_DATE,
    COUNT(*) AS TRANSACTION_COUNT,
    SUM(AMOUNT) AS TOTAL_AMOUNT,
    AVG(AMOUNT) AS AVERAGE_AMOUNT,
    MIN(AMOUNT) AS MIN_AMOUNT,
    MAX(AMOUNT) AS MAX_AMOUNT
FROM TRANSACTIONS
WHERE STATUS = 'SUCCESS'
GROUP BY TRUNC(TRANSACTION_DATE)
ORDER BY TRUNC(TRANSACTION_DATE);

-- =============================================================================
-- 創建存儲過程（可選）
-- =============================================================================

-- 獲取指定卡號的交易統計
CREATE OR REPLACE PROCEDURE GET_CARD_TRANSACTION_STATS(
    p_card_number IN VARCHAR2,
    p_cursor OUT SYS_REFCURSOR
) AS
BEGIN
    OPEN p_cursor FOR
        SELECT 
            STATUS,
            COUNT(*) AS TRANSACTION_COUNT,
            SUM(AMOUNT) AS TOTAL_AMOUNT,
            AVG(AMOUNT) AS AVERAGE_AMOUNT
        FROM TRANSACTIONS
        WHERE CARD_NUMBER = p_card_number
        GROUP BY STATUS;
END;
/

-- =============================================================================
-- 權限設置（根據需要調整）
-- =============================================================================

-- 如果有特定的應用用戶，可以授予相應權限
-- GRANT SELECT, INSERT, UPDATE, DELETE ON USERS TO [APP_USER];
-- GRANT SELECT, INSERT, UPDATE, DELETE ON TRANSACTIONS TO [APP_USER];
-- GRANT SELECT ON V_TRANSACTION_STATS TO [APP_USER];
-- GRANT SELECT ON V_DAILY_TRANSACTION_STATS TO [APP_USER];

-- =============================================================================
-- 驗證數據
-- =============================================================================

-- 檢查用戶數據
SELECT 'USERS' AS TABLE_NAME, COUNT(*) AS RECORD_COUNT FROM USERS
UNION ALL
SELECT 'TRANSACTIONS' AS TABLE_NAME, COUNT(*) AS RECORD_COUNT FROM TRANSACTIONS;

-- 檢查交易狀態分布
SELECT STATUS, COUNT(*) AS COUNT FROM TRANSACTIONS GROUP BY STATUS;

-- 檢查卡號分布
SELECT CARD_NUMBER, COUNT(*) AS TRANSACTION_COUNT FROM TRANSACTIONS GROUP BY CARD_NUMBER;

-- =============================================================================
-- 備註
-- =============================================================================

/*
此腳本包含：
1. 完整的表結構創建
2. 序列和觸發器設置
3. 索引創建以提高查詢性能
4. 測試數據插入
5. 實用的視圖和存儲過程
6. 數據驗證查詢

使用說明：
1. 確保Oracle數據庫已啟動
2. 以具有適當權限的用戶身份執行此腳本
3. 測試用戶：用戶名 00000，密碼 12345
4. 包含多種交易狀態和不同貨幣的測試數據

注意：
- 密碼已使用BCrypt加密
- 金額使用NUMBER(15,2)類型確保精度
- 日期使用TIMESTAMP類型支持時區
- 包含適當的約束和索引
*/

COMMIT;

-- 顯示完成信息
SELECT 'Database setup completed successfully!' AS STATUS FROM DUAL;
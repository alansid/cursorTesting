# Oracle数据库部署说明

## 📋 概述

本文档提供了信用卡管理系统Oracle数据库的完整部署说明，包含两个SQL脚本：

1. **oracle_database_setup.sql** - 完整版脚本（推荐生产环境使用）
2. **oracle_simple_setup.sql** - 简化版脚本（适合快速测试）

## 📊 数据库结构

### 表结构说明

#### 1. USERS表（用户表）
| 字段名 | 数据类型 | 约束 | 说明 |
|--------|----------|------|------|
| ID | NUMBER(19) | PRIMARY KEY | 用户ID（自动递增） |
| USERNAME | VARCHAR2(50) | NOT NULL, UNIQUE | 用户名 |
| PASSWORD | VARCHAR2(120) | NOT NULL | 加密后的密码 |
| ENABLED | NUMBER(1) | DEFAULT 1 | 是否启用（1=启用，0=禁用） |

#### 2. TRANSACTIONS表（交易表）
| 字段名 | 数据类型 | 约束 | 说明 |
|--------|----------|------|------|
| ID | NUMBER(19) | PRIMARY KEY | 交易ID（自动递增） |
| CARD_NUMBER | VARCHAR2(16) | NOT NULL | 信用卡号 |
| TRANSACTION_DATE | TIMESTAMP | NOT NULL | 交易时间 |
| AMOUNT | NUMBER(15,2) | NOT NULL | 交易金额 |
| MERCHANT_NAME | VARCHAR2(200) | NOT NULL | 商户名称 |
| MERCHANT_LOCATION | VARCHAR2(200) | NULL | 商户地址 |
| CURRENCY | VARCHAR2(3) | NOT NULL | 货币代码 |
| STATUS | VARCHAR2(20) | NOT NULL | 交易状态 |
| TRANSACTION_TYPE | VARCHAR2(50) | NULL | 交易类型 |
| REFERENCE_NUMBER | VARCHAR2(100) | NULL | 参考号码 |
| DESCRIPTION | VARCHAR2(500) | NULL | 交易描述 |

### 交易状态说明
- **SUCCESS** - 交易成功
- **FAILED** - 交易失败
- **PENDING** - 待处理
- **REFUND** - 退款

## 🚀 部署步骤

### 前提条件
- Oracle Database 11g 或更高版本
- 具有创建表、序列、索引、触发器权限的数据库用户
- SQL*Plus、Oracle SQL Developer 或其他Oracle客户端工具

### 方法1：使用完整版脚本（推荐）

```sql
-- 1. 连接到Oracle数据库
sqlplus username/password@database

-- 2. 执行完整版脚本
@oracle_database_setup.sql
```

### 方法2：使用简化版脚本

```sql
-- 1. 连接到Oracle数据库
sqlplus username/password@database

-- 2. 执行简化版脚本
@oracle_simple_setup.sql
```

### 方法3：通过SQL Developer执行

1. 打开Oracle SQL Developer
2. 连接到目标数据库
3. 打开对应的SQL脚本文件
4. 按F5执行脚本

## 🔧 验证部署

### 检查表和数据
```sql
-- 检查表是否创建成功
SELECT table_name FROM user_tables WHERE table_name IN ('USERS', 'TRANSACTIONS');

-- 检查数据记录数
SELECT 'USERS' AS TABLE_NAME, COUNT(*) AS RECORD_COUNT FROM USERS
UNION ALL
SELECT 'TRANSACTIONS' AS TABLE_NAME, COUNT(*) AS RECORD_COUNT FROM TRANSACTIONS;

-- 检查测试用户
SELECT * FROM USERS WHERE USERNAME = '00000';

-- 检查交易数据
SELECT CARD_NUMBER, COUNT(*) AS TRANSACTION_COUNT 
FROM TRANSACTIONS 
GROUP BY CARD_NUMBER;
```

### 检查序列
```sql
-- 检查序列是否创建
SELECT sequence_name, last_number FROM user_sequences 
WHERE sequence_name IN ('USERS_SEQ', 'TRANSACTIONS_SEQ');
```

### 检查索引
```sql
-- 检查索引是否创建
SELECT index_name, table_name FROM user_indexes 
WHERE table_name IN ('USERS', 'TRANSACTIONS');
```

## 📝 测试数据

### 测试用户账号
- **用户名**: 00000
- **密码**: 12345
- **加密后密码**: $2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSfFtt/jJ8zWAhJPgzgY/9G/u

### 测试交易数据
脚本包含以下测试数据：

#### 卡号 1234567890123456
- 10笔交易记录
- 包含台湾地区各种商户
- 包含SUCCESS、FAILED、PENDING状态

#### 卡号 2345678901234567
- 5笔交易记录
- 台湾地区商户

#### 卡号 3456789012345678
- 5笔交易记录
- 国外商户（美国、日本、英国）
- 多种货币（USD、JPY、GBP）

## 🔍 常用查询示例

### 查看特定卡号的交易记录
```sql
SELECT * FROM TRANSACTIONS 
WHERE CARD_NUMBER = '1234567890123456'
ORDER BY TRANSACTION_DATE DESC;
```

### 查看成功交易的统计
```sql
SELECT 
    CARD_NUMBER,
    COUNT(*) AS TRANSACTION_COUNT,
    SUM(AMOUNT) AS TOTAL_AMOUNT,
    AVG(AMOUNT) AS AVERAGE_AMOUNT
FROM TRANSACTIONS 
WHERE STATUS = 'SUCCESS'
GROUP BY CARD_NUMBER;
```

### 查看日期范围内的交易
```sql
SELECT * FROM TRANSACTIONS 
WHERE TRANSACTION_DATE BETWEEN 
    TIMESTAMP '2024-01-15 00:00:00' AND 
    TIMESTAMP '2024-01-19 23:59:59'
ORDER BY TRANSACTION_DATE;
```

### 查看特定商户的交易
```sql
SELECT * FROM TRANSACTIONS 
WHERE MERCHANT_NAME LIKE '%星巴克%'
ORDER BY TRANSACTION_DATE DESC;
```

## 🛠️ 完整版脚本额外功能

### 1. 数据约束
- 交易状态约束检查
- 交易金额非负约束
- 用户启用状态约束

### 2. 视图（Views）
- **V_TRANSACTION_STATS** - 交易统计视图
- **V_DAILY_TRANSACTION_STATS** - 每日交易统计视图

### 3. 存储过程
- **GET_CARD_TRANSACTION_STATS** - 获取指定卡号的交易统计

### 4. 性能优化
- 完整的索引策略
- 触发器自动生成ID
- 优化的查询结构

## 📋 应用配置

### Spring Boot配置
确保`application.yml`配置正确：

```yaml
spring:
  datasource:
    url: jdbc:oracle:thin:@localhost:1521:xe
    username: your_username
    password: your_password
    driver-class-name: oracle.jdbc.OracleDriver
  jpa:
    hibernate:
      ddl-auto: none  # 使用SQL脚本创建表
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.OracleDialect
        format_sql: true
```

## 🔒 安全建议

1. **密码安全**
   - 生产环境中更换测试用户密码
   - 使用强密码策略

2. **数据库权限**
   - 为应用创建专用数据库用户
   - 授予最小必要权限

3. **数据加密**
   - 考虑对敏感数据进行加密存储
   - 使用SSL连接数据库

## 🚨 故障排除

### 常见错误及解决方案

1. **表已存在错误**
   ```
   解决方案：脚本开头已包含DROP TABLE语句
   ```

2. **权限不足**
   ```
   解决方案：使用具有足够权限的用户执行脚本
   ```

3. **字符集问题**
   ```
   解决方案：确保数据库字符集支持中文（如AL32UTF8）
   ```

4. **序列错误**
   ```
   解决方案：检查序列是否创建成功，必要时手动创建
   ```

## 📞 技术支持

如遇到部署问题，请检查：
1. Oracle数据库版本兼容性
2. 用户权限配置
3. 网络连接状态
4. 字符集设置

完成部署后，可以启动Spring Boot应用并使用测试账号（00000/12345）进行登录测试。
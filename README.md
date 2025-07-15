# 信用卡後端管理系統

這是一個使用 Spring Boot 3 和 Angular 18 開發的信用卡交易管理系統。

## 功能特點

- ✅ 用戶登入認證（JWT Token）
- ✅ 交易記錄查詢與明細
- ✅ 多條件篩選搜尋（卡號、交易日期、金額、商戶等）
- ✅ 交易狀態管理（成功、失敗、退款、待處理）
- ✅ 響應式 Web 介面
- ✅ RESTful API 架構

## 技術棧

### 後端
- **Spring Boot 3.2.0**
- **Spring Security** (JWT 認證)
- **Spring Data JPA** (數據持久層)
- **Oracle Database** (資料庫)
- **Maven** (依賴管理)
- **Java 17**

### 前端
- **Angular 18**
- **Bootstrap 5** (UI 框架)
- **RxJS** (響應式程式設計)
- **TypeScript**
- **SCSS** (樣式預處理器)

## 專案結構

```
├── backend/                 # Spring Boot 後端
│   ├── src/main/java/
│   │   └── com/creditcard/management/
│   │       ├── config/      # 配置類
│   │       ├── controller/  # REST 控制器
│   │       ├── dto/         # 數據傳輸對象
│   │       ├── entity/      # JPA 實體
│   │       ├── repository/  # 數據存取層
│   │       ├── security/    # 安全相關
│   │       └── service/     # 業務邏輯層
│   ├── src/main/resources/
│   │   └── application.yml  # 應用配置
│   └── pom.xml             # Maven 依賴
└── frontend/               # Angular 前端
    ├── src/
    │   ├── app/
    │   │   ├── components/  # Angular 組件
    │   │   ├── services/    # 服務層
    │   │   ├── guards/      # 路由守衛
    │   │   └── models/      # 數據模型
    │   └── assets/         # 靜態資源
    ├── angular.json        # Angular 配置
    └── package.json        # NPM 依賴
```

## 快速開始

### 前置需求

- Java 17 或更高版本
- Node.js 18 或更高版本
- Oracle Database (或可修改配置使用其他資料庫)
- Maven 3.6 或更高版本

### 資料庫設定

1. 確保 Oracle 資料庫運行在 `localhost:1521`
2. 創建資料庫用戶：
   ```sql
   CREATE USER creditcard IDENTIFIED BY password;
   GRANT CONNECT, RESOURCE TO creditcard;
   ```

### 後端設定

1. 進入後端目錄：
   ```bash
   cd backend
   ```

2. 修改 `src/main/resources/application.yml` 中的資料庫連接設定：
   ```yaml
   spring:
     datasource:
       url: jdbc:oracle:thin:@localhost:1521:xe
       username: creditcard
       password: password
   ```

3. 運行 Spring Boot 應用：
   ```bash
   mvn spring-boot:run
   ```

   後端將運行在 `http://localhost:8080`

### 前端設定

1. 進入前端目錄：
   ```bash
   cd frontend
   ```

2. 安裝依賴（如果尚未安裝）：
   ```bash
   npm install
   ```

3. 啟動開發服務器：
   ```bash
   npm start
   ```

   前端將運行在 `http://localhost:4200`

## 測試帳號

系統會自動創建一個測試帳號：

- **帳號**: `00000`
- **密碼**: `12345`

## API 端點

### 認證相關
- `POST /api/auth/signin` - 用戶登入

### 交易相關
- `GET /api/transactions` - 獲取所有交易記錄（分頁）
- `POST /api/transactions/search` - 搜尋交易記錄
- `GET /api/transactions/{id}` - 獲取特定交易詳情
- `GET /api/transactions/card/{cardNumber}` - 根據卡號獲取交易
- `GET /api/transactions/stats/total-amount` - 獲取日期範圍內總金額
- `GET /api/transactions/stats/count/{status}` - 獲取特定狀態的交易數量

## 功能說明

### 1. 交易查詢與明細
- 支援多種條件篩選：
  - 卡號
  - 交易日期範圍
  - 交易金額範圍
  - 商戶名稱
  - 交易狀態
  - 交易幣別

### 2. 篩選與排序
- 支援按交易日期、金額等欄位排序
- 升序/降序排列
- 分頁顯示結果

### 3. 交易狀態
- **SUCCESS**: 成功
- **FAILED**: 失敗
- **REFUND**: 退款
- **PENDING**: 待處理

## 開發說明

### 後端開發
- 使用 Spring Boot 的自動配置
- JWT Token 認證機制
- JPA 自動建表
- 內建測試數據初始化

### 前端開發
- Angular 18 standalone components
- Bootstrap 5 響應式設計
- RxJS 處理非同步操作
- 路由守衛保護認證頁面

## 疑難排解

### 常見問題

1. **後端啟動失敗**
   - 檢查 Oracle 資料庫連接
   - 確認 Java 17 已正確安裝
   - 檢查端口 8080 是否被佔用

2. **前端無法登入**
   - 確認後端服務正常運行
   - 檢查瀏覽器控制台錯誤訊息
   - 確認 CORS 設定正確

3. **交易數據不顯示**
   - 檢查資料庫連接
   - 確認測試數據已正確初始化
   - 檢查 API 請求是否成功

## 未來改進

- [ ] 添加交易詳情頁面
- [ ] 實現交易數據匯出功能
- [ ] 添加更多統計圖表
- [ ] 實現即時通知功能
- [ ] 添加單元測試和整合測試

## 授權

此專案僅供學習和開發參考使用。
#!/bin/bash

echo "=========================================="
echo "信用卡管理系統啟動腳本"
echo "=========================================="

# 檢查 Java 版本
echo "檢查 Java 版本..."
if ! command -v java &> /dev/null; then
    echo "❌ Java 未安裝，請先安裝 Java 17 或更高版本"
    exit 1
fi

JAVA_VERSION=$(java -version 2>&1 | head -1 | cut -d'"' -f2 | sed '/^1\./s///' | cut -d'.' -f1)
if [ "$JAVA_VERSION" -lt 17 ]; then
    echo "❌ Java 版本過低，需要 Java 17 或更高版本"
    exit 1
fi
echo "✅ Java 版本: $(java -version 2>&1 | head -1)"

# 檢查 Node.js 版本
echo "檢查 Node.js 版本..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安裝，請先安裝 Node.js 18 或更高版本"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 版本過低，需要 Node.js 18 或更高版本"
    exit 1
fi
echo "✅ Node.js 版本: $(node -v)"

# 檢查 Maven
echo "檢查 Maven..."
if ! command -v mvn &> /dev/null; then
    echo "❌ Maven 未安裝，請先安裝 Maven"
    exit 1
fi
echo "✅ Maven 版本: $(mvn -version | head -1)"

echo ""
echo "開始啟動系統..."
echo ""

# 啟動後端
echo "🚀 啟動 Spring Boot 後端..."
cd backend
echo "正在啟動後端服務器..."
echo "後端將運行在: http://localhost:8080"
echo "API 文檔: http://localhost:8080/swagger-ui.html"
echo ""

# 在背景執行後端
mvn spring-boot:run > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "後端進程 PID: $BACKEND_PID"

# 等待後端啟動
echo "等待後端啟動..."
sleep 10

# 檢查後端是否成功啟動
if ! ps -p $BACKEND_PID > /dev/null; then
    echo "❌ 後端啟動失敗，請檢查 backend.log"
    exit 1
fi

echo "✅ 後端啟動成功"

# 回到根目錄
cd ..

# 啟動前端
echo ""
echo "🚀 準備 Angular 前端..."
cd frontend

# 檢查並安裝前端依賴
if [ ! -d "node_modules" ]; then
    echo "📦 node_modules 不存在，正在安裝前端依賴..."
    npm install
    if [ $? -eq 0 ]; then
        echo "✅ 前端依賴安裝成功"
    else
        echo "❌ 前端依賴安裝失敗"
        kill $BACKEND_PID 2>/dev/null
        exit 1
    fi
else
    echo "✅ node_modules 已存在，跳過依賴安裝"
fi

echo "正在啟動前端開發服務器..."
echo "前端將運行在: http://localhost:4200"
echo ""
echo "測試帳號:"
echo "  帳號: 00000"
echo "  密碼: 12345"
echo ""

# 啟動前端（這會佔用當前終端）
npm start

# 清理：當腳本被中斷時，殺死後端進程
trap "echo '正在關閉服務...'; kill $BACKEND_PID 2>/dev/null; exit" INT TERM
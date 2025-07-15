@echo off
chcp 65001 >nul

echo ==========================================
echo 信用卡管理系統啟動腳本 (Windows)
echo ==========================================
echo.

REM 檢查 Java
echo 檢查 Java 版本...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Java 未安裝，請先安裝 Java 17 或更高版本
    pause
    exit /b 1
)

for /f "tokens=3" %%i in ('java -version 2^>^&1 ^| findstr /i "version"') do (
    set JAVA_VERSION=%%i
)
echo ✅ Java 版本: %JAVA_VERSION%

REM 檢查 Node.js
echo 檢查 Node.js 版本...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js 未安裝，請先安裝 Node.js 18 或更高版本
    pause
    exit /b 1
)

for /f %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js 版本: %NODE_VERSION%

REM 檢查 Maven
echo 檢查 Maven...
mvn --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Maven 未安裝，請先安裝 Maven
    pause
    exit /b 1
)

for /f "tokens=3" %%i in ('mvn --version 2^>^&1 ^| findstr /i "Apache Maven"') do (
    set MAVEN_VERSION=%%i
)
echo ✅ Maven 版本: %MAVEN_VERSION%

echo.
echo 開始啟動系統...
echo.

REM 啟動後端
echo 🚀 啟動 Spring Boot 後端...
cd backend
echo 正在啟動後端服務器...
echo 後端將運行在: http://localhost:8080
echo.

REM 在新視窗啟動後端
start "Spring Boot Backend" cmd /c "mvn spring-boot:run"

echo 等待後端啟動...
timeout /t 15 /nobreak >nul

echo ✅ 後端啟動中...

REM 回到根目錄
cd ..

REM 啟動前端
echo.
echo 🚀 準備 Angular 前端...
cd frontend

REM 檢查並安裝前端依賴
if not exist "node_modules" (
    echo 📦 node_modules 不存在，正在安裝前端依賴...
    npm install
    if %errorlevel% equ 0 (
        echo ✅ 前端依賴安裝成功
    ) else (
        echo ❌ 前端依賴安裝失敗
        pause
        exit /b 1
    )
) else (
    echo ✅ node_modules 已存在，跳過依賴安裝
)

echo 正在啟動前端開發服務器...
echo 前端將運行在: http://localhost:4200
echo.
echo 測試帳號:
echo   帳號: 00000
echo   密碼: 12345
echo.

REM 啟動前端
npm start

pause
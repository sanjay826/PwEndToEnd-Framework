@echo off
REM Git Push Script for Playwright Framework
setlocal enabledelayedexpansion

echo.
echo ========================================
echo Playwright Framework - GitHub Push Script
echo ========================================
echo.

cd /d d:\Pwtest

echo [1] Checking git repository...
if not exist ".git" (
    echo     Initializing git...
    git init
    echo     Git initialized
) else (
    echo     Git repository exists
)
echo.

echo [2] Configuring git...
git config --global user.name "sanjay826"
echo     User configured
echo.

echo [3] Adding remote...
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    git remote add origin https://github.com/sanjay826/PwEndToEnd-Framework.git
    echo     Remote added
) else (
    echo     Remote already exists
)
echo.

echo [4] Adding files...
git add .
echo     Files added
echo.

echo [5] Creating commit...
git commit -m "Initial commit: Professional Playwright End-to-End Test Framework for ParaBank OpenAccount

- Page Object Model (POM) architecture for maintainability
- 12 comprehensive test cases (6 core + 6 advanced scenarios)
- Reusable utility functions and test helpers
- Centralized test data management
- Multi-browser support (Chrome, Firefox, Safari)
- Professional documentation and guides
- HTML test reports and trace files
- Environment-based configuration
- Error handling and retry logic"
echo     Commit created
echo.

echo [6] Switching to main branch...
git branch -M main 2>nul
echo     On main branch
echo.

echo [7] Pushing to GitHub...
echo     Repository: https://github.com/sanjay826/PwEndToEnd-Framework.git
git push -u origin main

if errorlevel 1 (
    echo.
    echo ERROR: Push failed!
    echo Please check your GitHub credentials and permissions.
    pause
    exit /b 1
) else (
    echo.
    echo ========================================
    echo SUCCESS: Code pushed to GitHub!
    echo ========================================
    echo.
    echo Repository: https://github.com/sanjay826/PwEndToEnd-Framework
    echo.
    pause
)

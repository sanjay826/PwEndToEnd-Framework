# PowerShell Script to Push Code to GitHub

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Green
Write-Host "Playwright Framework - GitHub Push Script" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Step 1: Navigate to project directory
Write-Host "[1] Navigating to project directory..." -ForegroundColor Yellow
Set-Location d:\Pwtest
Write-Host "    ✓ Current directory: $(Get-Location)" -ForegroundColor Green
Write-Host ""

# Step 2: Check if git is initialized
Write-Host "[2] Checking git repository status..." -ForegroundColor Yellow
if (-not (Test-Path .git)) {
    Write-Host "    ! Git not initialized. Initializing..." -ForegroundColor Cyan
    git init
    Write-Host "    ✓ Git initialized" -ForegroundColor Green
} else {
    Write-Host "    ✓ Git repository already exists" -ForegroundColor Green
}
Write-Host ""

# Step 3: Configure git user (if not already configured)
Write-Host "[3] Configuring git user..." -ForegroundColor Yellow
$globalUserName = git config --global user.name 2>$null
if ([string]::IsNullOrEmpty($globalUserName)) {
    git config --global user.name "sanjay826"
    Write-Host "    ✓ Git user configured as: sanjay826" -ForegroundColor Green
} else {
    Write-Host "    ✓ Git user: $globalUserName" -ForegroundColor Green
}
Write-Host ""

# Step 4: Add remote origin
Write-Host "[4] Configuring remote repository..." -ForegroundColor Yellow
$remoteUrl = git remote get-url origin 2>$null
if ([string]::IsNullOrEmpty($remoteUrl)) {
    git remote add origin https://github.com/sanjay826/PwEndToEnd-Framework.git
    Write-Host "    ✓ Remote origin added" -ForegroundColor Green
} else {
    Write-Host "    ✓ Remote origin: $remoteUrl" -ForegroundColor Green
}
Write-Host ""

# Step 5: Check status
Write-Host "[5] Checking repository status..." -ForegroundColor Yellow
$status = git status --short
if ($status) {
    Write-Host "    Changes to be committed:" -ForegroundColor Cyan
    Write-Host $status -ForegroundColor White
} else {
    Write-Host "    ✓ No untracked changes" -ForegroundColor Green
}
Write-Host ""

# Step 6: Add all files
Write-Host "[6] Adding all files to staging area..." -ForegroundColor Yellow
git add .
$fileCount = (git ls-files | Measure-Object).Count
Write-Host "    ✓ $fileCount files staged" -ForegroundColor Green
Write-Host ""

# Step 7: Check if there are changes to commit
Write-Host "[7] Checking for changes to commit..." -ForegroundColor Yellow
$stagedChanges = git diff --cached --name-only
if ($stagedChanges) {
    Write-Host "    Files ready to commit:" -ForegroundColor Cyan
    $stagedChanges | ForEach-Object { Write-Host "      - $_" }
    Write-Host ""
    
    # Step 8: Create commit
    Write-Host "[8] Creating commit..." -ForegroundColor Yellow
    $commitMessage = @"
Initial commit: Professional Playwright End-to-End Test Framework for ParaBank OpenAccount

- Page Object Model (POM) architecture for maintainability
- 12 comprehensive test cases (6 core + 6 advanced scenarios)
- Reusable utility functions and test helpers
- Centralized test data management
- Multi-browser support (Chrome, Firefox, Safari)
- Professional documentation and guides
- HTML test reports and trace files
- Environment-based configuration
- Error handling and retry logic
"@

    git commit -m $commitMessage
    Write-Host "    ✓ Commit created successfully" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "    ! No changes to commit" -ForegroundColor Yellow
    Write-Host ""
}

# Step 9: Ensure we're on main branch
Write-Host "[9] Ensuring main branch..." -ForegroundColor Yellow
git branch -M main 2>$null
Write-Host "    ✓ On main branch" -ForegroundColor Green
Write-Host ""

# Step 10: Push to GitHub
Write-Host "[10] Pushing code to GitHub..." -ForegroundColor Yellow
Write-Host "     Repository: https://github.com/sanjay826/PwEndToEnd-Framework.git" -ForegroundColor Cyan
Write-Host "     Branch: main" -ForegroundColor Cyan
Write-Host ""

try {
    git push -u origin main
    Write-Host "    ✓ Push completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✓ Code successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Repository URL:" -ForegroundColor Yellow
    Write-Host "  https://github.com/sanjay826/PwEndToEnd-Framework" -ForegroundColor Cyan
    Write-Host ""
} catch {
    Write-Host "    ✗ Push failed!" -ForegroundColor Red
    Write-Host "    Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible solutions:" -ForegroundColor Yellow
    Write-Host "  1. Check your GitHub credentials" -ForegroundColor White
    Write-Host "  2. Ensure you have push access to the repository" -ForegroundColor White
    Write-Host "  3. Run: git push -u origin main" -ForegroundColor White
    Write-Host ""
    exit 1
}

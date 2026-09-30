@echo off
setlocal
echo ===================================================
echo   DARK BIOLINK - GITHUB PUBLISHER
echo ===================================================
echo.
set /p REPO_URL="Enter your GitHub repository URL (e.g. https://github.com/user/repo.git): "

if "%REPO_URL%"=="" (
    echo [ERROR] No URL entered. Exiting.
    pause
    exit /b 1
)

echo.
echo [1/4] Initializing Git repository...
git init -b main

echo.
echo [2/4] Staging files...
git add .

echo.
echo [3/4] Committing files...
git commit -m "feat: initial biolink release"

echo.
echo [4/4] Pushing to GitHub...
git remote remove origin 2>nul
git remote add origin %REPO_URL%
git push -u origin main --force

echo.
echo ===================================================
echo   SUCCESS! Pushed to GitHub!
echo   Go to Repo Settings -^> Pages to enable GitHub Pages.
echo ===================================================
pause

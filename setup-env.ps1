# PowerShell setup script to copy environment variables
Write-Host "Setting up environment variables..." -ForegroundColor Green

if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host ".env file created from .env.example" -ForegroundColor Yellow
    Write-Host "Please edit .env file with your actual configuration values" -ForegroundColor Yellow
} else {
    Write-Host ".env file already exists" -ForegroundColor Yellow
}

Write-Host "`nDon't forget to:" -ForegroundColor Cyan
Write-Host "1. Update MONGODB_URI with your actual MongoDB connection string" -ForegroundColor White
Write-Host "2. Update JWT_SECRET with a secure random string" -ForegroundColor White
Write-Host "3. Update NEXT_PUBLIC_GEMINI_API_KEY with your Gemini API key" -ForegroundColor White
Write-Host "4. Update EMAIL_USER and EMAIL_PASS if you plan to use email notifications" -ForegroundColor White

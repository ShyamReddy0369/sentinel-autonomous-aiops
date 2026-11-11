# Sentinel Incident Commander - Local Demo Launcher
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Starting Sentinel Incident Commander (Local Demo)     " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$rootDir = Split-Path -Parent $PSScriptRoot
Set-Location $rootDir

Write-Host "`n[1/2] Starting Flask Backend on http://127.0.0.1:5000 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$rootDir'; .\venv\Scripts\python.exe -m backend.app"

Start-Sleep -Seconds 2

Write-Host "[2/2] Starting React Frontend on http://localhost:5173 ..." -ForegroundColor Green
$frontendDir = Join-Path $rootDir "frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$frontendDir'; npm run dev"

Write-Host "`nReady for the 10-Minute Demo!" -ForegroundColor Yellow
Write-Host "Backend:  http://127.0.0.1:5000" -ForegroundColor White
Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "========================================================`n" -ForegroundColor Cyan

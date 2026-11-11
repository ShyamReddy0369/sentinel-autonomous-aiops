@echo off
echo ========================================================
echo   Starting Sentinel Incident Commander (Local Demo)
echo ========================================================
echo.

cd /d "%~dp0\.."

echo [1/2] Starting Flask Backend on http://127.0.0.1:5000 ...
start "Sentinel Backend" cmd /k "venv\Scripts\python.exe -m backend.app"

timeout /t 2 /nobreak > nul

echo [2/2] Starting React Frontend on http://localhost:5173 ...
cd frontend
start "Sentinel Frontend" cmd /k "npm run dev"

echo.
echo Both services are booting!
echo Backend:  http://127.0.0.1:5000
echo Frontend: http://localhost:5173
echo ========================================================

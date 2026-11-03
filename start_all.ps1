Write-Host "Starting AskLytix Data Analyst AI Backend and Frontend..." -ForegroundColor Cyan

Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\backend'; .\venv\Scripts\Activate.ps1; uvicorn main:app --host 127.0.0.1 --port 8000 --reload"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\frontend'; npm.cmd run dev"

Write-Host "Backend running at: http://localhost:8000" -ForegroundColor Green
Write-Host "Frontend running at: http://localhost:5173" -ForegroundColor Green

@echo off
echo Starting AskLytix Data Analyst AI Backend and Frontend...

start "AskLytix Backend" cmd /k "cd /d %~dp0backend && venv\Scripts\activate && uvicorn main:app --host 127.0.0.1 --port 8000 --reload"
start "AskLytix Frontend" cmd /k "cd /d %~dp0frontend && npm.cmd run dev"

echo Backend started at http://localhost:8000
echo Frontend started at http://localhost:5173
pause

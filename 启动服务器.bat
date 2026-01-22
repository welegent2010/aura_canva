@echo off
echo 正在启动 Aura Canvas 服务器...
echo.
echo 服务器地址: http://localhost:3000
echo 按 Ctrl+C 停止服务器
echo.
python -m http.server 3000
pause

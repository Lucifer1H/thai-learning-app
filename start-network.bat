@echo off
echo 正在启动泰语学习应用...
echo 其他人可以通过您的IP地址访问网站
echo.

REM 获取本机IP地址
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    set "ip=%%a"
    goto :found
)

:found
set ip=%ip: =%
echo 您的IP地址是: %ip%
echo 其他人可以访问: http://%ip%:3000
echo.
echo 按 Ctrl+C 停止服务器
echo.

REM 启动开发服务器，监听所有网络接口
npm run dev -- --hostname 0.0.0.0

pause

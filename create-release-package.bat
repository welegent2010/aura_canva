@echo off
chcp 65001 >nul
echo ========================================
echo  Aura Canvas 发布包创建工具 v0.2.0
echo ========================================
echo.

REM 设置版本号
set VERSION=0.2.0
set RELEASE_NAME=aura-canvas-v%VERSION%
set RELEASE_DIR=releases\%RELEASE_NAME%

echo [1/5] 清理旧的发布目录...
if exist releases rmdir /s /q releases
mkdir releases
mkdir "%RELEASE_DIR%"

echo [2/5] 复制核心文件...
copy editor.html "%RELEASE_DIR%\" >nul
copy README.md "%RELEASE_DIR%\" >nul
copy RELEASE_v0.2_README.md "%RELEASE_DIR%\" >nul
copy RELEASE_NOTES.md "%RELEASE_DIR%\" >nul
copy package.json "%RELEASE_DIR%\" >nul
copy VERSION "%RELEASE_DIR%\" >nul
copy 启动服务器.bat "%RELEASE_DIR%\" >nul
copy start-server.py "%RELEASE_DIR%\" >nul

echo [3/5] 复制资源文件夹...
xcopy /E /I /Q css "%RELEASE_DIR%\css" >nul
xcopy /E /I /Q js "%RELEASE_DIR%\js" >nul
xcopy /E /I /Q style "%RELEASE_DIR%\style" >nul

REM 如果存在example文件夹
if exist example xcopy /E /I /Q example "%RELEASE_DIR%\example" >nul

echo [4/5] 创建用户文档...
(
echo # Aura Canvas v%VERSION% - 快速开始
echo.
echo ## 安装说明
echo.
echo 1. 解压此文件到任意目录
echo 2. 双击 `editor.html` 直接打开，或
echo 3. 双击 `启动服务器.bat` 使用本地服务器
echo.
echo ## 主要功能
echo.
echo - HTML导入与编辑
echo - Google Sheets数据集成
echo - 网格卡片生成
echo - 样式模板系统
echo - Tally表单嵌入
echo.
echo ## 文档
echo.
echo - 完整文档: README.md
echo - 版本更新: RELEASE_v0.2_README.md
echo - 更新日志: RELEASE_NOTES.md
echo.
echo ## 技术支持
echo.
echo 查看 README.md 了解详细使用说明
echo.
echo ---
echo Version: %VERSION%
echo Release Date: 2026-01-25
) > "%RELEASE_DIR%\快速开始.txt"

echo [5/5] 打包成ZIP文件...
cd releases
powershell -command "Compress-Archive -Path '%RELEASE_NAME%' -DestinationPath '%RELEASE_NAME%.zip' -Force"
cd ..

echo.
echo ========================================
echo ✅ 发布包创建完成！
echo ========================================
echo.
echo 📦 发布包位置: releases\%RELEASE_NAME%.zip
echo 📁 解压预览: releases\%RELEASE_NAME%\
echo.
echo 文件大小:
dir releases\%RELEASE_NAME%.zip | findstr ".zip"
echo.
echo 🎉 现在可以分发给客户了！
echo.
pause

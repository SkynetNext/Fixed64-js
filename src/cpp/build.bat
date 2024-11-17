@echo off
setlocal

REM 设置工具的相对路径
SET NINJA_PATH=..\\..\\tools\\ninja\\
SET CMAKE_PATH=..\\..\\tools\\cmake\\bin

REM 将Ninja和CMake的路径添加到PATH中，以确保cmake能找到它们
set PATH=%CD%\\%NINJA_PATH%;%CD%\\%CMAKE_PATH%;%PATH%

set WORKSPACE=.

REM 确保EMSDK环境变量已经设置
echo EMSDK=%EMSDK%
if "%EMSDK%"=="" (
    echo Emscripten SDK is not installed or not set up correctly.
    pause
    exit /b 1
)

call :build_wasm

pause
goto :eof

:build_wasm
setlocal
set ORIGINAL_DIR=%CD%

REM 创建构建目录并进入
set BUILD_DIR=build
if not exist %BUILD_DIR% mkdir %BUILD_DIR%
cd %BUILD_DIR%
REM 使用call执行emcmake和cmake命令
call emcmake cmake -GNinja ..
if %errorlevel% neq 0 (
    cd %ORIGINAL_DIR%
    exit /b %errorlevel%
)

call cmake --build .
cd %ORIGINAL_DIR%
endlocal
goto :eof
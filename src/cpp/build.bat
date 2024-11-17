@echo off
setlocal

REM Set the relative paths for the tools
SET NINJA_PATH=..\\..\\tools\\ninja
SET CMAKE_PATH=..\\..\\tools\\cmake\\\\bin

REM Add Ninja and CMake paths to PATH to ensure cmake can find them
set PATH=%CD%\\\\%NINJA_PATH%;%CD%\\\\%CMAKE_PATH%;%PATH%

set WORKSPACE=.

REM Ensure EMSDK environment variable is set
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

REM Create the build directory and enter it
set BUILD_DIR=build
if not exist %BUILD_DIR% mkdir %BUILD_DIR%
cd %BUILD_DIR%
REM Use call to execute emcmake and cmake commands
call emcmake cmake -GNinja ..
if %errorlevel% neq 0 (
    cd %ORIGINAL_DIR%
    exit /b %errorlevel%
)

call cmake --build .
cd %ORIGINAL_DIR%
endlocal
goto :eof
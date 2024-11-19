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

REM Build for esm and cjs, each in its own build directory
call :build_wasm esm esm_build
call :build_wasm cjs cjs_build

pause
goto :eof

:build_wasm
setlocal
set GEN_TYPE=%1
set BUILD_DIR=%2
set ORIGINAL_DIR=%CD%

REM Setting TARGET_OUTPUT_PATH based on GEN_TYPE
set TARGET_OUTPUT_PATH=..\\..\\dist\\%GEN_TYPE%

echo Building for %GEN_TYPE% in directory %BUILD_DIR% with output path %TARGET_OUTPUT_PATH%

REM Create the build directory (if it does not exist) and enter it
if not exist %BUILD_DIR% mkdir %BUILD_DIR%
cd %BUILD_DIR%

REM Use call to execute emcmake and cmake commands, passing GEN_TYPE and TARGET_OUTPUT_PATH
call emcmake cmake -GNinja -DGEN_TYPE=%GEN_TYPE% -DTARGET_OUTPUT_PATH=%TARGET_OUTPUT_PATH% ..
if %errorlevel% neq 0 (
    cd %ORIGINAL_DIR%
    exit /b %errorlevel%
)

call cmake --build .
cd %ORIGINAL_DIR%
endlocal
goto :eof
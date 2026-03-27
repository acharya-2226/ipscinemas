@echo off
setlocal

REM Start Vite frontend from workspace root
pushd "%~dp0frontend"
npm run dev
set "EXIT_CODE=%ERRORLEVEL%"
popd

if not "%EXIT_CODE%"=="0" (
  echo.
  echo Frontend server failed to start. Exit code: %EXIT_CODE%
  pause
)

exit /b %EXIT_CODE%
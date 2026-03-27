@echo off
setlocal

REM Start Django backend from workspace root
pushd "%~dp0backend"
call env\Scripts\activate.bat
python manage.py runserver
set "EXIT_CODE=%ERRORLEVEL%"
popd

if not "%EXIT_CODE%"=="0" (
  echo.
  echo Backend server failed to start. Exit code: %EXIT_CODE%
  pause
)

exit /b %EXIT_CODE%
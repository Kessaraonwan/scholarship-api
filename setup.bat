@echo off
REM setup.bat — รันครั้งเดียวหลัง clone repo
REM ใช้: setup.bat <ชื่อ-service>
REM ตัวอย่าง: setup.bat notification

SET SERVICE=%1

IF "%SERVICE%"=="" (
  echo กรุณาระบุชื่อ service เช่น: setup.bat notification
  echo ตัวเลือก: auth ^ ingestion ^ core ^ analytics ^ notification ^ landing
  exit /b 1
)

SET FOLDER=service-%SERVICE%

IF NOT EXIST "%FOLDER%" (
  echo ไม่พบโฟลเดอร์ %FOLDER%
  exit /b 1
)

echo --- ตั้งค่า %FOLDER% ---

REM สร้าง .env จาก example
IF NOT EXIST "%FOLDER%\.env" (
  copy .env.example "%FOLDER%\.env"
  echo สร้าง %FOLDER%\.env แล้ว — แก้ค่าในไฟล์นั้นด้วย
) ELSE (
  echo %FOLDER%\.env มีอยู่แล้ว
)

REM สร้าง branch ถ้ายังไม่มี
git fetch origin 2>nul
SET BRANCH=feat/%SERVICE%
git show-ref --verify --quiet refs/heads/%BRANCH%
IF %ERRORLEVEL% NEQ 0 (
  git checkout -b %BRANCH%
  echo สร้าง branch %BRANCH% แล้ว
) ELSE (
  echo Branch %BRANCH% มีอยู่แล้ว
)

echo.
echo เสร็จแล้ว! ขั้นตอนต่อไป:
echo   1. แก้ค่าใน %FOLDER%\.env
echo   2. cd %FOLDER% ^&^& npm install
echo   3. npm run dev
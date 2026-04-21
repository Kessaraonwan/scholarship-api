#!/bin/bash
# setup.sh — รันครั้งเดียวหลัง clone repo
# ใช้: bash setup.sh <ชื่อ-service>
# ตัวอย่าง: bash setup.sh notification

SERVICE=$1

if [ -z "$SERVICE" ]; then
  echo "กรุณาระบุชื่อ service เช่น: bash setup.sh notification"
  echo "ตัวเลือก: auth | ingestion | core | analytics | notification | landing"
  exit 1
fi

FOLDER="service-$SERVICE"

if [ ! -d "$FOLDER" ]; then
  echo "ไม่พบโฟลเดอร์ $FOLDER"
  exit 1
fi

echo "--- ตั้งค่า $FOLDER ---"

# สร้าง .env จาก example
if [ ! -f "$FOLDER/.env" ]; then
  cp .env.example "$FOLDER/.env"
  echo "สร้าง $FOLDER/.env แล้ว — แก้ค่าในไฟล์นั้นด้วย"
else
  echo "$FOLDER/.env มีอยู่แล้ว"
fi

# สร้าง branch ถ้ายังไม่มี
git fetch origin 2>/dev/null
BRANCH="feat/$SERVICE"
if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
  echo "Branch $BRANCH มีอยู่แล้ว"
else
  git checkout -b "$BRANCH"
  echo "สร้าง branch $BRANCH แล้ว"
fi

echo ""
echo "เสร็จแล้ว! ขั้นตอนต่อไป:"
echo "  1. แก้ค่าใน $FOLDER/.env"
echo "  2. cd $FOLDER && npm install"
echo "  3. npm run dev"

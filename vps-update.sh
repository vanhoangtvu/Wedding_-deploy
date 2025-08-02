#!/bin/bash

# Script cập nhật code mới trên VPS
# Sử dụng: bash vps-update.sh

set -e

echo "🔄 Cập nhật ứng dụng từ Git..."

# Màu sắc
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Kiểm tra thư mục dự án
if [ ! -d "Wedding_-deploy" ]; then
    print_warning "Chưa có dự án, chạy vps-setup.sh trước"
    exit 1
fi

cd Wedding_-deploy

# Backup database trước khi update
print_status "Backup database..."
docker exec thiep-cuoi-db mysqldump -u root -p$DB_ROOT_PASSWORD thiep_cuoi_db > backup_$(date +%Y%m%d_%H%M%S).sql 2>/dev/null || print_warning "Không thể backup database"

# Pull code mới
print_status "Pull code mới từ Git..."
git pull origin main

# Stop services
print_status "Dừng services..."
docker-compose down

# Rebuild với code mới
print_status "Rebuild với code mới..."
docker-compose build --no-cache

# Start lại
print_status "Khởi động lại services..."
docker-compose up -d

# Đợi khởi động
print_status "Đợi services khởi động..."
sleep 20

# Kiểm tra trạng thái
print_status "Kiểm tra trạng thái..."
docker-compose ps

PUBLIC_IP=$(curl -s ifconfig.me)
echo ""
echo "✅ Cập nhật hoàn thành!"
echo "📱 Frontend: http://$PUBLIC_IP"
echo "🔧 Backend: http://$PUBLIC_IP:8080"
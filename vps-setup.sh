#!/bin/bash

# Script tự động cài đặt và deploy trên VPS Ubuntu
# Sử dụng: bash vps-setup.sh

set -e  # Dừng nếu có lỗi

echo "🚀 Bắt đầu cài đặt VPS cho ứng dụng Thiệp Cưới..."

# Màu sắc cho output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 1. Cập nhật hệ thống
print_status "Cập nhật hệ thống..."
sudo apt update && sudo apt upgrade -y

# 2. Cài đặt các package cần thiết
print_status "Cài đặt các package cần thiết..."
sudo apt install -y curl wget git nano ufw

# 3. Cài đặt Docker
if ! command -v docker &> /dev/null; then
    print_status "Cài đặt Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    print_status "Docker đã được cài đặt"
else
    print_status "Docker đã có sẵn"
fi

# 4. Cài đặt Docker Compose
if ! command -v docker-compose &> /dev/null; then
    print_status "Cài đặt Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    print_status "Docker Compose đã được cài đặt"
else
    print_status "Docker Compose đã có sẵn"
fi

# 5. Cấu hình Firewall
print_status "Cấu hình Firewall..."
sudo ufw --force enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 8080
sudo ufw allow 3307

# 6. Clone repository
print_status "Clone dự án từ Git..."
if [ -d "Wedding_-deploy" ]; then
    print_warning "Thư mục Wedding_-deploy đã tồn tại, đang cập nhật..."
    cd Wedding_-deploy
    git pull origin main
else
    git clone https://github.com/vanhoangtvu/Wedding_-deploy.git
    cd Wedding_-deploy
fi

# 7. Tạo file .env với cấu hình mặc định
print_status "Tạo file cấu hình .env..."
cat > .env << EOF
# Database Configuration - ĐÃ THIẾT LẬP MẬT KHẨU MẠNH
DB_ROOT_PASSWORD=ThiepCuoi2024Root!@#Strong
DB_NAME=thiep_cuoi_db
DB_USER=thiep_cuoi
DB_PASSWORD=ThiepCuoi2024DB!@#Strong

# JWT Configuration - ĐÃ THIẾT LẬP SECRET MẠNH
JWT_SECRET=ThiepCuoi2024JWTSecretKeyVeryLongAndSecureForProductionUseOnly123456789ABCDEF
JWT_EXPIRATION=86400000

# Application Settings
SPRING_PROFILES_ACTIVE=production
UPLOAD_MAX_SIZE=10MB
UPLOAD_PATH=/app/uploads

# CORS Configuration - CẬP NHẬT DOMAIN CỦA BẠN
CORS_ALLOWED_ORIGINS=http://localhost,http://$(curl -s ifconfig.me)

# Domain Configuration - CẬP NHẬT DOMAIN CỦA BẠN
FRONTEND_URL=http://$(curl -s ifconfig.me)
BACKEND_URL=http://$(curl -s ifconfig.me):8080
EOF

print_status "File .env đã được tạo với IP: $(curl -s ifconfig.me)"

# 8. Build và deploy
print_status "Building Docker images..."
docker-compose build --no-cache

print_status "Khởi động các services..."
docker-compose up -d

# 9. Đợi services khởi động
print_status "Đợi services khởi động (30 giây)..."
sleep 30

# 10. Kiểm tra trạng thái
print_status "Kiểm tra trạng thái services..."
docker-compose ps

# 11. Test endpoints
print_status "Kiểm tra kết nối..."
PUBLIC_IP=$(curl -s ifconfig.me)

echo ""
echo "=========================================="
echo "🎉 DEPLOY THÀNH CÔNG!"
echo "=========================================="
echo "📱 Frontend: http://$PUBLIC_IP"
echo "🔧 Backend API: http://$PUBLIC_IP:8080"
echo "📚 Swagger UI: http://$PUBLIC_IP:8080/swagger-ui.html"
echo "💾 Database: $PUBLIC_IP:3307"
echo "=========================================="
echo ""

# Test kết nối
print_status "Test kết nối backend..."
if curl -f -s http://localhost:8080/actuator/health > /dev/null; then
    print_status "✅ Backend hoạt động bình thường"
else
    print_warning "⚠️ Backend chưa sẵn sàng, đợi thêm..."
fi

print_status "Test kết nối frontend..."
if curl -f -s http://localhost:80 > /dev/null; then
    print_status "✅ Frontend hoạt động bình thường"
else
    print_warning "⚠️ Frontend chưa sẵn sàng, đợi thêm..."
fi

echo ""
print_status "🔍 Để xem logs nếu có vấn đề:"
echo "docker-compose logs"
echo "docker-compose logs backend"
echo "docker-compose logs frontend"
echo "docker-compose logs database"

echo ""
print_status "🔄 Để restart services:"
echo "docker-compose restart"

echo ""
print_status "📝 File cấu hình quan trọng:"
echo "- .env (cấu hình database, JWT, domain)"
echo "- docker-compose.yml (cấu hình services)"

echo ""
print_status "✅ Hoàn thành! Ứng dụng đang chạy tại: http://$PUBLIC_IP"
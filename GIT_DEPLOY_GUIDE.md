# 🚀 Hướng dẫn Push lên Git và Deploy

## 📋 Bước 1: Chuẩn bị Git Repository

### 1.1 Tạo Repository trên GitHub/GitLab
1. Đăng nhập vào GitHub hoặc GitLab
2. Tạo repository mới với tên `web-thiep-cuoi` (hoặc tên bạn muốn)
3. Chọn **Public** hoặc **Private** tùy ý
4. **KHÔNG** tích "Initialize with README" (vì đã có code)

### 1.2 Kiểm tra Git trong dự án
```bash
# Kiểm tra Git đã được khởi tạo chưa
git status

# Nếu chưa có Git, khởi tạo
git init
```

## 📤 Bước 2: Push Code lên Git

### 2.1 Cấu hình Git (nếu chưa có)
```bash
git config --global user.name "Tên của bạn"
git config --global user.email "email@example.com"
```

### 2.2 Kiểm tra và commit code
```bash
# Xem trạng thái hiện tại
git status

# Thêm tất cả file (trừ những file trong .gitignore)
git add .

# Commit với message mô tả
git commit -m "feat: dockerize app with complete deployment setup

- Add Dockerfiles for frontend and backend
- Add docker-compose.yml with MySQL, backend, frontend
- Add production configuration files
- Add deployment guides and documentation
- Update application.properties to use environment variables
- Add .dockerignore files for optimized builds"
```

### 2.3 Kết nối với remote repository
```bash
# Thay <YOUR_REPO_URL> bằng URL repository của bạn
git remote add origin <YOUR_REPO_URL>

# Ví dụ:
# git remote add origin https://github.com/username/web-thiep-cuoi.git
# hoặc SSH:
# git remote add origin git@github.com:username/web-thiep-cuoi.git
```

### 2.4 Push code lên Git
```bash
# Đẩy code lên branch main
git branch -M main
git push -u origin main
```

## 🌐 Bước 3: Deploy trên VPS từ Git

### 3.1 SSH vào VPS
```bash
ssh user@your-vps-ip
# hoặc
ssh user@your-domain.com
```

### 3.2 Cài đặt Git trên VPS (nếu chưa có)
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install git -y

# CentOS/RHEL
sudo yum install git -y
```

### 3.3 Clone repository
```bash
# Di chuyển đến thư mục muốn deploy
cd /home/user/  # hoặc /var/www/

# Clone dự án
git clone <YOUR_REPO_URL>
cd web-thiep-cuoi

# Kiểm tra files đã có đầy đủ
ls -la
```

### 3.4 Cấu hình Environment
```bash
# Copy file environment mẫu
cp .env.example .env

# Chỉnh sửa cấu hình cho production
nano .env
```

**Cấu hình .env cho production:**
```env
# Database - SỬ DỤNG MẬT KHẨU MẠNH!
DB_ROOT_PASSWORD=VeryStrongPassword123!@#
DB_NAME=thiep_cuoi_db
DB_USER=thiep_cuoi
DB_PASSWORD=StrongDBPassword456!@#

# JWT - TẠO SECRET MỚI!
JWT_SECRET=NewProductionJWTSecretKey2024VeryLongAndSecureForProductionUse123456789
JWT_EXPIRATION=86400000

# Domain của bạn
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://api.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Upload settings
UPLOAD_MAX_SIZE=10MB
UPLOAD_PATH=/app/uploads
```

### 3.5 Deploy với Docker
```bash
# Build và chạy tất cả services
docker-compose build --no-cache
docker-compose up -d

# Kiểm tra trạng thái
docker-compose ps
docker-compose logs
```

## 🔄 Bước 4: Cập nhật khi có code mới

### 4.1 Push code mới từ máy local
```bash
# Commit changes mới
git add .
git commit -m "fix: update feature xyz"
git push origin main
```

### 4.2 Update trên VPS
```bash
# SSH vào VPS
ssh user@your-vps-ip
cd /path/to/web-thiep-cuoi

# Pull code mới
git pull origin main

# Restart services (nếu có thay đổi code)
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Hoặc chỉ restart service cụ thể
docker-compose restart backend
docker-compose restart frontend
```

## 🚨 Troubleshooting

### Lỗi Git thường gặp:

1. **"Permission denied" khi push:**
   ```bash
   # Kiểm tra SSH key hoặc sử dụng HTTPS với token
   git remote set-url origin https://username:token@github.com/username/repo.git
   ```

2. **"Repository not found":**
   ```bash
   # Kiểm tra URL repository
   git remote -v
   git remote set-url origin <CORRECT_URL>
   ```

3. **Merge conflicts:**
   ```bash
   git pull origin main
   # Resolve conflicts in files
   git add .
   git commit -m "resolve merge conflicts"
   git push origin main
   ```

### Lỗi Deploy thường gặp:

1. **Docker build failed:**
   ```bash
   # Xem logs chi tiết
   docker-compose build --no-cache --progress=plain
   
   # Kiểm tra Dockerfile syntax
   docker build -f backend/Dockerfile backend/
   ```

2. **Container không start:**
   ```bash
   # Xem logs
   docker-compose logs backend
   docker-compose logs frontend
   docker-compose logs database
   ```

3. **Database connection error:**
   ```bash
   # Kiểm tra database container
   docker-compose exec database mysql -u root -p
   
   # Kiểm tra network
   docker network ls
   docker-compose exec backend ping database
   ```

## 🔧 Scripts hữu ích

### Script auto-deploy
Tạo file `deploy.sh`:
```bash
#!/bin/bash
echo "🚀 Starting deployment..."

# Pull latest code
git pull origin main

# Backup database
echo "📦 Creating database backup..."
docker exec thiep-cuoi-db mysqldump -u root -p$DB_ROOT_PASSWORD thiep_cuoi_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Update services
echo "🔄 Updating services..."
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Check health
echo "🏥 Checking health..."
sleep 30
curl -f http://localhost:8080/actuator/health
curl -f http://localhost:80

echo "✅ Deployment completed!"
```

```bash
chmod +x deploy.sh
./deploy.sh
```

## 📊 Monitoring

### Xem logs realtime:
```bash
# Tất cả services
docker-compose logs -f

# Service cụ thể
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database
```

### Kiểm tra resource usage:
```bash
docker stats
docker-compose top
```

### Health checks:
```bash
# Backend health
curl http://localhost:8080/actuator/health

# Frontend
curl http://localhost:80

# Database
docker-compose exec database mysql -u root -p -e "SELECT 1"
```

---

**🎉 Chúc mừng! Dự án của bạn đã được dockerize và sẵn sàng deploy!**

Nếu gặp vấn đề gì, hãy kiểm tra logs và tham khảo phần Troubleshooting ở trên.
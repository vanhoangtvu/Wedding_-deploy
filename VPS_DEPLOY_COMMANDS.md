# 🚀 HƯỚNG DẪN DEPLOY VPS ĐƠN GIẢN - COPY PASTE

## Phương án 1: TỰ ĐỘNG HOÀN TOÀN (KHUYẾN NGHỊ)

### Bước 1: SSH vào VPS
```bash
ssh root@YOUR_VPS_IP
```

### Bước 2: Chạy lệnh này (CHỈ 1 LỆNH DUY NHẤT)
```bash
curl -sSL https://raw.githubusercontent.com/vanhoangtvu/Wedding_-deploy/main/vps-setup.sh | bash
```

**❌ Nếu lệnh trên lỗi, dùng cách thủ công:**

---

## Phương án 2: THỦ CÔNG TỪNG BƯỚC

### Bước 1: Cài Docker
```bash
# Cập nhật hệ thống
sudo apt update && sudo apt upgrade -y

# Cài Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Cài Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Restart để áp dụng quyền Docker
sudo reboot
```

### Bước 2: SSH lại và Clone dự án
```bash
ssh root@YOUR_VPS_IP

# Clone dự án
git clone https://github.com/vanhoangtvu/Wedding_-deploy.git
cd Wedding_-deploy
```

### Bước 3: Cấu hình .env
```bash
# Copy file mẫu
cp .env.example .env

# Sửa file .env (thay YOUR_VPS_IP bằng IP thật)
nano .env
```

**Nội dung file .env:**
```env
DB_ROOT_PASSWORD=ThiepCuoi2024Root!@#
DB_NAME=thiep_cuoi_db
DB_USER=thiep_cuoi
DB_PASSWORD=ThiepCuoi2024DB!@#

JWT_SECRET=ThiepCuoi2024JWTSecretKeyVeryLongAndSecureForProductionUse123456789
JWT_EXPIRATION=86400000

SPRING_PROFILES_ACTIVE=production
UPLOAD_MAX_SIZE=10MB
UPLOAD_PATH=/app/uploads

FRONTEND_URL=http://YOUR_VPS_IP
BACKEND_URL=http://YOUR_VPS_IP:8080
CORS_ALLOWED_ORIGINS=http://YOUR_VPS_IP
```

### Bước 4: Mở ports
```bash
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 8080
sudo ufw allow 443
```

### Bước 5: Deploy
```bash
# Build và chạy
docker-compose build --no-cache
docker-compose up -d

# Kiểm tra
docker-compose ps
docker-compose logs
```

---

## ✅ KIỂM TRA KẾT QUẢ

Sau khi hoàn thành, truy cập:
- **Frontend**: `http://YOUR_VPS_IP`
- **Backend API**: `http://YOUR_VPS_IP:8080`
- **Swagger**: `http://YOUR_VPS_IP:8080/swagger-ui.html`

---

## 🔧 LỆNH QUẢN LÝ THƯỜNG DÙNG

### Xem logs
```bash
cd Wedding_-deploy
docker-compose logs
docker-compose logs backend
docker-compose logs frontend
```

### Restart services
```bash
cd Wedding_-deploy
docker-compose restart
```

### Cập nhật code mới
```bash
cd Wedding_-deploy
git pull origin main
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Backup database
```bash
cd Wedding_-deploy
docker exec thiep-cuoi-db mysqldump -u root -pThiepCuoi2024Root!@# thiep_cuoi_db > backup_$(date +%Y%m%d).sql
```

### Xem resource usage
```bash
docker stats
df -h
free -h
```

---

## 🚨 TROUBLESHOOTING

### Nếu services không start:
```bash
docker-compose down
docker system prune -f
docker-compose build --no-cache
docker-compose up -d
```

### Nếu database lỗi:
```bash
docker-compose down
docker volume rm wedding_-deploy_mysql_data
docker-compose up -d
```

### Nếu port bị chiếm:
```bash
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :8080
# Kill process nếu cần
sudo kill -9 PID_NUMBER
```

---

## 📱 ỨNG DỤNG SẼ CHẠY TẠI:

**Frontend (Giao diện người dùng):**
- http://YOUR_VPS_IP

**Backend API (Cho mobile app/frontend):**
- http://YOUR_VPS_IP:8080

**Database:**
- YOUR_VPS_IP:3307
- Username: thiep_cuoi
- Password: ThiepCuoi2024DB!@#

---

**🎉 HOÀN TẤT! Ứng dụng thiệp cưới đã sẵn sàng!**
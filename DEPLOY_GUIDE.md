# Hướng dẫn Deploy Ứng dụng Thiệp Cưới lên VPS với Docker

## Yêu cầu hệ thống

### VPS Requirements:
- **RAM**: Tối thiểu 2GB (khuyến nghị 4GB)
- **Storage**: Tối thiểu 20GB
- **OS**: Ubuntu 20.04/22.04 LTS hoặc CentOS 7+
- **Network**: Port 80, 443, 22 mở

### Phần mềm cần cài đặt:
- Docker (version 20.0+)
- Docker Compose (version 2.0+)
- Git

## Bước 1: Chuẩn bị VPS

### 1.1 Cài đặt Docker trên Ubuntu
```bash
# Cập nhật hệ thống
sudo apt update && sudo apt upgrade -y

# Cài đặt các package cần thiết
sudo apt install apt-transport-https ca-certificates curl software-properties-common -y

# Thêm Docker GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Thêm Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Cài đặt Docker
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io -y

# Cài đặt Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Thêm user vào group docker
sudo usermod -aG docker $USER
```

### 1.2 Khởi động lại và kiểm tra
```bash
sudo reboot
# Sau khi khởi động lại:
docker --version
docker-compose --version
```

## Bước 2: Deploy ứng dụng

### 2.1 Clone dự án
```bash
# Clone dự án từ repository
git clone <your-repository-url>
cd Web_ThiepCuoi

# Hoặc upload code bằng SCP/SFTP
```

### 2.2 Cấu hình Environment Variables
```bash
# Copy file environment mẫu
cp .env.example .env

# Chỉnh sửa file .env
nano .env
```

**Cấu hình .env:**
```env
# Database - ĐỔI MẬT KHẨU MẠNH
DB_ROOT_PASSWORD=your_strong_root_password_here
DB_NAME=thiep_cuoi_db
DB_USER=thiep_cuoi
DB_PASSWORD=your_strong_db_password_here

# JWT - TẠO SECRET KEY MẠNH
JWT_SECRET=your_very_long_and_secure_jwt_secret_key_minimum_64_characters

# Domain cho production
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://api.yourdomain.com
```

### 2.3 Tạo file init SQL (nếu cần)
```bash
mkdir -p database
# Tạo file database/init.sql với cấu trúc database nếu cần
```

### 2.4 Build và chạy ứng dụng
```bash
# Build tất cả services
docker-compose build

# Chạy ứng dụng
docker-compose up -d

# Kiểm tra trạng thái
docker-compose ps
docker-compose logs
```

## Bước 3: Cấu hình Domain và SSL

### 3.1 Cấu hình Nginx Reverse Proxy (Khuyến nghị)
```bash
# Cài đặt Nginx trên host
sudo apt install nginx -y

# Tạo config cho domain
sudo nano /etc/nginx/sites-available/thiep-cuoi
```

**Config Nginx:**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Kích hoạt site
sudo ln -s /etc/nginx/sites-available/thiep-cuoi /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3.2 Cài đặt SSL với Let's Encrypt
```bash
# Cài đặt Certbot
sudo apt install certbot python3-certbot-nginx -y

# Tạo SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Kiểm tra auto-renewal
sudo certbot renew --dry-run
```

## Bước 4: Monitoring và Backup

### 4.1 Monitoring containers
```bash
# Xem logs
docker-compose logs -f

# Xem resource usage
docker stats

# Health check
curl http://localhost:8080/actuator/health
curl http://localhost:80
```

### 4.2 Backup Database
```bash
# Tạo script backup
cat > backup_db.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker exec thiep-cuoi-db mysqldump -u root -p$DB_ROOT_PASSWORD thiep_cuoi_db > backup_${DATE}.sql
EOF

chmod +x backup_db.sh

# Chạy backup định kỳ với cron
crontab -e
# Thêm dòng: 0 2 * * * /path/to/backup_db.sh
```

## Bước 5: Bảo mật

### 5.1 Firewall
```bash
# Cấu hình UFW
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw status
```

### 5.2 Docker Security
```bash
# Chỉ expose port cần thiết
# Đã cấu hình trong docker-compose.yml

# Regular updates
sudo apt update && sudo apt upgrade -y
docker-compose pull
docker-compose up -d
```

## Bước 6: Commands hữu ích

### 6.1 Quản lý Docker Compose
```bash
# Khởi động
docker-compose up -d

# Dừng
docker-compose down

# Restart service cụ thể
docker-compose restart backend

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Rebuild và restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### 6.2 Database Management
```bash
# Truy cập MySQL container
docker exec -it thiep-cuoi-db mysql -u root -p

# Backup database
docker exec thiep-cuoi-db mysqldump -u root -p thiep_cuoi_db > backup.sql

# Restore database
docker exec -i thiep-cuoi-db mysql -u root -p thiep_cuoi_db < backup.sql
```

## Troubleshooting

### Lỗi thường gặp:

1. **Container không start:**
   ```bash
   docker-compose logs <service-name>
   ```

2. **Database connection error:**
   - Kiểm tra .env variables
   - Kiểm tra database container đã chạy chưa
   
3. **Frontend không load được:**
   - Kiểm tra nginx config
   - Kiểm tra API proxy setting

4. **Memory issues:**
   ```bash
   # Tăng swap nếu cần
   sudo fallocate -l 2G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   ```

## Cập nhật ứng dụng

```bash
# Pull code mới
git pull origin main

# Rebuild và deploy
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Kiểm tra
docker-compose ps
docker-compose logs
```

**Lưu ý:** Nhớ backup database trước khi cập nhật!
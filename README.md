# 💝 Thiệp Cưới Online - Full Stack Application

Ứng dụng web full-stack cho phép người dùng tạo và đặt thiệp cưới tùy chỉnh, được xây dựng với Spring Boot backend và React frontend.

## 🎯 Tính năng chính

### 👰🤵 **Dành cho người dùng**
- **Duyệt mẫu thiệp**: Xem hàng trăm mẫu thiệp đa dạng theo danh mục
- **Tùy chỉnh thiệp cơ bản**: Thêm tên cặp đôi, ngày cưới, địa điểm và lời nhắn
- **💎 Tùy chỉnh HTML**: Chỉnh sửa thiệp với mẫu HTML được render động
- **Preview realtime**: Xem trước thiệp khi đang tùy chỉnh
- **Quản lý thiệp**: Lưu và quản lý các thiệp đã tạo (cơ bản + HTML)
- **Giỏ hàng**: Thêm thiệp vào giỏ hàng và đặt hàng
- **Theo dõi đơn hàng**: Xem trạng thái và tiến độ đơn hàng

### 👨‍💼 **Dành cho Admin**
- **Dashboard**: Tổng quan thống kê hệ thống với quick actions
- **Quản lý danh mục**: CRUD danh mục thiệp cưới với interface đầy đủ
- **Quản lý mẫu thiệp**: CRUD mẫu thiệp cưới với upload hình ảnh
- **📄 Quản lý HTML Templates**: Upload và quản lý mẫu HTML cho thiệp cao cấp
- **Quản lý đơn hàng**: Xem, lọc và cập nhật trạng thái đơn hàng
- **Export dữ liệu**: Xuất báo cáo đơn hàng định dạng CSV

### 🤖 **Tự động hóa**
- **Auto Admin Setup**: Tự động tạo tài khoản admin khi khởi động
- **Data Loader**: Tự động tạo dữ liệu mẫu cho development
- **JWT Security**: Tự động refresh token và handle authentication

## 🏗️ Kiến trúc hệ thống

```
┌─────────────────┐    HTTP/REST API    ┌─────────────────┐
│                 │ ◄─────────────────► │                 │
│  React Frontend │     (Port 3000)     │ Spring Boot     │
│                 │                     │ Backend         │
│  - UI/UX        │                     │ (Port 8080)     │
│  - State Mgmt   │                     │  - API Layer    │
│  - Routing      │                     │  - Business     │
│                 │                     │  - Security     │
└─────────────────┘                     └─────────────────┘
                                                 │
                                                 ▼
                                        ┌─────────────────┐
                                        │                 │
                                        │  MySQL          │
                                        │  Database       │
                                        │  (Port 3306)    │
                                        │                 │
                                        └─────────────────┘
```

## 🛠️ Công nghệ sử dụng

### Backend (Spring Boot)
- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security** với JWT Authentication
- **Spring Data JPA** với MySQL
- **Template Rendering System** - HTML động với placeholder replacement
- **Auto Data Loading** - CommandLineRunner cho dữ liệu mẫu
- **Maven** build tool
- **Swagger/OpenAPI** documentation

### Frontend (React)
- **React 18** với Hooks
- **React Router 6**
- **Bootstrap 5** & React Bootstrap
- **Axios** cho API calls
- **React Hook Form**
- **Context API** cho state management

### Database
- **MySQL 8.0**
- **6 tables**: users, categories, templates, custom_invitations, orders, order_items

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống
- **Java 17+**
- **Node.js 16+** và npm
- **MySQL 8.0+**
- **Maven 3.6+**

### 1. Cài đặt Database

```sql
-- Tạo database
CREATE DATABASE thiep_cuoi_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Import dữ liệu mẫu
mysql -u root -p thiep_cuoi_db < backend/database.sql
```

### 2. Chạy Backend (Spring Boot)

```bash
# Di chuyển vào thư mục backend
cd backend

# Cấu hình database trong application.properties
# spring.datasource.password=your_password

# Build và chạy
mvn clean install
mvn spring-boot:run
```

Backend sẽ chạy tại: **http://localhost:8080**

Swagger UI: **http://localhost:8080/swagger-ui.html**

### 3. Chạy Frontend (React)

```bash
# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt dependencies
npm install

# Chạy development server
npm start
```

Frontend sẽ chạy tại: **http://localhost:3000**

## 👤 Tài khoản demo

### Admin
- **Username**: `admin`
- **Password**: `admin123`
- **Quyền**: Quản lý toàn bộ hệ thống

### User
- **Username**: `user1` 
- **Password**: `user123`
- **Quyền**: Tạo và đặt thiệp cưới

## 📊 Database Schema

```sql
users (id, username, email, password, full_name, phone, address, role, created_at)
├── custom_invitations (user_id FK)
├── customized_cards (user_id FK) 🆕
├── card_templates (created_by FK) 🆕
└── orders (user_id FK)

categories (id, name, description, created_at)
└── templates (category_id FK)

templates (id, name, description, category_id, image_url, price, is_active)
├── custom_invitations (template_id FK)
└── card_templates (template_id FK) 🆕

card_templates (id, template_id, template_name, html_content, css_content, template_variables, created_by) 🆕
└── customized_cards (card_template_id FK) 🆕

customized_cards (id, user_id, card_template_id, rendered_html, custom_data, is_saved) 🆕

custom_invitations (id, user_id, template_id, groom_name, bride_name, wedding_date, ...)
└── order_items (custom_invitation_id FK)

orders (id, user_id, order_code, total_amount, status, shipping_address, ...)
└── order_items (order_id FK)
```

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/dang_nhap` - Đăng nhập
- `POST /api/v1/auth/dang_ky` - Đăng ký
- `GET /api/v1/auth/thong_tin_ca_nhan` - Thông tin user

### Templates & Categories
- `GET /api/v1/categories` - Lấy danh mục
- `GET /api/v1/templates` - Lấy mẫu thiệp
- `GET /api/v1/templates/danh_muc/{id}` - Mẫu theo danh mục
- `GET /api/v1/templates/tim_kiem?keyword=` - Tìm kiếm

### Custom Invitations
- `POST /api/v1/custom-invitations` - Tạo thiệp tùy chỉnh
- `GET /api/v1/custom-invitations` - Thiệp của user
- `PUT /api/v1/custom-invitations/{id}` - Cập nhật thiệp

### Orders
- `POST /api/v1/orders` - Tạo đơn hàng
- `GET /api/v1/orders` - Đơn hàng của user
- `GET /api/v1/orders/{id}` - Chi tiết đơn hàng

## 🎨 Screenshots

### Homepage
![Homepage](https://via.placeholder.com/800x400/e91e63/ffffff?text=Homepage+Preview)

### Template Browser
![Templates](https://via.placeholder.com/800x400/f8bbd9/333333?text=Template+Browser)

### Custom Invitation Editor
![Editor](https://via.placeholder.com/800x400/ff6b9d/ffffff?text=Invitation+Editor)

### Admin Dashboard
![Admin](https://via.placeholder.com/800x400/2c3e50/ffffff?text=Admin+Dashboard)

## 🌟 Tính năng nổi bật

### 🎨 **Template Customization**
- Form thân thiện, dễ sử dụng
- Preview realtime khi nhập liệu
- Date/time picker cho ngày cưới
- Tùy chỉnh địa điểm và lời nhắn

### 🛒 **Shopping Experience**
- Add to cart với quantity control
- Persistent cart với localStorage
- Checkout flow hoàn chỉnh
- Order tracking system

### 🔐 **Security**
- JWT-based authentication
- Role-based access control (Admin/User)
- Password encryption với BCrypt
- API endpoint protection

### 📱 **Responsive Design**
- Mobile-first approach
- Bootstrap responsive grid
- Touch-friendly interface
- Cross-browser compatibility

## 🚀 Deployment

### Backend (Spring Boot)
```bash
# Build JAR file
mvn clean package

# Run production
java -jar target/thiep-cuoi-backend-1.0.0.jar
```

### Frontend (React)
```bash
# Build for production
npm run build

# Serve static files
npx serve -s build
```

### Docker (Optional)
```bash
# Build Docker images
docker build -t thiep-cuoi-backend ./backend
docker build -t thiep-cuoi-frontend ./frontend

# Run with Docker Compose
docker-compose up -d
```

## 📈 Roadmap

### Version 2.0
- [ ] Real-time collaboration
- [ ] Advanced template editor
- [ ] Payment integration (VNPay/Momo)
- [ ] Email notifications
- [ ] Social media sharing
- [ ] Multi-language support

### Version 2.1
- [ ] Mobile app (React Native)
- [ ] AI-powered design suggestions
- [ ] Bulk order management
- [ ] Customer analytics
- [ ] API rate limiting
- [ ] CDN integration

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Copyright © 2024 Thiệp Cưới Online. All rights reserved.

## 📞 Liên hệ

- **Email**: support@thiepCuoi.com
- **Phone**: 0123 456 789
- **Website**: https://thiepCuoi.com
- **Address**: 123 Đường ABC, Quận 1, TP.HCM

---

⭐ **Star this repo if you like it!** ⭐#   W e d d i n g _ - d e p l o y  
 
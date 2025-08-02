# Backend API Thiệp Cưới

Dự án backend Spring Boot cho trang web thiệp cưới - cho phép người dùng tạo và đặt thiệp cưới tùy chỉnh.

## Tính năng chính

- 🔐 **Xác thực & Phân quyền**: JWT Authentication với Spring Security
- 👤 **Quản lý người dùng**: Đăng ký, đăng nhập, thông tin cá nhân
- 📂 **Quản lý danh mục**: CRUD danh mục thiệp cưới
- 🎨 **Quản lý mẫu thiệp**: CRUD mẫu thiệp với hình ảnh
- 📄 **Mẫu HTML Templates**: Upload và quản lý mẫu HTML cho Admin
- ✏️ **Thiệp tùy chỉnh**: Tạo, chỉnh sửa, lưu thiệp với thông tin cá nhân
- 💎 **Render HTML**: Render thiệp HTML với dữ liệu người dùng
- 🛒 **Đặt hàng**: Tạo và quản lý đơn hàng thiệp cưới
- 🤖 **Auto Setup**: Tự động tạo admin user và dữ liệu mẫu
- 📚 **API Documentation**: Swagger UI tích hợp

## Công nghệ sử dụng

- **Spring Boot 3.2.0**
- **Spring Security** với JWT
- **Spring Data JPA** với MySQL
- **Maven** để quản lý dependencies
- **Swagger/OpenAPI 3** cho documentation
- **Jakarta Validation** cho validation

## Cài đặt và chạy

### 1. Yêu cầu hệ thống
- Java 17 hoặc cao hơn
- MySQL 8.0 hoặc cao hơn
- Maven 3.6 hoặc cao hơn

### 2. Thiết lập cơ sở dữ liệu
```sql
-- Tạo database
CREATE DATABASE thiep_cuoi_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**Lưu ý:** Dữ liệu mẫu sẽ được tự động tạo khi khởi động ứng dụng lần đầu tiên.

### 3. Cấu hình database
Chỉnh sửa file `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/thiep_cuoi_db
spring.datasource.username=root
spring.datasource.password=your_password
```

### 4. Chạy ứng dụng
```bash
# Build project
mvn clean install

# Chạy ứng dụng
mvn spring-boot:run
```

Ứng dụng sẽ chạy tại: http://localhost:8080

### 5. Truy cập API Documentation
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/api-docs
- **OpenAPI YAML**: http://localhost:8080/api-docs.yaml

## Cấu trúc API

### Authentication APIs
- `POST /api/v1/auth/dang_nhap` - Đăng nhập
- `POST /api/v1/auth/dang_ky` - Đăng ký
- `GET /api/v1/auth/thong_tin_ca_nhan` - Thông tin người dùng hiện tại

### Categories APIs
- `GET /api/v1/categories` - Lấy tất cả danh mục
- `GET /api/v1/categories/{id}` - Lấy danh mục theo ID
- `POST /api/v1/categories` - Tạo danh mục mới (Admin)
- `PUT /api/v1/categories/{id}` - Cập nhật danh mục (Admin)
- `DELETE /api/v1/categories/{id}` - Xóa danh mục (Admin)

### Templates APIs
- `GET /api/v1/templates` - Lấy tất cả mẫu thiệp
- `GET /api/v1/templates/danh_muc/{categoryId}` - Lấy mẫu theo danh mục
- `GET /api/v1/templates/tim_kiem?keyword=` - Tìm kiếm mẫu thiệp
- `GET /api/v1/templates/{id}` - Lấy mẫu thiệp theo ID
- `POST /api/v1/templates` - Tạo mẫu thiệp mới (Admin)
- `PUT /api/v1/templates/{id}` - Cập nhật mẫu thiệp (Admin)
- `DELETE /api/v1/templates/{id}` - Xóa mẫu thiệp (Admin)

### Custom Invitations APIs
- `POST /api/v1/custom-invitations` - Tạo thiệp tùy chỉnh
- `GET /api/v1/custom-invitations` - Lấy thiệp của người dùng
- `GET /api/v1/custom-invitations/da_luu` - Lấy thiệp đã lưu
- `GET /api/v1/custom-invitations/{id}` - Lấy thiệp theo ID
- `PUT /api/v1/custom-invitations/{id}` - Cập nhật thiệp
- `PUT /api/v1/custom-invitations/{id}/luu` - Lưu thiệp
- `DELETE /api/v1/custom-invitations/{id}` - Xóa thiệp

### Card Templates APIs (HTML Templates - Admin only)
- `GET /api/v1/card-templates` - Lấy tất cả mẫu HTML
- `GET /api/v1/card-templates/template/{templateId}` - Lấy mẫu HTML theo template ID
- `GET /api/v1/card-templates/{id}` - Lấy mẫu HTML theo ID
- `POST /api/v1/card-templates` - Tạo mẫu HTML mới (Admin)
- `PUT /api/v1/card-templates/{id}` - Cập nhật mẫu HTML (Admin)
- `DELETE /api/v1/card-templates/{id}` - Xóa mẫu HTML (Admin)
- `GET /api/v1/card-templates/my-templates` - Lấy mẫu HTML do tôi tạo (Admin)

### Customized Cards APIs (HTML Rendered Cards - User)
- `POST /api/v1/customized-cards/render` - Render thiệp HTML với dữ liệu
- `GET /api/v1/customized-cards` - Lấy thiệp HTML của người dùng
- `GET /api/v1/customized-cards/saved` - Lấy thiệp HTML đã lưu
- `GET /api/v1/customized-cards/{id}` - Lấy thiệp HTML theo ID
- `PUT /api/v1/customized-cards/{id}/save` - Lưu thiệp HTML
- `PUT /api/v1/customized-cards/{id}` - Cập nhật thiệp HTML
- `DELETE /api/v1/customized-cards/{id}` - Xóa thiệp HTML

### Orders APIs
- `POST /api/v1/orders` - Tạo đơn hàng mới
- `GET /api/v1/orders` - Lấy đơn hàng của người dùng
- `GET /api/v1/orders/{id}` - Lấy đơn hàng theo ID
- `GET /api/v1/orders/ma_don_hang/{orderCode}` - Tra cứu theo mã đơn hàng
- `PUT /api/v1/orders/{id}/trang_thai` - Cập nhật trạng thái (Admin)
- `GET /api/v1/orders/theo_trang_thai` - Lấy đơn theo trạng thái (Admin)

## 📚 Swagger API Documentation

### Truy cập Swagger UI
Sau khi chạy ứng dụng, truy cập các URL sau:

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI Spec (JSON)**: http://localhost:8080/api-docs
- **OpenAPI Spec (YAML)**: http://localhost:8080/api-docs.yaml

### Cách sử dụng Swagger UI

1. **Xác thực trong Swagger**:
   - Đầu tiên, đăng nhập qua API `/api/v1/auth/dang_nhap`
   - Copy JWT token từ response
   - Click nút **"Authorize"** ở góc phải
   - Nhập: `Bearer your_jwt_token_here`
   - Click **"Authorize"**

2. **Test API endpoints**:
   - Chọn endpoint muốn test
   - Click **"Try it out"**
   - Điền parameters và request body
   - Click **"Execute"**

### Ví dụ Request/Response

#### 1. Đăng nhập
```bash
POST /api/v1/auth/dang_nhap
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

# Response:
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "fullName": "Quản trị viên",
    "role": "ADMIN"
  }
}
```

#### 2. Tạo mẫu HTML (Admin)
```bash
POST /api/v1/card-templates
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
  "templateId": 1,
  "cardTemplateName": "Thiệp cổ điển HTML",
  "htmlContent": "<div class=\"wedding-card\">{{groom_name}} & {{bride_name}}</div>",
  "cssContent": ".wedding-card { background: gold; padding: 20px; }",
  "templateVariables": "{\"groom_name\": \"Tên chú rể\", \"bride_name\": \"Tên cô dâu\"}"
}
```

#### 3. Render thiệp HTML (User)
```bash
POST /api/v1/customized-cards/render
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
  "cardTemplateId": 1,
  "customData": {
    "groom_name": "Minh",
    "bride_name": "Lan",
    "wedding_date": "25/12/2024",
    "wedding_venue": "Nhà hàng ABC"
  },
  "saveCard": true
}

# Response:
{
  "id": 1,
  "renderedHtml": "<div class=\"wedding-card\">Minh & Lan</div>",
  "renderedCss": ".wedding-card { background: gold; padding: 20px; }",
  "customData": "{\"groom_name\":\"Minh\",\"bride_name\":\"Lan\"...}",
  "isSaved": true
}
```

### API Groups trong Swagger

1. **🔐 Authentication** - Đăng nhập/đăng ký
2. **📂 Categories** - Quản lý danh mục thiệp
3. **🎨 Templates** - Quản lý mẫu thiệp cơ bản  
4. **📄 Card Templates** - Quản lý mẫu HTML (Admin)
5. **💎 Customized Cards** - Render thiệp HTML (User)
6. **✏️ Custom Invitations** - Thiệp tùy chỉnh cơ bản
7. **🛒 Orders** - Quản lý đơn hàng

### Response Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request (validation error)
- **401**: Unauthorized (chưa đăng nhập)
- **403**: Forbidden (không có quyền)
- **404**: Not Found
- **500**: Internal Server Error

### Swagger Configuration
Swagger được cấu hình trong `SwaggerConfig.java` với:
- **Title**: API Thiệp Cưới Online
- **Version**: 1.0
- **Description**: RESTful API cho hệ thống thiệp cưới
- **Contact**: support@thiepCuoi.com
- **Security**: JWT Bearer Token support

### Tips sử dụng Swagger
1. **🔑 Authentication Required**: Hầu hết APIs cần JWT token
2. **📱 Try it out**: Test trực tiếp API trong Swagger UI
3. **📋 Copy curl**: Swagger tự generate curl commands
4. **🔍 Search**: Dùng Ctrl+F để tìm endpoint nhanh
5. **📚 Models**: Xem Schema definitions ở cuối trang
6. **🎯 Parameters**: Swagger hiển thị rõ required/optional fields

### Swagger Screenshots
- **Main Interface**: Danh sách tất cả API endpoints
- **Authentication**: JWT Bearer token setup
- **Try it out**: Interactive API testing
- **Responses**: Sample responses với HTTP status codes

## 👤 Tài khoản mặc định

### Admin (Tự động tạo)
- Username: `admin`
- Password: `admin123`
- **Tự động tạo khi khởi động ứng dụng nếu chưa tồn tại**

### User (Tạo khi load dữ liệu mẫu)
- Username: `user1`  
- Password: `user123`

## 🔧 Troubleshooting

### Lỗi không đăng nhập được
Nếu gặp lỗi "không tìm thấy user" khi đăng nhập:

1. **Kiểm tra database có dữ liệu mẫu chưa:**
```sql
mysql -u root -p -e "SELECT username FROM thiep_cuoi_db.users;"
```

2. **Restart ứng dụng** - DataLoader sẽ tự động tạo dữ liệu mẫu nếu database trống:
```bash
# Dừng ứng dụng (Ctrl+C) và chạy lại
mvn spring-boot:run
```

### Lỗi kết nối database
- Kiểm tra MySQL service đã chạy
- Xác nhận thông tin kết nối trong `application.properties`
- Đảm bảo database `thiep_cuoi_db` đã được tạo

## Security

- JWT Token có thời hạn 24 giờ
- Mật khẩu được mã hóa với BCrypt
- API được bảo vệ với Spring Security
- Phân quyền rõ ràng: ADMIN và USER

## Cấu trúc thư mục

```
src/main/java/com/thiepCuoi/
├── ThiepCuoiApplication.java          # Main class
├── api/v1/controller/                 # REST Controllers
├── config/                            # Configuration classes
├── model/dto/                         # Data Transfer Objects
├── repository/entity/                 # JPA Entities
├── repository/                        # JPA Repositories
├── security/                          # Security configurations
├── service/                           # Service interfaces
└── service/impl/                      # Service implementations
```
✅ **Hệ thống đã sẵn sàng**: Backend có đầy đủ APIs, Frontend có thể tích hợp ngay!
## Liên hệ

Nếu có thắc mắc hoặc cần hỗ trợ, vui lòng liên hệ qua email hoặc tạo issue trên GitHub.
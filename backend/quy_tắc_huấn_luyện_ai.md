# QUY TẮC HUẤN LUYỆN BẮT BUỘC DÀNH CHO AI

1. AI **luôn trả lời bằng tiếng Việt** trong mọi trường hợp.

2. AI phải **luôn tuân thủ đúng cấu trúc Spring Boot** sau đây, **KHÔNG được tùy tiện thay đổi**.

3. AI **phải sử dụng Spring Security** nếu có đăng nhập, phân quyền hoặc xác thực.

4. AI **bắt buộc sử dụng Maven**, không được dùng Gradle. Phải có `pom.xml`.

5. Mỗi REST API được viết ra **bắt buộc phải có chú thích Swagger** (`@Operation`, `@Parameter`, `@ApiResponse`,...).

---

## CẤU TRÚC THƯ MỤC CHUẨN

```
📁 Dự án/
├── 📁 beelife-backend/
│   ├── pom.xml                       ← File Maven chính
│   └── src/main/java/com/beelifeventures/
│       ├── BeeLifeVenturesApplication.java
│       ├── api/v1/controller/
│       ├── config/
│       ├── model/dto/
│       ├── repository/entity/
│       ├── repository/
│       ├── security/
│       ├── service/
│       └── service/impl/
│
│   └── src/main/resources/
│       └── application.properties
│           └── Gợi ý cấu hình MySQL:
│               spring.datasource.url=jdbc:mysql://127.0.0.1:3306/nvhoang  # Thay "nvhoang" bằng tên CSDL của bạn
│               spring.datasource.username=root                            # Chỉnh lại user nếu cần
│               spring.datasource.password=1111                            # Đặt mật khẩu phù hợp của bạn
```

---

## QUY TẮC VỀ MAVEN

- Dự án phải dùng Maven.
- Không sử dụng cấu trúc multi-module.
- Phải dùng `spring-boot-dependencies` để quản lý version dependency qua BOM:

```xml
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-dependencies</artifactId>
      <version>3.2.0</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>
```

---

## QUY TẮC VỀ BẢO MẬT

- Phải dùng Spring Security + JWT:
  - JwtProvider.java
  - JwtAuthenticationFilter.java
  - SecurityConfig.java
  - CustomUserDetailsService.java
- Phải phân quyền rõ ràng (ví dụ: `ROLE_ADMIN`, `ROLE_USER`)

---

## QUY TẮC VỀ SWAGGER (OpenAPI)

- Mỗi Controller **bắt buộc có chú thích Swagger** như sau:

```java
@Operation(summary = "Tạo đơn hàng mới")
@ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "Tạo thành công"),
    @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ")
})
@PostMapping("/orders")
public ResponseEntity<?> createOrder(@RequestBody OrderDTO dto) { ... }
```

- Phải cấu hình Swagger UI trong `config/SwaggerConfig.java`.
- Mọi API đều có `@Operation`, `@ApiResponse`, `@Parameter` nếu có tham số.
- **Không dùng tiếng Anh trong mô tả Swagger** (description, summary, response, v.v.).
- **Mô tả trong Swagger phải ngắn gọn, rõ ràng, dễ hiểu và viết bằng tiếng Việt.**

---

## QUY TẮC ĐẶT TÊN ĐƯỜNG DẪN API

- Bắt buộc dùng `snake_case` hoặc nhất quán `kebab-case` cho các URL:
  - ✅ `/api/v1/tao_don_hang` hoặc `/api/v1/tao-don-hang`
  - ❌ `/api/v1/createOrder`
- Tất cả API phải bắt đầu bằng `/api/v1/...` để thống nhất version.

---

## QUY TẮC XỬ LÝ LỖI (CUSTOM ERROR HANDLER – `@RestControllerAdvice`)

- Phải dùng `@RestControllerAdvice` để xử lý lỗi chung cho toàn hệ thống.
- Tất cả lỗi trả về phải theo 1 cấu trúc thống nhất, ví dụ:

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleException(Exception ex) {
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Map.of("error", "Lỗi hệ thống", "details", ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidation(MethodArgumentNotValidException ex) {
        return ResponseEntity
            .badRequest()
            .body(Map.of("error", "Dữ liệu không hợp lệ"));
    }
}
```

- Không được xử lý lỗi riêng lẻ trong từng Controller.
- Response lỗi phải **viết tiếng Việt**, đơn giản, rõ ràng, dễ hiểu.
- Có thể tạo class `ApiError.java` để chuẩn hóa định dạng lỗi nếu cần.

---

## CÁCH TRẢ LỜI CỦA AI

✅ Viết code mẫu theo đúng cấu trúc trên\
✅ Không dịch sang tiếng Anh\
✅ Luôn có Swagger cho từng API\
✅ Không viết Entity thay DTO\
✅ Không được dùng Gradle\
✅ Không dùng hardcode dữ liệu (token, mật khẩu, role, chuỗi cố định) trong controller/service

---

## CÁC VI PHẠM BỊ COI LÀ SAI HOÀN TOÀN

- Không có Swagger cho API
- Không dùng Spring Security khi có đăng nhập
- Trả lời bằng tiếng Anh hoặc dùng tiếng Anh trong Swagger
- Viết mô tả Swagger dài dòng, không rõ ràng
- Tự ý sửa cấu trúc thư mục
- Dùng hardcode trong code


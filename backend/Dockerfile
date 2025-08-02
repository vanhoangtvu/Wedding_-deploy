# Dockerfile cho Spring Boot Backend
FROM maven:3.9.5-eclipse-temurin-17-alpine AS builder

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy pom.xml trước để cache dependencies
COPY pom.xml .

# Tải dependencies trước để cache layer
RUN mvn dependency:resolve

# Copy source code
COPY src ./src

# Build ứng dụng
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy JAR file từ builder stage
COPY --from=builder /app/target/thiep-cuoi-backend-1.0.0.jar app.jar

# Tạo thư mục uploads
RUN mkdir -p /app/uploads

# Tạo user non-root để chạy ứng dụng
RUN addgroup --system spring && adduser --system spring --ingroup spring
RUN chown -R spring:spring /app
USER spring:spring

# Expose port
EXPOSE 8080

# Chạy ứng dụng
CMD ["java", "-jar", "app.jar"]
# Frontend React - Thiệp Cưới Online

Ứng dụng React frontend cho trang web thiệp cưới, kết nối với backend Spring Boot.

## Tính năng chính

### 🎨 **Dành cho người dùng**
- **Xem mẫu thiệp**: Browse và tìm kiếm trong thư viện mẫu thiệp đa dạng
- **Tùy chỉnh thiệp**: Tạo thiệp cưới cá nhân với thông tin cặp đôi
- **Preview realtime**: Xem trước thiệp trong quá trình tùy chỉnh
- **Giỏ hàng & Đặt hàng**: Thêm vào giỏ hàng và đặt hàng dễ dàng
- **Quản lý thiệp**: Lưu và quản lý các thiệp đã tạo
- **Theo dõi đơn hàng**: Xem trạng thái và tiến độ đơn hàng

### 👨‍💼 **Dành cho Admin**
- **Dashboard**: Tổng quan thống kê hệ thống
- **Quản lý danh mục**: CRUD danh mục thiệp cưới
- **Quản lý mẫu thiệp**: CRUD mẫu thiệp (đang phát triển)
- **Quản lý đơn hàng**: Xem và cập nhật trạng thái đơn hàng (đang phát triển)

## Công nghệ sử dụng

- **React 18** với Hooks
- **React Router 6** cho routing
- **React Bootstrap** cho UI components
- **React Hook Form** cho form handling
- **Axios** cho API calls
- **React Toastify** cho notifications
- **React DatePicker** cho date/time selection
- **Moment.js** cho date formatting
- **React Icons** cho icons

## Cài đặt và chạy

### 1. Yêu cầu hệ thống
- Node.js 16+ và npm/yarn
- Backend Spring Boot đang chạy tại localhost:8080

### 2. Cài đặt dependencies
```bash
cd frontend
npm install
```

### 3. Cấu hình environment
Tạo file `.env` (nếu cần):
```env
REACT_APP_API_URL=http://localhost:8080/api/v1
```

### 4. Chạy ứng dụng
```bash
# Development mode
npm start

# Build for production
npm run build
```

Ứng dụng sẽ chạy tại: http://localhost:3000

## Cấu trúc thư mục

```
src/
├── components/           # Reusable components
│   ├── auth/            # Authentication components
│   └── layout/          # Layout components (Navbar, Footer)
├── contexts/            # React Context providers
│   ├── AuthContext.js   # Authentication state
│   └── CartContext.js   # Shopping cart state
├── pages/               # Page components
│   ├── auth/           # Login, Register pages
│   ├── admin/          # Admin pages
│   ├── Home.js         # Landing page
│   ├── Templates.js    # Template browsing
│   ├── CustomInvitation.js  # Template customization
│   ├── MyInvitations.js     # User's invitations
│   ├── Cart.js         # Shopping cart
│   ├── Orders.js       # Order history
│   └── Profile.js      # User profile
├── services/           # API services
│   └── apiService.js   # HTTP client
├── styles/            # CSS files
│   └── global.css     # Global styles
├── utils/             # Utility functions
│   └── helpers.js     # Helper functions
├── App.js             # Main App component
└── index.js           # Entry point
```

## API Integration

Ứng dụng kết nối với backend Spring Boot qua REST APIs:

- **Authentication**: `/api/v1/auth/*`
- **Templates**: `/api/v1/templates/*`
- **Categories**: `/api/v1/categories/*`
- **Custom Invitations**: `/api/v1/custom-invitations/*`
- **Orders**: `/api/v1/orders/*`

## Tính năng nổi bật

### 🎨 **Template Customization**
- Form tùy chỉnh thông tin cặp đôi
- Date/time picker cho ngày cưới
- Preview realtime khi nhập liệu
- Responsive design trên mọi thiết bị

### 🛒 **Shopping Experience**
- Add to cart với quantity control
- Persistent cart với localStorage
- Checkout flow hoàn chỉnh
- Order tracking system

### 🔐 **Security & Authentication**
- JWT-based authentication
- Protected routes với role-based access
- Automatic token renewal
- Secure API communication

### 📱 **Responsive Design**
- Mobile-first approach
- Bootstrap responsive grid
- Touch-friendly interface
- Cross-browser compatibility

## Tài khoản demo

### User
- Username: `user1`
- Password: `user123`

### Admin
- Username: `admin`
- Password: `admin123`

## Scripts có sẵn

```bash
# Chạy development server
npm start

# Build cho production
npm run build

# Chạy tests
npm test

# Eject (không khuyến khích)
npm run eject
```

## Tùy chỉnh

### Themes & Colors
Chỉnh sửa CSS variables trong `src/styles/global.css`:
```css
:root {
    --primary-color: #e91e63;    /* Màu chính */
    --secondary-color: #f8bbd9;  /* Màu phụ */
    --accent-color: #ff6b9d;     /* Màu nhấn */
}
```

### API Endpoints
Cấu hình base URL trong `src/services/apiService.js` hoặc file `.env`

## Roadmap

### Version 2.0 (Sắp tới)
- [ ] Real-time preview với Canvas API
- [ ] Template editor nâng cao
- [ ] Payment integration
- [ ] Email notifications
- [ ] Social sharing
- [ ] Multi-language support
- [ ] PWA capabilities

### Version 2.1
- [ ] Advanced admin dashboard
- [ ] Analytics & reporting
- [ ] Bulk operations
- [ ] Template versioning
- [ ] Customer reviews system

## Performance

### Optimization
- Code splitting với React.lazy()
- Image optimization và lazy loading
- Bundle size optimization
- Caching strategies

### Monitoring
- Error boundary implementation
- Performance monitoring
- User analytics (optional)

## Deployment

### Vercel (Khuyến khích)
```bash
npm run build
# Upload build folder to Vercel
```

### Netlify
```bash
npm run build
# Upload build folder to Netlify
```

### Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npx", "serve", "-s", "build"]
```

## Troubleshooting

### Common Issues

1. **CORS Error**
   - Đảm bảo backend có cấu hình CORS cho localhost:3000
   - Kiểm tra proxy trong package.json

2. **API Connection**
   - Xác nhận backend đang chạy tại port 8080
   - Kiểm tra network requests trong Developer Tools

3. **Build Errors**
   - Xóa node_modules và chạy `npm install` lại
   - Kiểm tra version Node.js tương thích

## Liên hệ & Hỗ trợ

- Email: support@thiepCuoi.com
- Phone: 0123 456 789
- GitHub Issues: [Link to issues]

## License

Copyright © 2024 Thiệp Cưới Online. All rights reserved.
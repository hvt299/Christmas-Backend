<div align="center">

  <h1>🎄 Christmas Wishes System 🎁</h1>
  <h3>Hệ thống Backend API gửi tặng quà Giáng Sinh</h3>

  <p>
    Một giải pháp Backend mạnh mẽ được xây dựng bằng kiến trúc Modular của NestJS. 
    Hệ thống cung cấp RESTful API để quản lý người dùng, xác thực bảo mật và xử lý toàn bộ nghiệp vụ tạo, đóng gói và chia sẻ các hộp quà Giáng Sinh bí mật.
  </p>

  <p>
    <img src="https://img.shields.io/badge/license-UNLICENSED-red" alt="License">
    <img src="https://img.shields.io/badge/status-Active_Development-success" alt="Status">
    <img src="https://img.shields.io/badge/framework-NestJS_11-E0234E?logo=nestjs" alt="NestJS">
  </p>

</div>

<br />

# ⚙️ BACKEND API SERVICE

Đây là Repository chứa mã nguồn **Backend**, đóng vai trò là lõi xử lý nghiệp vụ, quản lý cơ sở dữ liệu (MongoDB) và cung cấp RESTful API cho hệ thống Frontend Christmas Wishes.

## 🛠️ Công nghệ & Phiên bản

Dựa trên cấu hình `package.json`:

| Công nghệ | Phiên bản | Vai trò |
| :--- | :--- | :--- |
| **[NestJS](https://nestjs.com/)** | `^11.0.17` | Framework backend Node.js, kiến trúc Modular |
| **[@nestjs/mongoose](https://docs.nestjs.com/techniques/mongodb)** | `^11.0.4` | Tích hợp MongoDB với NestJS |
| **[Mongoose](https://mongoosejs.com/)** | `^9.6.2` | ODM MongoDB, quản lý Schema & Validation |
| **[google-auth-library](https://github.com/googleapis/google-auth-library-nodejs)** | `^10.6.2` | Xử lý xác thực Token từ Google OAuth2 (Google Login) |
| **[@getbrevo/brevo](https://www.brevo.com/)** | `^3.0.4` | Dịch vụ gửi Email (Xác thực, Quên mật khẩu) |
| **[bcrypt](https://www.npmjs.com/package/bcrypt)** | `^6.0.0` | Mã hóa và bảo mật mật khẩu người dùng |
| **[passport-jwt](https://www.passportjs.org/)**| `^4.0.1` | Strategy xác thực người dùng bằng cơ chế JWT |
| **[@nestjs/swagger](https://docs.nestjs.com/openapi/introduction)**| `^11.4.2` | Tự động tạo tài liệu API (OpenAPI) |

## 🌟 Tính năng nghiệp vụ (Modules)

* **🔐 Auth & Users:**
  * Xác thực người dùng đa phương thức: JWT truyền thống và Google OAuth2 (Tự động liên kết/tạo tài khoản bằng email).
  * Mã hóa mật khẩu bảo mật chuẩn bcrypt.
  * Tính năng cập nhật hồ sơ cá nhân và thay đổi mật khẩu (yêu cầu xác thực mật khẩu cũ).
  * Hệ thống tài khoản dùng chung (SSO): Người dùng có thể sử dụng cùng một tài khoản cho cả sự kiện Tết và Giáng sinh.

* **🎁 Quản lý Quà Tặng (Gifts):**
  * **Tạo Quà:** Đóng gói hộp quà với nội dung lời chúc, tùy chỉnh màu sắc hộp quà (đỏ, xanh, vàng) và đính kèm đường dẫn nhạc nền.
  * **Danh sách Quà:** Lấy danh sách các món quà người dùng đã tạo để quản lý và chia sẻ link.
  * **Mở Quà:** Cung cấp dữ liệu chi tiết của hộp quà dựa trên ID để hiển thị hiệu ứng 3D và phát nhạc bên phía Frontend.

* **📧 Hệ thống Email (Brevo):**
  * Tích hợp Brevo API để tự động gửi email.
  * Hỗ trợ luồng gửi mã OTP khôi phục mật khẩu an toàn.

## 🚀 Cài đặt & Khởi chạy

### 1️⃣ Yêu cầu hệ thống (Prerequisites)

- Node.js >= 20
- MongoDB (Local hoặc MongoDB Atlas)

### 2️⃣ Clone & Cài đặt Dependencies

```bash
git clone https://github.com/hvt299/Christmas-Wishes-Backend.git
cd Christmas-Wishes-Backend
npm install
```

### 3️⃣ Cấu hình môi trường (.env)

Tạo file `.env` tại thư mục gốc của dự án:

```env
PORT=3001
FRONTEND_URL=http://localhost:3000
MONGO_URI=mongodb://localhost:27017/festive_events

GEMINI_API_KEY=YourSecretKeyHere

JWT_SECRET=YourSecretKeyHere
JWT_EXPIRATION=1d

SENDER_EMAIL=YourEmailHere
BREVO_API_KEY=YourSecretKeyHere
GOOGLE_CLIENT_ID=YourSecretKeyHere
```

### 4️⃣ Lệnh chạy (Scripts)

```bash
# Chạy môi trường phát triển (Watch mode)
npm run start:dev

# Build ra production
npm run build

# Chạy bản production
npm run start:prod
```

### 5️⃣ Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:cov
```

## 📚 Tài liệu API (Swagger)

Sau khi chạy server, truy cập đường dẫn sau để xem toàn bộ tài liệu API:

http://localhost:3001/api

Swagger UI hiển thị đầy đủ danh sách Route, Request Body và Response Schema.

## 📂 Cấu trúc Module

```text
src/
├── app.module.ts          # Root module
├── main.ts                # Application entry point, thiết lập CORS & Swagger
├── auth/                  # Logic Đăng nhập, Đăng ký, JWT Strategy, Google Login
├── users/                 # Module quản lý tài khoản User & Profile
├── gifts/                 # Module xử lý CRUD cho hộp quà Giáng Sinh
├── email/                 # Service gửi email (Quên mật khẩu) thông qua Brevo
└── ...
```

## 👨‍💻 Author

Developed by **Mr.T (hvt299)**  
GitHub: [https://github.com/hvt299](https://github.com/hvt299)
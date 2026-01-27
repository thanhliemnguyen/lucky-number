# 🌐 Hướng Dẫn Cấu Hình Domain lucky.publicvm.com

## Bước 1: Cấu hình DNS tại publicvm.com

Truy cập quản lý DNS của `publicvm.com` và thêm các bản ghi sau:

### Cho Backend (API):
```
Type: CNAME
Name: lucky
Value: lucky-number-backend-5s67.onrender.com
TTL: 3600
```

### Hoặc dùng A Record (nếu CNAME không hoạt động):
1. Lấy IP của Render:
```bash
nslookup lucky-number-backend-5s67.onrender.com
```

2. Thêm A Record:
```
Type: A
Name: lucky
Value: [IP từ bước 1]
TTL: 3600
```

## Bước 2: Thêm Custom Domain vào Render

1. Vào Render Dashboard: https://dashboard.render.com
2. Chọn service `lucky-number-backend-5s67`
3. Settings → Custom Domains
4. Click **"Add Custom Domain"**
5. Nhập: `lucky.publicvm.com`
6. Render sẽ cung cấp DNS records cần thêm
7. Đợi DNS propagate (5-30 phút)

## Bước 3: Cập nhật Code sau khi Domain hoạt động

Khi `lucky.publicvm.com` đã trỏ đúng, cập nhật lại:

### frontend/app.js:
```javascript
const API_URL = 'https://lucky.publicvm.com';
```

### backend/config.json:
```json
{
  "banner": {
    "image": "https://lucky.publicvm.com/images/banner.png"
  }
}
```

Sau đó push code lên GitHub để tự động deploy.

## Kiểm Tra

```bash
# Kiểm tra DNS
nslookup lucky.publicvm.com

# Kiểm tra API
curl https://lucky.publicvm.com/api/config
```

## Hiện Tại

✅ Backend đang chạy: `https://lucky-number-backend-5s67.onrender.com`
⏳ Chờ cấu hình domain: `lucky.publicvm.com`

Bạn có thể deploy frontend ngay với URL Render hiện tại, sau đó cập nhật domain sau!

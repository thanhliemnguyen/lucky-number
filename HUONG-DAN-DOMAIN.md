# 🌐 Hướng Dẫn Chi Tiết: Cấu Hình Domain lucky.publicvm.com

## ❓ Câu Hỏi Quan Trọng

**Bạn đã đăng ký domain `publicvm.com` ở đâu?**

Các nhà cung cấp phổ biến:
- Cloudflare
- GoDaddy
- Namecheap
- Google Domains
- AWS Route 53
- Nhà cung cấp khác

---

## 📍 BƯỚC 1: Vào Quản Lý DNS

### Nếu dùng Cloudflare:
1. Đăng nhập: https://dash.cloudflare.com
2. Chọn domain `publicvm.com`
3. Click tab **"DNS"** → **"Records"**

### Nếu dùng GoDaddy:
1. Đăng nhập: https://account.godaddy.com
2. My Products → Domains
3. Click domain `publicvm.com` → **"Manage DNS"**

### Nếu dùng Namecheap:
1. Đăng nhập: https://ap.www.namecheap.com
2. Domain List → Click **"Manage"** bên cạnh `publicvm.com`
3. Tab **"Advanced DNS"**

### Nếu dùng Google Domains:
1. Đăng nhập: https://domains.google.com
2. Chọn `publicvm.com`
3. Click **"DNS"** ở menu bên trái

### Nếu dùng AWS Route 53:
1. Đăng nhập AWS Console
2. Services → Route 53 → Hosted Zones
3. Click `publicvm.com`

---

## 📍 BƯỚC 2: Thêm CNAME Record

Sau khi vào quản lý DNS, thêm record mới:

### Thông tin cần điền:

| Field | Giá trị |
|-------|---------|
| **Type** | CNAME |
| **Name/Host** | `lucky` hoặc `lucky.publicvm.com` |
| **Value/Target** | `lucky-number-backend-5s67.onrender.com` |
| **TTL** | 3600 (hoặc Auto) |
| **Proxy Status** | DNS only (nếu Cloudflare) |

### Ví dụ giao diện:

**Cloudflare:**
```
Type: CNAME
Name: lucky
Target: lucky-number-backend-5s67.onrender.com
Proxy status: DNS only (tắt cloud màu cam)
TTL: Auto
```

**GoDaddy:**
```
Type: CNAME
Host: lucky
Points to: lucky-number-backend-5s67.onrender.com
TTL: 1 Hour
```

**Namecheap:**
```
Type: CNAME Record
Host: lucky
Value: lucky-number-backend-5s67.onrender.com
TTL: Automatic
```

### Click **"Save"** hoặc **"Add Record"**

---

## 📍 BƯỚC 3: Thêm Custom Domain vào Render

1. Mở trình duyệt, truy cập: https://dashboard.render.com
2. Đăng nhập tài khoản Render của bạn
3. Click vào service **"lucky-number-backend-5s67"** (hoặc tên service bạn đã tạo)
4. Ở menu bên trái, click **"Settings"**
5. Kéo xuống phần **"Custom Domains"**
6. Click nút **"Add Custom Domain"**
7. Nhập: `lucky.publicvm.com`
8. Click **"Save"**

Render sẽ hiển thị:
```
✅ Domain added successfully
⏳ Waiting for DNS propagation...
```

---

## 📍 BƯỚC 4: Đợi DNS Propagate

- Thời gian: **5-30 phút** (có thể lên đến 48 giờ)
- Kiểm tra bằng lệnh:

```bash
# Windows (Command Prompt)
nslookup lucky.publicvm.com

# Hoặc kiểm tra online
https://dnschecker.org/#CNAME/lucky.publicvm.com
```

Khi thấy kết quả trỏ về `lucky-number-backend-5s67.onrender.com` → Thành công!

---

## 📍 BƯỚC 5: Cập Nhật Code

Sau khi domain hoạt động, cập nhật 2 file:

### File 1: `frontend/app.js`
Dòng 1, đổi thành:
```javascript
const API_URL = 'https://lucky.publicvm.com';
```

### File 2: `backend/config.json`
Đổi URL ảnh:
```json
{
  "banner": {
    "enabled": true,
    "image": "https://lucky.publicvm.com/images/banner.png",
    "link": "",
    "alt": ""
  },
  "donate": {
    "enabled": true,
    "methods": [
      {
        "name": "Momo",
        "info": "0123456789",
        "qr": "https://lucky.publicvm.com/images/momo-qr.png"
      }
    ]
  }
}
```

### Push lên GitHub:
```bash
git add .
git commit -m "Update domain to lucky.publicvm.com"
git push
```

Render và Vercel sẽ tự động deploy lại!

---

## ✅ Kiểm Tra Hoàn Tất

1. Truy cập: https://lucky.publicvm.com/api/config
   - Nếu thấy JSON → Backend OK ✅

2. Truy cập: https://lucky.publicvm.com
   - Nếu thấy website → Frontend OK ✅

3. Thử tính số may mắn
   - Nếu hoạt động → Hoàn tất 🎉

---

## 🆘 Nếu Không Biết Domain Ở Đâu

### Cách 1: Kiểm tra email
Tìm email đăng ký domain `publicvm.com`, thường có từ:
- "Domain Registration Confirmation"
- "Welcome to [Tên nhà cung cấp]"

### Cách 2: Tra cứu WHOIS
```bash
# Truy cập
https://who.is/whois/publicvm.com

# Xem phần "Registrar" để biết đăng ký ở đâu
```

### Cách 3: Hỏi người quản lý
Nếu domain do công ty/tổ chức quản lý, hỏi người phụ trách IT.

---

## 📞 Cần Hỗ Trợ?

Nếu bạn cho tôi biết:
1. **Domain đăng ký ở đâu?** (Cloudflare, GoDaddy, Namecheap...)
2. **Bạn có quyền truy cập quản lý DNS không?**

Tôi sẽ hướng dẫn chi tiết hơn! 😊

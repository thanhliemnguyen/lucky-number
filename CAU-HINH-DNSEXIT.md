# 🌐 Hướng Dẫn Cấu Hình Domain lucky.publicvm.com trên DNSExit

## 📍 BƯỚC 1: Đăng Nhập DNSExit

1. Mở trình duyệt, truy cập: **https://www.dnsexit.com**
2. Click **"Login"** ở góc phải trên
3. Nhập **Username** và **Password**
4. Click **"Sign In"**

---

## 📍 BƯỚC 2: Vào Quản Lý DNS

1. Sau khi đăng nhập, bạn sẽ thấy Dashboard
2. Tìm và click vào **"DNS"** hoặc **"Manage DNS"** ở menu
3. Chọn domain **"publicvm.com"** từ danh sách
4. Click **"Edit"** hoặc **"Manage Records"**

---

## 📍 BƯỚC 3: Thêm CNAME Record

### Cách 1: Thêm CNAME (Khuyên dùng)

1. Tìm nút **"Add Record"** hoặc **"Add New Record"**
2. Điền thông tin:

```
Record Type: CNAME
Host/Name: lucky
Target/Value: lucky-number-backend-5s67.onrender.com
TTL: 3600 (hoặc để mặc định)
```

3. Click **"Save"** hoặc **"Add Record"**

### Cách 2: Nếu CNAME không hoạt động, dùng A Record

**Bước 2a: Lấy IP của Render**
1. Mở Command Prompt (Windows) hoặc Terminal
2. Chạy lệnh:
```bash
nslookup lucky-number-backend-5s67.onrender.com
```
3. Copy địa chỉ IP (ví dụ: `216.24.57.1`)

**Bước 2b: Thêm A Record**
```
Record Type: A
Host/Name: lucky
IP Address: [IP từ bước 2a]
TTL: 3600
```

4. Click **"Save"**

---

## 📍 BƯỚC 4: Thêm Custom Domain vào Render

1. Mở trình duyệt mới, truy cập: **https://dashboard.render.com**
2. Đăng nhập tài khoản Render
3. Click vào service **"lucky-number-backend-5s67"**
4. Ở menu bên trái, click **"Settings"**
5. Kéo xuống phần **"Custom Domains"**
6. Click nút **"Add Custom Domain"**
7. Nhập: **lucky.publicvm.com**
8. Click **"Save"**

Render sẽ hiển thị:
```
✅ Domain added
⏳ Verifying DNS...
```

---

## 📍 BƯỚC 5: Đợi DNS Propagate

- **Thời gian:** 5-30 phút (có thể lên đến 2 giờ)
- **Kiểm tra:** Mở Command Prompt, chạy:

```bash
nslookup lucky.publicvm.com
```

Khi thấy kết quả trỏ về Render → Thành công! ✅

Hoặc kiểm tra online: https://dnschecker.org/#CNAME/lucky.publicvm.com

---

## 📍 BƯỚC 6: Cập Nhật Code

Sau khi domain hoạt động (bước 5 thành công), cập nhật 2 file:

### File 1: `frontend/app.js`
Mở file, tìm dòng đầu tiên, đổi thành:
```javascript
const API_URL = 'https://lucky.publicvm.com';
```

### File 2: `backend/config.json`
Mở file, đổi URL ảnh:
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

**Cách 1: Dùng Git Command**
```bash
git add .
git commit -m "Update domain to lucky.publicvm.com"
git push
```

**Cách 2: Dùng GitHub Desktop**
1. Mở GitHub Desktop
2. Thấy 2 files thay đổi
3. Nhập commit message: "Update domain"
4. Click "Commit to main"
5. Click "Push origin"

Render và Vercel sẽ tự động deploy lại sau vài phút!

---

## ✅ BƯỚC 7: Kiểm Tra Hoàn Tất

### Test 1: Kiểm tra Backend
Mở trình duyệt, truy cập:
```
https://lucky.publicvm.com/api/config
```
- Nếu thấy JSON → Backend OK ✅

### Test 2: Kiểm tra Frontend
Truy cập:
```
https://lucky.publicvm.com
```
- Nếu thấy website → Frontend OK ✅

### Test 3: Thử tính số may mắn
- Nhập tên, ngày sinh
- Click "Tính Số May Mắn"
- Nếu hiện kết quả → Hoàn tất 🎉

---

## 🆘 Xử Lý Lỗi

### Lỗi 1: "This site can't be reached"
**Nguyên nhân:** DNS chưa propagate
**Giải pháp:** Đợi thêm 10-20 phút, sau đó thử lại

### Lỗi 2: "SSL Certificate Error"
**Nguyên nhân:** Render đang tạo SSL certificate
**Giải pháp:** Đợi 5-10 phút, Render tự động cấp SSL miễn phí

### Lỗi 3: Vẫn thấy URL Render thay vì lucky.publicvm.com
**Nguyên nhân:** Chưa cập nhật code
**Giải pháp:** Làm lại BƯỚC 6

### Lỗi 4: CNAME không lưu được trên DNSExit
**Nguyên nhân:** Có thể đã có record trùng tên
**Giải pháp:** 
1. Xóa record cũ có tên "lucky" (nếu có)
2. Thêm lại CNAME mới

---

## 📸 Hình Ảnh Minh Họa DNSExit

Giao diện DNSExit thường có dạng:

```
┌─────────────────────────────────────────┐
│ DNS Management - publicvm.com           │
├─────────────────────────────────────────┤
│ [Add Record]                            │
│                                         │
│ Type    Host    Value              TTL  │
│ ─────────────────────────────────────── │
│ A       @       123.45.67.89      3600  │
│ CNAME   www     publicvm.com      3600  │
│ CNAME   lucky   lucky-number...   3600  │ ← Thêm dòng này
│                                         │
└─────────────────────────────────────────┘
```

---

## 📞 Cần Hỗ Trợ?

Nếu gặp khó khăn:
1. Chụp màn hình giao diện DNSExit
2. Chụp màn hình lỗi (nếu có)
3. Cho tôi biết bạn đang ở bước nào

Tôi sẽ hỗ trợ cụ thể hơn! 😊

---

## 🎯 Tóm Tắt Nhanh

1. ✅ Đăng nhập DNSExit → Chọn publicvm.com
2. ✅ Thêm CNAME: `lucky` → `lucky-number-backend-5s67.onrender.com`
3. ✅ Vào Render → Settings → Custom Domains → Add `lucky.publicvm.com`
4. ⏰ Đợi 5-30 phút
5. ✅ Cập nhật code (app.js + config.json) → Push GitHub
6. 🎉 Xong!

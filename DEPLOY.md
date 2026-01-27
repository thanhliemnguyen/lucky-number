# 🚀 Hướng Dẫn Deploy Website Lên Hosting Miễn Phí

## 📋 Mục Lục
1. [Chuẩn bị](#chuẩn-bị)
2. [Deploy Backend (Render.com)](#deploy-backend)
3. [Deploy Frontend (Vercel)](#deploy-frontend)
4. [Đăng ký Domain miễn phí](#domain-miễn-phí)
5. [Kết nối Domain với Website](#kết-nối-domain)

---

## 1️⃣ Chuẩn Bị

### Tạo tài khoản GitHub
1. Truy cập: https://github.com
2. Đăng ký tài khoản miễn phí
3. Xác nhận email

### Upload code lên GitHub
```bash
# Mở terminal trong thư mục lucky-number
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/thanhliemnguyen/lucky-number.git
git push -u origin main
```

**Hoặc dùng GitHub Desktop:**
1. Tải GitHub Desktop: https://desktop.github.com
2. File → Add Local Repository → Chọn thư mục `lucky-number`
3. Publish repository

---

## 2️⃣ Deploy Backend (Render.com)

### Bước 1: Đăng ký Render
1. Truy cập: https://render.com
2. Click **"Get Started"**
3. Đăng nhập bằng GitHub

### Bước 2: Tạo Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect GitHub repository `lucky-number`
3. Cấu hình:
   - **Name:** `lucky-number-backend`
   - **Region:** Singapore (gần VN nhất)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free

4. Click **"Create Web Service"**

### Bước 3: Đợi Deploy
- Render sẽ tự động build (3-5 phút)
- Khi xong, bạn sẽ có URL: `https://lucky.publicvm.com`

### Bước 4: Kiểm tra
- Truy cập: `https://lucky.publicvm.com/api/config`
- Nếu thấy JSON config → Thành công! ✅

### ⚠️ Lưu ý quan trọng:
- Free tier của Render sẽ **sleep sau 15 phút không dùng**
- Lần đầu truy cập sau khi sleep sẽ mất 30-50 giây để wake up
- Giải pháp: Dùng UptimeRobot (miễn phí) để ping mỗi 5 phút

---

## 3️⃣ Deploy Frontend (Vercel)

### Bước 1: Đăng ký Vercel
1. Truy cập: https://vercel.com
2. Click **"Sign Up"**
3. Đăng nhập bằng GitHub

### Bước 2: Import Project
1. Click **"Add New..."** → **"Project"**
2. Import repository `lucky-number`
3. Cấu hình:
   - **Framework Preset:** Other
   - **Root Directory:** `frontend`
   - **Build Command:** (để trống)
   - **Output Directory:** (để trống)

4. Click **"Deploy"**

### Bước 3: Đợi Deploy
- Vercel sẽ deploy (1-2 phút)
- Bạn sẽ có URL: `https://lucky.publicvm.com`

### Bước 4: Cập nhật API URL
1. File `frontend/app.js` đã được cấu hình sẵn:
```javascript
const API_URL = 'https://lucky.publicvm.com';
```

4. Push code lên GitHub → Vercel tự động redeploy

### Bước 5: Kiểm tra
- Truy cập: `https://lucky.publicvm.com`
- Thử tính số may mắn → Nếu hoạt động → Thành công! ✅

---

## 4️⃣ Domain Miễn Phí

### Tùy chọn 1: Dùng subdomain của Vercel (Khuyên dùng)
- **Ưu điểm:** Miễn phí, SSL tự động, không cần setup
- **URL:** `lucky-number.vercel.app`
- **Cách đổi tên:**
  1. Vercel Dashboard → Settings → Domains
  2. Edit domain name
  3. Nhập tên mới: `your-name.vercel.app`

### Tùy chọn 2: Freenom (.tk, .ml, .ga, .cf, .gq)

#### Bước 1: Đăng ký domain
1. Truy cập: https://www.freenom.com
2. Tìm kiếm tên domain: `lucky-number.tk`
3. Click **"Get it now!"** → **"Checkout"**
4. Period: **12 Months @ FREE**
5. Đăng ký tài khoản và hoàn tất

#### Bước 2: Cấu hình DNS
1. Freenom → My Domains → Manage Domain
2. Management Tools → Nameservers
3. Chọn **"Use custom nameservers"**
4. Nhập nameservers của Vercel:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```
5. Click **"Change Nameservers"**

#### Bước 3: Thêm domain vào Vercel
1. Vercel Dashboard → Settings → Domains
2. Add domain: `lucky-number.tk`
3. Vercel sẽ hướng dẫn thêm DNS records
4. Đợi 24-48 giờ để DNS propagate

### Tùy chọn 3: InfinityFree (Subdomain + Hosting)
1. Truy cập: https://infinityfree.net
2. Đăng ký tài khoản
3. Tạo website → Chọn subdomain: `lucky-number.rf.gd`
4. Upload file frontend qua FTP
5. Backend vẫn dùng Render

---

## 5️⃣ Cấu Hình Sau Deploy

### Cập nhật config.json
1. Sửa file `backend/config.json`:
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

2. Push lên GitHub → Render tự động redeploy

### Upload ảnh banner
1. Copy ảnh `banner.png` vào `frontend/images/`
2. Push lên GitHub
3. Ảnh sẽ được serve tại: `https://lucky.publicvm.com/images/banner.png`

---

## 🎯 Tổng Kết

### URL sau khi deploy:
- **Website:** `https://lucky.publicvm.com`
- **Admin:** `https://lucky.publicvm.com/admin.html`

### Chi phí:
- **Backend (Render):** $0/tháng (Free tier)
- **Frontend (Vercel):** $0/tháng (Free tier)
- **Domain (.tk):** $0/năm (Freenom)
- **Tổng:** $0 💰

### Giới hạn Free tier:
- **Render:** 750 giờ/tháng, sleep sau 15 phút
- **Vercel:** 100GB bandwidth/tháng, unlimited requests
- **Freenom:** Gia hạn mỗi năm (miễn phí)

---

## 🆘 Xử Lý Lỗi Thường Gặp

### Lỗi 1: Backend không kết nối được
**Nguyên nhân:** Backend đang sleep
**Giải pháp:** Đợi 30-50 giây, hoặc dùng UptimeRobot

### Lỗi 2: CORS Error
**Nguyên nhân:** Backend chưa cho phép frontend
**Giải pháp:** Đã có `app.use(cors())` trong code

### Lỗi 3: Ảnh không hiển thị
**Nguyên nhân:** Đường dẫn sai
**Giải pháp:** Kiểm tra URL trong config.json

### Lỗi 4: Domain không hoạt động
**Nguyên nhân:** DNS chưa propagate
**Giải pháp:** Đợi 24-48 giờ

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề:
1. Kiểm tra logs trên Render Dashboard
2. Kiểm tra console browser (F12)
3. Xem lại từng bước trong hướng dẫn

**Chúc bạn deploy thành công! 🎉**

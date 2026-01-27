# 🌐 Hướng Dẫn Kết Nối Domain lucky.publicvm.com với Vercel

## Bước 1: Thêm Domain vào Vercel

1. Vào Vercel Dashboard: https://vercel.com/dashboard
2. Chọn project **lucky-number-five**
3. Click tab **Settings**
4. Click **Domains** (menu bên trái)
5. Nhập domain: `lucky.publicvm.com`
6. Click **Add**

Vercel sẽ hiển thị DNS records cần thêm, thường là:
- **Type:** CNAME
- **Name:** lucky (hoặc @)
- **Value:** cname.vercel-dns.com

---

## Bước 2: Cấu hình DNS trên DNSExit

1. Đăng nhập: https://dnsexit.com
2. Vào **DNS Management** hoặc **Manage Domains**
3. Chọn domain **publicvm.com**
4. Tìm subdomain **lucky** hoặc thêm mới:

### Thêm CNAME Record:
- **Type:** CNAME
- **Host/Name:** `lucky`
- **Points to/Value:** `cname.vercel-dns.com`
- **TTL:** 3600 (hoặc để mặc định)

5. Click **Save** hoặc **Update**

---

## Bước 3: Đợi DNS Propagate

- Thời gian: 5 phút - 24 giờ (thường là 10-30 phút)
- Kiểm tra: Truy cập `http://lucky.publicvm.com`
- Nếu thấy website → Thành công! ✅

---

## Kiểm Tra DNS (Optional)

Mở Command Prompt/Terminal và chạy:
```bash
nslookup lucky.publicvm.com
```

Nếu thấy trỏ đến Vercel IP → DNS đã cập nhật!

---

## Lưu Ý

- **SSL/HTTPS:** Vercel tự động cấp SSL miễn phí (Let's Encrypt)
- **Thời gian SSL:** 1-2 giờ sau khi DNS propagate
- **Redirect:** Vercel tự động redirect `www.lucky.publicvm.com` → `lucky.publicvm.com`

---

## Nếu Gặp Lỗi

### Lỗi: "Invalid Configuration"
- Kiểm tra lại CNAME record trên DNSExit
- Đảm bảo value là: `cname.vercel-dns.com`

### Lỗi: "Domain already in use"
- Domain đã được dùng bởi project khác
- Xóa domain khỏi project cũ trước

### DNS không cập nhật sau 24 giờ
- Xóa CNAME record cũ
- Thêm lại CNAME mới
- Clear DNS cache: `ipconfig /flushdns` (Windows)

---

## Kết Quả

Sau khi hoàn tất:
- ✅ Website: `https://lucky.publicvm.com`
- ✅ Admin: `https://lucky.publicvm.com/admin.html`
- ✅ SSL tự động (HTTPS)
- ✅ Miễn phí 100%

🎉 Chúc mừng bạn đã có domain riêng!

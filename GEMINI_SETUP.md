# 🤖 Tích Hợp Google Gemini AI (Miễn Phí)

## Tại sao dùng Gemini?
- ✅ **Miễn phí:** 60 requests/phút
- ✅ **Thông minh:** Tạo phân tích tử vi chi tiết, cá nhân hóa
- ✅ **Tiếng Việt:** Hỗ trợ tốt tiếng Việt
- ❌ ChatGPT: Không có free API

---

## Bước 1: Lấy Gemini API Key (Miễn Phí)

1. Truy cập: https://makersuite.google.com/app/apikey
2. Đăng nhập bằng Google Account
3. Click **"Create API Key"**
4. Chọn project hoặc tạo mới
5. Copy API Key (dạng: `AIzaSy...`)
6. **LƯU LẠI API KEY!**

---

## Bước 2: Thêm API Key vào Render

1. Vào Render Dashboard: https://dashboard.render.com
2. Chọn service **lucky-number-backend**
3. Tab **Environment**
4. Click **Add Environment Variable**
5. Thêm:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** `AIzaSy...` (API key bạn vừa copy)
6. Click **Save Changes**
7. Render sẽ tự động redeploy

---

## Bước 3: Test

1. Đợi deploy xong (2-3 phút)
2. Vào website tính số may mắn
3. Phân tích sẽ chi tiết và cá nhân hóa hơn!

**Trước khi có Gemini:**
> "Tính cách: Tự chủ"

**Sau khi có Gemini:**
> "Tính cách: Bạn là người độc lập, tự tin và có khả năng lãnh đạo tốt. Thích làm việc theo cách riêng và không ngại đương đầu với thử thách."

---

## Giới Hạn Free Tier

- **60 requests/phút** (rất nhiều cho website cá nhân)
- **1,500 requests/ngày**
- **1 triệu tokens/tháng**

→ Đủ cho hàng nghìn người dùng mỗi ngày!

---

## Nếu Không Có API Key

Code vẫn chạy bình thường với phân tích cơ bản (không dùng AI).

---

## Lưu Ý Bảo Mật

- ❌ KHÔNG commit API key vào GitHub
- ✅ Chỉ lưu trong Environment Variables trên Render
- ✅ API key được giữ bí mật

---

**Khuyến nghị:** Nên setup Gemini để có trải nghiệm tốt nhất! 🚀

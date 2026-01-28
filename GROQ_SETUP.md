# 🚀 Groq Cloud Setup - AI Siêu Nhanh

Groq Cloud cung cấp API AI miễn phí với tốc độ cực nhanh và quota cao.

## 📋 Hướng Dẫn Setup

### 1. Đăng ký tài khoản
- Truy cập: https://console.groq.com/
- Đăng ký bằng email hoặc GitHub
- Xác thực email

### 2. Tạo API Key
- Vào **API Keys** trong dashboard
- Click **Create API Key**
- Đặt tên: `Lucky Number App`
- Copy API key (chỉ hiện 1 lần)

### 3. Cấu hình Backend
```bash
cd backend
npm install groq-sdk
```

### 4. Thêm API Key vào .env
```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 5. Restart Server
```bash
npm start
```

## 🎯 Ưu Điểm Groq

✅ **Tốc độ**: Phản hồi gần như tức thì  
✅ **Quota cao**: 14,400 requests/ngày  
✅ **Miễn phí**: Không cần thẻ tín dụng  
✅ **Ổn định**: Ít bị lỗi hơn Gemini  

## 🔄 Cách Hoạt Động

1. **Groq (Primary)**: Xử lý AI chính
2. **Gemini (Backup)**: Fallback khi Groq lỗi
3. **Static (Final)**: Fallback cuối cùng

## 📊 Models Được Dùng

- **llama3-8b-8192**: Nhanh, chính xác, miễn phí
- **mixtral-8x7b-32768**: Thông minh hơn (nếu cần)

## 🚨 Lưu Ý

- Giới hạn token/phút: 30,000
- Giới hạn request/phút: 30
- Nếu vượt quota, tự động chuyển sang Gemini

## ✅ Kiểm Tra

Khi chạy server, sẽ thấy:
```
✅ Groq AI enabled (14,400 requests/day)
✅ Gemini AI enabled (Limited to 15 requests/day)
```

Bây giờ website sẽ nhanh hơn và ít lỗi hơn nhiều!
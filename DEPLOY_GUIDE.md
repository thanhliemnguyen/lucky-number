# 🚀 Hướng Dẫn Deploy Production

## 1. Deploy Backend (Render.com)

1. **Tạo tài khoản**: https://render.com
2. **New > Web Service**
3. **Connect GitHub repo**
4. **Cấu hình:**
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Environment: Node
   - Instance Type: Free

5. **Environment Variables:**
   ```
   GEMINI_API_KEY=your_gemini_key
   GROQ_API_KEY=your_groq_key
   MONGODB_URI=your_mongodb_uri
   ```

6. **Deploy** và lấy URL (ví dụ: `https://lucky-number-backend.onrender.com`)

## 2. Cập Nhật Frontend

Sửa file `frontend/app.js`:

```javascript
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000' 
    : 'https://lucky-number-backend.onrender.com'; // URL backend thực tế
```

## 3. Deploy Frontend (Vercel)

1. **Tạo tài khoản**: https://vercel.com
2. **Import project**
3. **Cấu hình:**
   - Framework: Other
   - Root Directory: `frontend`
   - Build Command: (để trống)
   - Output Directory: (để trống)

4. **Deploy** và lấy URL frontend

## 4. Cập Nhật Config

Sửa `backend/config.json`:

```json
{
  "donate": {
    "enabled": true,
    "methods": [
      {
        "name": "Momo",
        "info": "0936375290",
        "qr": "https://lucky-number-backend.onrender.com/images/momo-qr.png"
      }
    ]
  },
  "banner": {
    "enabled": true,
    "image": "https://lucky-number-backend.onrender.com/images/banner.png",
    "link": "",
    "alt": "Banner"
  }
}
```

## 5. Upload Images

Copy ảnh vào `frontend/images/`:
- `momo-qr.png`
- `banner.png`

## 6. Test

- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.onrender.com/api/config`

## ⚠️ Lưu Ý

- Render free tier có thể sleep sau 15 phút không dùng
- Lần đầu load có thể chậm 30-60s
- Thay tất cả `localhost:3000` bằng URL production
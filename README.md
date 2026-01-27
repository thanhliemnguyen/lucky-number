# 🍀 Lucky Number - Website Số May Mắn

Website tính số may mắn theo ngày sinh và tạo tên con dựa trên Tử Vi Số Học.

## Tính Năng

✅ Tính số may mắn theo ngày tháng năm sinh + tên
✅ Phân tích Tử Vi cho từng con số (1-9, 0)
✅ Gợi ý tên con dựa vào tên bố mẹ
✅ Cấu hình donate và banner động
✅ Responsive, đẹp mắt

## Cài Đặt

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
Mở file `frontend/index.html` hoặc dùng Live Server.

**Lưu ý:** Sửa `API_URL` trong `frontend/app.js` thành URL backend của bạn.

## Hosting Miễn Phí

### Backend (chọn 1):
1. **Render.com** (Khuyên dùng)
   - Đăng ký tại https://render.com
   - New > Web Service
   - Connect GitHub repo
   - Build: `cd backend && npm install`
   - Start: `cd backend && npm start`

2. **Railway.app**
   - https://railway.app
   - Deploy from GitHub
   - Tự động detect Node.js

3. **Cyclic.sh**
   - https://cyclic.sh
   - Connect GitHub
   - Deploy tự động

### Frontend (chọn 1):
1. **Vercel** (Khuyên dùng)
   - https://vercel.com
   - Import project
   - Root: `frontend`
   - Deploy

2. **Netlify**
   - https://netlify.com
   - Drag & drop folder `frontend`

3. **GitHub Pages**
   - Push code lên GitHub
   - Settings > Pages > Deploy

### Domain Miễn Phí:
1. **Freenom** - https://freenom.com (.tk, .ml, .ga, .cf, .gq)
2. **InfinityFree** - https://infinityfree.net (subdomain)
3. **Vercel/Netlify** - Subdomain miễn phí (.vercel.app, .netlify.app)

### Database Miễn Phí (nếu cần):
- **MongoDB Atlas** - 512MB free
- **Supabase** - PostgreSQL free tier
- **PlanetScale** - MySQL free tier
- **JSON file** (đang dùng) - Không cần setup

## Cấu Hình

Sửa file `backend/config.json`:

```json
{
  "donate": {
    "enabled": true,
    "methods": [
      {
        "name": "Momo",
        "info": "SỐ ĐIỆN THOẠI",
        "qr": "http://localhost:3000/images/momo-qr.png"
      }
    ]
  },
  "banner": {
    "enabled": true,
    "image": "http://localhost:3000/images/banner.png",
    "link": "LINK_KHI_CLICK",
    "alt": "Mô tả banner"
  }
}
```

**Đặt ảnh:**
- Copy ảnh vào thư mục `frontend/images/`
- Ví dụ: `banner.png`, `momo-qr.png`
- Khi deploy, thay `localhost:3000` bằng URL backend thực tế

## API Endpoints

- `POST /api/lucky-number` - Tính số may mắn
- `POST /api/baby-name` - Tạo tên con
- `GET /api/config` - Lấy cấu hình
- `POST /api/config` - Cập nhật cấu hình

## Công Nghệ

- Frontend: HTML/CSS/JavaScript
- Backend: Node.js + Express
- Database: JSON file
- Hosting: Vercel + Render (miễn phí)

## License

MIT - Sử dụng tự do!

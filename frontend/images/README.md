# Thư mục ảnh

Đặt ảnh banner và QR code vào đây.

## Cách sử dụng:

1. Copy ảnh vào thư mục này (ví dụ: `banner.png`, `momo-qr.png`)

2. Sửa file `backend/config.json`:

```json
{
  "banner": {
    "enabled": true,
    "image": "http://localhost:3000/images/banner.png",
    "link": "https://example.com",
    "alt": "Banner quảng cáo"
  },
  "donate": {
    "enabled": true,
    "methods": [
      {
        "name": "Momo",
        "info": "0123456789",
        "qr": "http://localhost:3000/images/momo-qr.png"
      }
    ]
  }
}
```

3. Khi deploy lên hosting, thay `http://localhost:3000` bằng URL thực tế

## Kích thước đề xuất:
- Banner: 1200x300px
- QR Code: 300x300px

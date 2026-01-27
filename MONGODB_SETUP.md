# 🗄️ Hướng Dẫn Setup MongoDB Atlas (Miễn Phí)

## Tại sao cần MongoDB?
- Render.com free tier **không lưu file** → mỗi lần restart mất data
- MongoDB Atlas **miễn phí 512MB** → lưu data vĩnh viễn

---

## Bước 1: Tạo Cluster (Database)

1. Ở màn hình **Project 0 Overview**, click nút **+ Create** hoặc **Create a deployment**
2. Chọn **M0 FREE** (512MB miễn phí)
3. Provider: **AWS** hoặc **Google Cloud**
4. Region: Chọn **Singapore** (ap-southeast-1) - gần VN nhất
5. Cluster Name: `Cluster0` (để mặc định)
6. Click **Create Deployment** (hoặc **Create**)
7. Đợi 1-3 phút để MongoDB tạo cluster

---

## Bước 2: Tạo Database User (Popup sẽ hiện ra)

Sau khi tạo cluster, sẽ có popup **Security Quickstart**:

1. **Username:** `admin` (hoặc tên bạn muốn)
2. **Password:** Click **Autogenerate Secure Password** hoặc tự tạo
   - **LƯU LẠI PASSWORD NÀY!** (copy vào notepad)
3. Click **Create User**
4. Ở bước **Where would you like to connect from?**:
   - Chọn **My Local Environment**
   - Click **Add My Current IP Address**
   - Hoặc nhập: `0.0.0.0/0` (cho phép mọi IP)
5. Click **Finish and Close**
6. Click **Go to Database**

---

## Bước 3: Lấy Connection String

1. Ở màn hình **Database**, click nút **Connect** bên cạnh cluster
2. Chọn **Drivers**
3. Driver: **Node.js**, Version: **5.5 or later**
4. Copy connection string (dạng):
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **Thay `<password>`** bằng password bạn đã lưu ở Bước 2

**Ví dụ:**
- Password của bạn: `MyPass123`
- Connection string:
  ```
  mongodb+srv://admin:MyPass123@cluster0.xxxxx.mongodb.net/lucky-number?retryWrites=true&w=majority
  ```

---

## Bước 4: Nếu quên password hoặc cần tạo user mới

1. Click **Database Access** ở menu bên trái
2. Click **+ ADD NEW DATABASE USER**
3. Username: `admin`
4. Password: Tạo mới hoặc autogenerate
5. Database User Privileges: **Read and write to any database**
6. Click **Add User**

---

## Bước 5: Thêm Environment Variable vào Render

1. Vào Render Dashboard: https://dashboard.render.com
2. Chọn service `lucky-number-backend`
3. Vào tab **Environment**
4. Click **Add Environment Variable**
5. Key: `MONGODB_URI`
6. Value: Connection string đã copy (đã thay password)
   ```
   mongodb+srv://admin:your_password@lucky-number.abc123.mongodb.net/lucky-number?retryWrites=true&w=majority
   ```
7. Click **Save Changes**
8. Render sẽ tự động redeploy

---

## Bước 6: Kiểm tra

1. Đợi Render deploy xong (2-3 phút)
2. Vào website tính số may mắn vài lần
3. Vào admin page → Thấy lịch sử
4. Đợi 20 phút (để Render sleep)
5. Vào lại admin page → Lịch sử vẫn còn! ✅

---

## Lưu ý

- **Miễn phí:** 512MB storage, đủ cho hàng nghìn records
- **Persistent:** Data không bao giờ mất
- **Tự động:** Code đã hỗ trợ fallback nếu MongoDB không có

---

## Nếu không muốn dùng MongoDB

Code vẫn chạy bình thường, nhưng:
- Lịch sử sẽ reset mỗi lần Render restart
- Chỉ lưu trong RAM, không persistent

---

**Khuyến nghị:** Nên setup MongoDB để có trải nghiệm tốt nhất! 🚀

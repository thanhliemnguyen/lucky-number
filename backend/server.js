const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { connectDB, getStats, saveStats } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, '../frontend/images')));

const configPath = path.join(__dirname, 'config.json');

// Kết nối DB khi khởi động
connectDB();

// Phân tích số tử vi cho 540 tổ hợp (00-99 x 6 yếu tố)
function getTuViAnalysis(num) {
  const base = {
    1: { name: "Nhất Bạch Thủy Tinh", meaning: "Tài lộc, công danh, quý nhân phù trợ", color: "Trắng", element: "Thủy", lucky: "Đại cát" },
    2: { name: "Nhị Hắc Thổ Tinh", meaning: "Bệnh tật, tiểu nhân, cần cẩn thận", color: "Đen", element: "Thổ", lucky: "Hung" },
    3: { name: "Tam Bích Mộc Tinh", meaning: "Tranh chấp, quan phi, thị phi", color: "Xanh lục", element: "Mộc", lucky: "Hung" },
    4: { name: "Tứ Lục Mộc Tinh", meaning: "Văn xương, học vấn, sáng tạo", color: "Xanh lá", element: "Mộc", lucky: "Cát" },
    5: { name: "Ngũ Hoàng Thổ Tinh", meaning: "Tai họa, bệnh tật, hung tinh", color: "Vàng", element: "Thổ", lucky: "Đại hung" },
    6: { name: "Lục Bạch Kim Tinh", meaning: "Quyền lực, thăng tiến, may mắn", color: "Trắng", element: "Kim", lucky: "Đại cát" },
    7: { name: "Thất Xích Kim Tinh", meaning: "Phá tài, tranh cãi, cẩn thận", color: "Đỏ", element: "Kim", lucky: "Hung" },
    8: { name: "Bát Bạch Thổ Tinh", meaning: "Đại cát, tài lộc dồi dào", color: "Trắng", element: "Thổ", lucky: "Đại cát" },
    9: { name: "Cửu Tử Hỏa Tinh", meaning: "Hỷ sự, kết hôn, sinh con", color: "Tím", element: "Hỏa", lucky: "Cát" }
  };
  
  const star = (num % 9) || 9;
  const baseAnalysis = base[star];
  const decade = Math.floor(num / 10);
  
  const aspects = {
    0: { type: "Khởi đầu", trait: "Tiên phong", career: "Lãnh đạo", love: "Chủ động", health: "Tốt", finance: "Ổn định" },
    1: { type: "Độc lập", trait: "Tự chủ", career: "Doanh nhân", love: "Tự do", health: "Mạnh mẽ", finance: "Tự lập" },
    2: { type: "Hợp tác", trait: "Hòa đồng", career: "Đối tác", love: "Hài hòa", health: "Cân bằng", finance: "Hợp tác" },
    3: { type: "Sáng tạo", trait: "Nghệ thuật", career: "Sáng tạo", love: "Lãng mạn", health: "Nhạy cảm", finance: "Biến động" },
    4: { type: "Ổn định", trait: "Thực tế", career: "Kỹ thuật", love: "Trung thành", health: "Bền bỉ", finance: "Vững chắc" },
    5: { type: "Biến động", trait: "Linh hoạt", career: "Du lịch", love: "Tự do", health: "Thay đổi", finance: "Mạo hiểm" },
    6: { type: "Hài hòa", trait: "Yêu thương", career: "Gia đình", love: "Hạnh phúc", health: "Tốt", finance: "Thịnh vượng" },
    7: { type: "Tâm linh", trait: "Trí tuệ", career: "Nghiên cứu", love: "Sâu sắc", health: "Nội tâm", finance: "Bí ẩn" },
    8: { type: "Quyền lực", trait: "Thành công", career: "Quản lý", love: "Mạnh mẽ", health: "Dồi dào", finance: "Giàu có" },
    9: { type: "Hoàn thiện", trait: "Nhân ái", career: "Từ thiện", love: "Vị tha", health: "Viên mãn", finance: "Đủ đầy" }
  };
  
  const aspect = aspects[decade];
  
  return {
    ...baseAnalysis,
    name: `${baseAnalysis.name} - ${aspect.type}`,
    number: num.toString().padStart(2, '0'),
    star,
    aspect: {
      type: aspect.type,
      personality: aspect.trait,
      career: aspect.career,
      love: aspect.love,
      health: aspect.health,
      finance: aspect.finance
    }
  };
}

// Tính số may mắn theo ngày (00-99)
function calculateLuckyNumber(day, month, year, name) {
  const nameValue = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const dateValue = day + month + year;
  const total = (dateValue + nameValue) % 100;
  return total;
}

// Tạo tên ngẫu nhiên
function generateBabyName(fatherName, motherName) {
  const lastNameFather = fatherName.trim().split(' ')[0];
  const lastNameMother = motherName.trim().split(' ')[0];
  
  const middleNames = ['Minh', 'Hoàng', 'Văn', 'Thị', 'Hồng', 'Thanh', 'Quốc', 'Bảo', 'Ngọc', 'Anh'];
  const firstNames = ['An', 'Bình', 'Châu', 'Duy', 'Hà', 'Khang', 'Linh', 'Nam', 'Phúc', 'Quân', 'Tâm', 'Vy'];
  
  const lastName = Math.random() > 0.5 ? lastNameFather : lastNameMother;
  const middleName = middleNames[Math.floor(Math.random() * middleNames.length)];
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  
  return `${lastName} ${middleName} ${firstName}`;
}

// API: Tính số may mắn
app.post('/api/lucky-number', async (req, res) => {
  const { day, month, year, name, count = 1 } = req.body;
  
  if (!day || !month || !year || !name) {
    return res.status(400).json({ error: 'Thiếu thông tin' });
  }
  
  // Lưu thống kê
  const stats = await getStats();
  stats.luckyNumberRequests++;
  stats.history = stats.history || [];
  stats.history.push({
    type: 'lucky-number',
    name,
    date: `${day}/${month}/${year}`,
    count,
    timestamp: new Date().toISOString()
  });
  if (stats.history.length > 100) stats.history = stats.history.slice(-100);
  await saveStats(stats);
  
  const baseNumber = calculateLuckyNumber(parseInt(day), parseInt(month), parseInt(year), name);
  const numbers = [];
  
  for (let i = 0; i < count; i++) {
    const num = (baseNumber + i * 11) % 100;
    numbers.push({
      value: num,
      analysis: getTuViAnalysis(num)
    });
  }
  
  res.json({
    luckyNumber: baseNumber,
    numbers,
    date: `${day}/${month}/${year}`,
    name
  });
});

// API: Tạo tên con
app.post('/api/baby-name', async (req, res) => {
  const { fatherName, motherName } = req.body;
  
  if (!fatherName || !motherName) {
    return res.status(400).json({ error: 'Thiếu thông tin bố mẹ' });
  }
  
  // Lưu thống kê
  const stats = await getStats();
  stats.babyNameRequests++;
  stats.history = stats.history || [];
  stats.history.push({
    type: 'baby-name',
    fatherName,
    motherName,
    timestamp: new Date().toISOString()
  });
  if (stats.history.length > 100) stats.history = stats.history.slice(-100);
  await saveStats(stats);
  
  const suggestions = [];
  for (let i = 0; i < 5; i++) {
    suggestions.push(generateBabyName(fatherName, motherName));
  }
  
  res.json({ suggestions });
});

// API: Lấy config
app.get('/api/config', (req, res) => {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  res.json(config);
});

// API: Cập nhật config (admin)
app.post('/api/config', (req, res) => {
  fs.writeFileSync(configPath, JSON.stringify(req.body, null, 2));
  res.json({ success: true });
});

// API: Lấy thống kê (admin only)
app.get('/admin/stats', async (req, res) => {
  const stats = await getStats();
  res.json(stats);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

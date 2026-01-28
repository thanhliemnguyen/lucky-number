require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { connectDB, getStats, saveStats } = require('./db');
const { enhanceAnalysis, suggestBabyNames, explainLuckyNumber, generateLuckyNumbers } = require('./gemini');
const { groqGenerateLuckyNumbers, groqSuggestBabyNames, groqEnhanceAnalysis, groqExplainLuckyNumber } = require('./groq');

const app = express();

// Enhanced CORS and logging for production
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use('/images', express.static(path.join(__dirname, '../frontend/images')));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err.stack);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

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

// Tính số may mắn theo ngày (00-99) - Enhanced with more randomness
function calculateLuckyNumber(day, month, year, name) {
  const nameValue = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const dateValue = day + month + year;
  const timeValue = new Date().getHours() + new Date().getMinutes(); // Add current time
  const total = (dateValue + nameValue + timeValue) % 100;
  return total;
}

// Tính năng lượng ngày hôm nay
function getTodayEnergy() {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const sum = day + month + year;
  const energy = (sum % 9) || 9;
  
  const energyMap = {
    1: "Khởi đầu, lãnh đạo",
    2: "Hợp tác, cân bằng",
    3: "Sáng tạo, giao tiếp",
    4: "Ổn định, xây dựng",
    5: "Biến động, tự do",
    6: "Yêu thương, gia đình",
    7: "Tâm linh, trí tuệ",
    8: "Quyền lực, tài chính",
    9: "Hoàn thiện, nhân đạo"
  };
  
  return { number: energy, meaning: energyMap[energy] };
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
  try {
    console.log('Lucky number request received:', req.body);
    const { day, month, year, name, count = 1, description = '' } = req.body;
    
    if (!day || !month || !year || !name) {
      console.log('Missing required fields');
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
  
  const todayEnergy = getTodayEnergy();
  
  // Gọi AI để tạo số may mắn - thử Groq trước, sau đó Gemini
  let aiResult = await groqGenerateLuckyNumbers(name, `${day}/${month}/${year}`, count, description);
  if (!aiResult) {
    aiResult = await generateLuckyNumbers(name, `${day}/${month}/${year}`, count, todayEnergy);
  }
  
  if (aiResult && aiResult.numbers) {
    // AI thành công
    const numbers = [];
    
    for (let i = 0; i < aiResult.numbers.length; i++) {
      const aiNumber = aiResult.numbers[i];
      const basicAnalysis = getTuViAnalysis(aiNumber.value);
      
      // Chỉ dùng Groq, không fallback Gemini
      const enhanced = await groqEnhanceAnalysis(aiNumber.value, basicAnalysis) || basicAnalysis;
      
      // Giải thích số may mắn (chỉ cho số đầu tiên)
      let explanation = null;
      if (i === 0) {
        explanation = await groqExplainLuckyNumber(
          aiNumber.value, 
          name, 
          `${day}/${month}/${year}`,
          `${todayEnergy.number} - ${todayEnergy.meaning}`,
          aiNumber.reason
        );
        
        // Nếu Groq lỗi, tạo giải thích đơn giản
        if (!explanation) {
          explanation = {
            explanation: `Số ${aiNumber.value} là số may mắn của bạn hôm nay dựa trên tên và ngày sinh. ${aiNumber.reason || 'Số này mang lại may mắn và thịnh vượng.'}`,
            energy: "Tài lộc và thành công",
            advice: "Hãy sử dụng số này trong các quyết định quan trọng hôm nay",
            bestTime: "Buổi sáng hoặc chiều"
          };
        }
      }
      
      numbers.push({
        value: aiNumber.value,
        analysis: enhanced,
        explanation: explanation,
        aiReason: aiNumber.reason
      });
    }
    
    res.json({
      numbers,
      date: `${day}/${month}/${year}`,
      name,
      todayEnergy,
      aiPowered: true
    });
  } else {
    // Fallback: dùng cách cũ
    const baseNumber = calculateLuckyNumber(parseInt(day), parseInt(month), parseInt(year), name);
    const numbers = [];
    
    for (let i = 0; i < count; i++) {
      const num = (baseNumber + i * 11) % 100;
      const basicAnalysis = getTuViAnalysis(num);
      const enhanced = await enhanceAnalysis(num, basicAnalysis);
      
      numbers.push({
        value: num,
        analysis: enhanced
      });
    }
    
    res.json({
      numbers,
      date: `${day}/${month}/${year}`,
      name,
      todayEnergy,
      aiPowered: false
    });
  }
  } catch (error) {
    console.error('Lucky number API error:', error);
    res.status(500).json({ 
      error: 'Lỗi xử lý yêu cầu', 
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// API: Tạo tên con
app.post('/api/baby-name', async (req, res) => {
  try {
    console.log('Baby name request received:', req.body);
    const { fatherName, motherName, description = '' } = req.body;
    
    if (!fatherName || !motherName) {
      console.log('Missing father or mother name');
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
  
  // Chỉ dùng Groq
  let aiSuggestions = await groqSuggestBabyNames(fatherName, motherName, description);
  
  if (aiSuggestions && aiSuggestions.length > 0) {
    // AI thành công
    res.json({ suggestions: aiSuggestions, aiPowered: true });
  } else {
    // Fallback: tạo tên ngẫu nhiên
    const suggestions = [];
    for (let i = 0; i < 5; i++) {
      suggestions.push(generateBabyName(fatherName, motherName));
    }
    res.json({ suggestions, aiPowered: false });
  }
  } catch (error) {
    console.error('Baby name API error:', error);
    res.status(500).json({ 
      error: 'Lỗi xử lý yêu cầu', 
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
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
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100;
  const stats = await getStats(page, limit);
  res.json(stats);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

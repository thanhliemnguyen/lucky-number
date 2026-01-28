const { GoogleGenerativeAI } = require('@google/generative-ai');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
let genAI = null;

if (GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    console.log('✅ Gemini AI enabled');
} else {
    console.log('⚠️  Gemini AI disabled - using basic analysis');
}

async function enhanceAnalysis(number, basicAnalysis) {
    if (!genAI) return basicAnalysis;

    try {
        console.log(`🤖 Number ${number}: Calling Gemini AI...`);

        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction: "Bạn là chuyên gia Tử Vi Số Học chuyên nghiệp với 20 năm kinh nghiệm. Hãy phân tích sâu sắc và cá nhân hóa dựa trên dữ liệu đầu vào. Trả về kết quả bằng tiếng Việt, phong cách thân thiện, chuyên sâu.",
        });

        const generationConfig = {
            temperature: 1.2, // Tăng độ sáng tạo
            topP: 0.9,
            topK: 40,
            maxOutputTokens: 8192,
            responseMimeType: "application/json",
        };

        const prompt = `Phân tích chi tiết số ${number} (${basicAnalysis.name}) dựa trên các thông tin cơ bản sau:
    - Tính cách: ${basicAnalysis.aspect.personality}
    - Sự nghiệp: ${basicAnalysis.aspect.career}
    - Tình yêu: ${basicAnalysis.aspect.love}
    - Sức khỏe: ${basicAnalysis.aspect.health}
    - Tài chính: ${basicAnalysis.aspect.finance}

    Yêu cầu: 
    - Viết sâu sắc hơn, mỗi mục khoảng 3-4 câu
    - Đưa ra lời khuyên cụ thể, thực tế
    - Sử dụng ngôn ngữ thân thiện, dễ hiểu
    - Tạo sự khác biệt cho mỗi số, không lặp lại
    
    Phải trả về theo cấu trúc JSON:
    {
      "personality": "nội dung",
      "career": "nội dung",
      "love": "nội dung",
      "health": "nội dung",
      "finance": "nội dung"
    }`;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig,
        });

        const response = await result.response;
        const text = response.text();

        const enhanced = JSON.parse(text);

        console.log(`✅ Number ${number}: AI analysis completed`);
        return {
            ...basicAnalysis,
            aspect: enhanced
        };

    } catch (error) {
        console.error(`❌ Number ${number}: Gemini API error - ${error.message}`);
        return basicAnalysis; // Fallback
    }
}

async function suggestBabyNames(fatherName, motherName) {
  if (!genAI) {
    return null;
  }

  try {
    console.log(`👶 Calling Gemini AI for baby names...`);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: "Bạn là chuyên gia đặt tên theo phong thủy và tử vi số học Việt Nam với 25 năm kinh nghiệm. Bạn hiểu rõ văn hóa, truyền thống và ý nghĩa của từng tên.",
    });

    const generationConfig = {
      temperature: 1.3, // Tăng độ sáng tảo cho tên đa dạng
      topP: 0.9,
      maxOutputTokens: 3000,
      responseMimeType: "application/json",
    };

    const currentYear = new Date().getFullYear();
    const currentSeason = Math.floor((new Date().getMonth() + 1) / 3) + 1; // 1-4
    const seasonNames = ['Xuân', 'Hạ', 'Thu', 'Đông'];
    
    const prompt = `Gợi ý 8 tên hay cho con dựa trên:
- Tên bố: ${fatherName}
- Tên mẹ: ${motherName}
- Năm sinh dự kiến: ${currentYear}
- Mùa hiện tại: ${seasonNames[currentSeason - 1]}

Yêu cầu:
- Lấy họ của bố hoặc mẹ (nhưng ưu tiên họ bố)
- Tên đẹp, ý nghĩa tốt, dễ đọc, dễ viết
- Phù hợp văn hóa Việt Nam hiện đại
- Cân bằng âm dương ngũ hành
- Không dùng tên quá cổ điển hoặc quá lạ
- Đa dạng giới tính (4 tên nam, 4 tên nữ)
- Mỗi tên có điểm số từ 85-98/100

Trả về JSON:
{
  "suggestions": [
    {
      "name": "Tên gợi ý", 
      "meaning": "Ý nghĩa sâu sắc", 
      "element": "Ngũ hành tương ứng", 
      "score": "XX/100",
      "gender": "Nam/Nữ",
      "reason": "Lý do chọn tên này"
    }
  ]
}`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });

    const response = await result.response;
    const text = response.text();
    const data = JSON.parse(text);

    console.log(`✅ AI baby names completed: ${data.suggestions.length} names`);
    return data.suggestions;

  } catch (error) {
    console.error(`❌ Gemini AI baby names error: ${error.message}`);
    return null;
  }
}

async function explainLuckyNumber(number, userName, birthDate, todayEnergy, aiReason = null) {
  if (!genAI) return null;

  try {
    console.log(`🔮 Explaining lucky number ${number}...`);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: "Bạn là chuyên gia thần số học và phong thủy với khả năng giải thích sự tương tác năng lượng giữa số và con người một cách sâu sắc và thực tế.",
    });

    const generationConfig = {
      temperature: 1.1,
      maxOutputTokens: 800,
      responseMimeType: "application/json",
    };

    const currentTime = new Date();
    const timeOfDay = currentTime.getHours() < 12 ? 'Sáng' : currentTime.getHours() < 18 ? 'Chiều' : 'Tối';
    const dayOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'][currentTime.getDay()];

    const prompt = `Người dùng: ${userName}
Ngày sinh: ${birthDate}
Số may mắn: ${number}
Năng lượng ngày hôm nay: ${todayEnergy}
Thời gian hiện tại: ${timeOfDay} ${dayOfWeek}
${aiReason ? `Lý do AI chọn: ${aiReason}` : ''}

Giải thích tại sao số ${number} là số may mắn của ${userName} hôm nay dựa trên:
- Sự tương tác giữa số chủ đạo và năng lượng ngày
- Ý nghĩa phong thủy của số trong bối cảnh hiện tại
- Cách sử dụng số này hiệu quả nhất
${aiReason ? '- Kết hợp với lý do AI đã phân tích' : ''}

Yêu cầu:
- Giải thích cá nhân hóa, kết nối với tên và ngày sinh
- Lời khuyên thực tế, cụ thể cho ngày hôm nay
- Ngôn ngữ thân thiện, dễ hiểu

Trả về JSON:
{
  "explanation": "Giải thích chi tiết 3-4 câu",
  "energy": "Loại năng lượng chính (Ví dụ: Tài lộc, Tình yêu, Sức khỏe, Sáng tạo)",
  "advice": "Lời khuyên cụ thể cho ngày hôm nay",
  "bestTime": "Khoảng thời gian tốt nhất trong ngày"
}`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });

    const response = await result.response;
    const text = response.text();
    
    try {
      const data = JSON.parse(text);
      console.log(`✅ Lucky number explanation completed`);
      return data;
    } catch (parseError) {
      console.error(`❌ JSON parse error: ${parseError.message}`);
      console.log('Raw response:', text);
      return null;
    }

  } catch (error) {
    console.error(`❌ Gemini explanation error: ${error.message}`);
    return null;
  }
}

async function generateLuckyNumbers(userName, birthDate, count, todayEnergy) {
  if (!genAI) return null;

  try {
    console.log(`🎲 Generating ${count} lucky numbers for ${userName}...`);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: "Bạn là chuyên gia thần số học và tử vi số học với khả năng đọc vận số qua tên và ngày sinh.",
    });

    const generationConfig = {
      temperature: 1.3,
      topP: 0.9,
      maxOutputTokens: 2000,
      responseMimeType: "application/json",
    };

    const currentTime = new Date();
    const timeOfDay = currentTime.getHours() < 12 ? 'Sáng' : currentTime.getHours() < 18 ? 'Chiều' : 'Tối';
    const dayOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'][currentTime.getDay()];

    const prompt = `Phân tích và đưa ra ${count} số may mắn (từ 00-99) cho:
- Tên: ${userName}
- Ngày sinh: ${birthDate}
- Năng lượng hôm nay: ${todayEnergy.number} - ${todayEnergy.meaning}
- Thời gian: ${timeOfDay} ${dayOfWeek}

Yêu cầu:
- Phân tích tên và ngày sinh để tìm số phù hợp
- Kết hợp với năng lượng ngày hôm nay
- Mỗi số phải có lý do rõ ràng tại sao may mắn
- Số khác nhau, không trùng lặp
- Ưu tiên số có ý nghĩa tốt trong phong thủy

Trả về JSON:
{
  "numbers": [
    {
      "value": 88,
      "reason": "Lý do tại sao số này may mắn cho người này hôm nay"
    }
  ]
}`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });

    const response = await result.response;
    const text = response.text();
    const data = JSON.parse(text);

    console.log(`✅ Generated ${data.numbers.length} lucky numbers`);
    return data;

  } catch (error) {
    console.error(`❌ Generate lucky numbers error: ${error.message}`);
    return null;
  }
}

module.exports = { enhanceAnalysis, suggestBabyNames, explainLuckyNumber, generateLuckyNumbers };
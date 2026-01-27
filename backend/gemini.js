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

        // 1. Sử dụng model 'gemini-1.5-flash' (Tốt nhất cho bản Free: Nhanh, nhẹ, ổn định)
        // Hoặc dùng 'gemini-2.0-flash-exp' nếu bạn muốn thử nghiệm bản mới nhất
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            // Thiết lập System Instruction để AI hiểu vai trò ngay từ đầu
            systemInstruction: "Bạn là chuyên gia Tử Vi Số Học chuyên nghiệp. Hãy phân tích các khía cạnh dựa trên dữ liệu đầu vào. Trả về kết quả bằng tiếng Việt, phong cách thân thiện.",
        });

        // 2. Cấu hình JSON Mode để đảm bảo đầu ra luôn là JSON
        const generationConfig = {
            temperature: 1,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
            responseMimeType: "application/json", // Ép AI trả về JSON chuẩn
        };

        const prompt = `Phân tích chi tiết số ${number} (${basicAnalysis.name}) dựa trên các thông tin cơ bản sau:
    - Tính cách: ${basicAnalysis.aspect.personality}
    - Sự nghiệp: ${basicAnalysis.aspect.career}
    - Tình yêu: ${basicAnalysis.aspect.love}
    - Sức khỏe: ${basicAnalysis.aspect.health}
    - Tài chính: ${basicAnalysis.aspect.finance}

    Yêu cầu: Viết sâu sắc hơn, mỗi mục khoảng 2-3 câu. 
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

        // 3. Vì đã dùng responseMimeType nên text chắc chắn là JSON string
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
    // Fallback: tạo tên ngẫu nhiên cơ bản
    return null;
  }

  try {
    console.log(`👶 Calling Gemini AI for baby names...`);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: "Bạn là chuyên gia đặt tên theo phong thủy và tử vi số học Việt Nam.",
    });

    const generationConfig = {
      temperature: 1.2,
      topP: 0.95,
      maxOutputTokens: 2048,
      responseMimeType: "application/json",
    };

    const prompt = `Gợi ý 8 tên hay cho con dựa trên:
- Tên bố: ${fatherName}
- Tên mẹ: ${motherName}

Yêu cầu:
- Lấy họ của bố hoặc mẹ
- Tên đẹp, ý nghĩa tốt, dễ đọc
- Phù hợp văn hóa Việt
- Cân bằng âm dương ngũ hành

Trả về JSON:
{
  "suggestions": [
    {"name": "Tên gợi ý", "meaning": "Ý nghĩa", "element": "Ngũ hành", "score": "90/100"}
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

async function explainLuckyNumber(number, userName, birthDate, todayEnergy) {
  if (!genAI) return null;

  try {
    console.log(`🔮 Explaining lucky number ${number}...`);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: "Bạn là chuyên gia thần số học, giải thích sự tương tác năng lượng giữa số và con người.",
    });

    const generationConfig = {
      temperature: 1.1,
      maxOutputTokens: 500,
      responseMimeType: "application/json",
    };

    const prompt = `Người dùng: ${userName}
Ngày sinh: ${birthDate}
Số may mắn: ${number}
Năng lượng ngày hôm nay: ${todayEnergy}

Giải thích ngắn gọn (2-3 câu) tại sao số ${number} là số may mắn của họ hôm nay dựa trên:
- Sự tương tác giữa số chủ đạo và năng lượng ngày
- Ý nghĩa phong thủy của số
- Lời khuyên ngắn về cách sử dụng số này

Trả về JSON:
{
  "explanation": "Giải thích",
  "energy": "Loại năng lượng (Ví dụ: Tài lộc, Tình yêu, Sức khỏe)",
  "advice": "Lời khuyên"
}`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });

    const response = await result.response;
    const text = response.text();
    const data = JSON.parse(text);

    console.log(`✅ Lucky number explanation completed`);
    return data;

  } catch (error) {
    console.error(`❌ Gemini explanation error: ${error.message}`);
    return null;
  }
}

module.exports = { enhanceAnalysis, suggestBabyNames, explainLuckyNumber };
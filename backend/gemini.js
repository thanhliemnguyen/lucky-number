const { GoogleGenerativeAI } = require('@google/generative-ai');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
let genAI = null;
let requestCount = 0;
const MAX_REQUESTS_PER_DAY = 15;

if (GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    console.log('✅ Gemini AI enabled (Limited to 15 requests/day)');
} else {
    console.log('⚠️  Gemini AI disabled - using basic analysis');
}

function canUseAI() {
    return genAI && requestCount < MAX_REQUESTS_PER_DAY;
}

async function enhanceAnalysis(number, basicAnalysis) {
    if (!canUseAI()) return basicAnalysis;

    try {
        requestCount++;
        console.log(`🤖 Number ${number}: AI request ${requestCount}/${MAX_REQUESTS_PER_DAY}`);

        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            systemInstruction: "Bạn là chuyên gia Tử Vi Số Học. Trả về JSON hợp lệ.",
        });

        const generationConfig = {
            temperature: 0.8,
            topP: 0.8,
            maxOutputTokens: 1000,
            responseMimeType: "application/json",
        };

        const prompt = `Phân tích số ${number}. Trả về JSON:
{
  "personality": "Tính cách",
  "career": "Sự nghiệp", 
  "love": "Tình yêu",
  "health": "Sức khỏe",
  "finance": "Tài chính"
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
        console.error(`❌ Number ${number}: AI error - ${error.message}`);
        return basicAnalysis;
    }
}

async function generateLuckyNumbers(userName, birthDate, count, todayEnergy) {
  if (!canUseAI()) {
    const numbers = [];
    const goodNumbers = [8, 18, 28, 38, 48, 58, 68, 78, 88, 98, 6, 16, 26, 36, 46, 56, 66, 76, 86, 96];
    for (let i = 0; i < count; i++) {
      const value = goodNumbers[Math.floor(Math.random() * goodNumbers.length)];
      numbers.push({ value, reason: "Số may mắn theo phong thủy" });
    }
    return { numbers };
  }

  try {
    requestCount++;
    console.log(`🎲 AI request ${requestCount}/${MAX_REQUESTS_PER_DAY} for ${userName}`);
    
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: "Tạo số may mắn. Trả về JSON hợp lệ.",
    });

    const prompt = `Tạo ${count} số may mắn cho ${userName}.
Trả về:
{"numbers":[{"value":88,"reason":"Lý do"}]}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const data = JSON.parse(text);
    
    console.log(`✅ Generated ${data.numbers.length} numbers`);
    return data;

  } catch (error) {
    console.error(`❌ AI error: ${error.message}`);
    const numbers = [];
    const goodNumbers = [8, 18, 28, 38, 48, 58, 68, 78, 88, 98];
    for (let i = 0; i < count; i++) {
      const value = goodNumbers[Math.floor(Math.random() * goodNumbers.length)];
      numbers.push({ value, reason: "Số may mắn theo phong thủy" });
    }
    return { numbers };
  }
}

async function suggestBabyNames(fatherName, motherName) {
  if (!canUseAI()) {
    const lastNames = [fatherName.split(' ')[0], motherName.split(' ')[0]];
    const midNames = ['Minh', 'Hồng', 'Thanh', 'Bảo', 'Ngọc'];
    const firstNames = ['An', 'Bình', 'Châu', 'Duy', 'Hà', 'Khang', 'Linh', 'Phúc'];
    
    const suggestions = [];
    for (let i = 0; i < 6; i++) {
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const midName = midNames[Math.floor(Math.random() * midNames.length)];
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      suggestions.push({
        name: `${lastName} ${midName} ${firstName}`,
        meaning: "Tên đẹp, ý nghĩa tốt",
        element: "Cân bằng ngũ hành",
        score: "90/100"
      });
    }
    return suggestions;
  }

  try {
    requestCount++;
    console.log(`👶 AI request ${requestCount}/${MAX_REQUESTS_PER_DAY} for baby names`);
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Gợi ý 6 tên cho con. Bố: ${fatherName}, Mẹ: ${motherName}.
Trả về JSON: {"suggestions":[{"name":"Tên","meaning":"Ý nghĩa","element":"Ngũ hành","score":"90/100"}]}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const data = JSON.parse(text);
    
    return data.suggestions;

  } catch (error) {
    console.error(`❌ AI baby names error: ${error.message}`);
    return null;
  }
}

async function explainLuckyNumber(number, userName, birthDate, todayEnergy, aiReason = null) {
  if (!canUseAI()) return null;

  try {
    requestCount++;
    console.log(`🔮 Gemini explaining number ${number} (${requestCount}/${MAX_REQUESTS_PER_DAY})...`);
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Giải thích số ${number} cho ${userName}. Trả về JSON: {"explanation":"Giải thích","energy":"Năng lượng","advice":"Lời khuyên","bestTime":"Thời gian tốt"}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*?\}/);
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0]);
      return data;
    }
    return null;

  } catch (error) {
    console.error(`❌ Gemini explanation error: ${error.message}`);
    return null;
  }
}

module.exports = { enhanceAnalysis, suggestBabyNames, explainLuckyNumber, generateLuckyNumbers };
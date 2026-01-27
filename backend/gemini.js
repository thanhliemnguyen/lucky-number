const { GoogleGenerativeAI } = require('@google/generative-ai');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
let genAI = null;

if (GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
}

async function enhanceAnalysis(number, basicAnalysis) {
  if (!genAI) {
    return basicAnalysis; // Fallback nếu không có API key
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Bạn là chuyên gia Tử Vi Số Học. Phân tích chi tiết số ${number} (${basicAnalysis.name}) với các khía cạnh:
- Tính cách: ${basicAnalysis.aspect.personality}
- Sự nghiệp: ${basicAnalysis.aspect.career}
- Tình yêu: ${basicAnalysis.aspect.love}
- Sức khỏe: ${basicAnalysis.aspect.health}
- Tài chính: ${basicAnalysis.aspect.finance}

Viết phân tích ngắn gọn (2-3 câu mỗi mục), phong cách thân thiện, dễ hiểu. Chỉ trả về JSON với format:
{
  "personality": "...",
  "career": "...",
  "love": "...",
  "health": "...",
  "finance": "..."
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse JSON từ response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const enhanced = JSON.parse(jsonMatch[0]);
      return {
        ...basicAnalysis,
        aspect: enhanced
      };
    }
  } catch (error) {
    console.log('Gemini API error:', error.message);
  }

  return basicAnalysis; // Fallback
}

module.exports = { enhanceAnalysis };

const Groq = require('groq-sdk');

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
let groq = null;

if (GROQ_API_KEY) {
    groq = new Groq({ apiKey: GROQ_API_KEY });
    console.log('✅ Groq AI enabled (14,400 requests/day)');
} else {
    console.log('⚠️  Groq AI disabled - add GROQ_API_KEY to .env');
}

async function groqGenerateLuckyNumbers(userName, birthDate, count, description = '') {
    if (!groq) return null;

    try {
        console.log(`🚀 Groq generating ${count} lucky numbers for ${userName}...`);
        
        const prompt = description 
            ? `Create ${count} lucky numbers (0-99) for ${userName} born ${birthDate}. Purpose: ${description}. Return ONLY valid JSON: {"numbers":[{"value":88,"reason":"Lucky for business"}]}`
            : `Create ${count} lucky numbers (0-99) for ${userName}. Return ONLY valid JSON: {"numbers":[{"value":88,"reason":"Lucky number"}]}`;
        
        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.1-8b-instant",
            temperature: 0.3,
            max_tokens: 300,
        });

        let text = completion.choices[0]?.message?.content?.trim();
        if (!text) return null;

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const data = JSON.parse(jsonMatch[0]);
            console.log(`✅ Groq generated ${data.numbers.length} numbers`);
            return data;
        }
        return null;

    } catch (error) {
        console.error(`❌ Groq error: ${error.message}`);
        return null;
    }
}

async function groqSuggestBabyNames(fatherName, motherName, description = '') {
    if (!groq) return null;

    try {
        console.log(`👶 Groq generating baby names...`);
        
        const prompt = description
            ? `Gợi ý 6 tên hay cho con. Bố: ${fatherName}, Mẹ: ${motherName}. Yêu cầu: ${description}. Trả về JSON: {"suggestions":[{"name":"Tên","meaning":"Ý nghĩa","element":"Ngũ hành","score":"90/100"}]}`
            : `Gợi ý 6 tên hay cho con. Bố: ${fatherName}, Mẹ: ${motherName}. Trả về JSON: {"suggestions":[{"name":"Tên","meaning":"Ý nghĩa","element":"Ngũ hành","score":"90/100"}]}`;
        
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "Bạn là chuyên gia đặt tên theo phong thủy Việt Nam." },
                { role: "user", content: prompt }
            ],
            model: "llama-3.1-8b-instant",
            temperature: 1.0,
            max_tokens: 800,
        });

        const text = completion.choices[0]?.message?.content;
        if (!text) return null;

        const data = JSON.parse(text);
        return data.suggestions;

    } catch (error) {
        console.error(`❌ Groq baby names error: ${error.message}`);
        return null;
    }
}

async function groqEnhanceAnalysis(number, basicAnalysis) {
    if (!groq) return null;

    try {
        console.log(`🚀 Groq analyzing number ${number}...`);
        
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user", 
                    content: `Phân tích số ${number} bằng tiếng Việt. Trả về CHỈ JSON: {"personality":"Tính cách tiếng Việt","career":"Sự nghiệp tiếng Việt","love":"Tình yêu tiếng Việt","health":"Sức khỏe tiếng Việt","finance":"Tài chính tiếng Việt"}`
                }
            ],
            model: "llama-3.1-8b-instant",
            temperature: 0.3,
            max_tokens: 200,
        });

        let text = completion.choices[0]?.message?.content?.trim();
        if (!text) return null;

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                const enhanced = JSON.parse(jsonMatch[0]);
                console.log(`✅ Groq analysis completed for ${number}`);
                return {
                    ...basicAnalysis,
                    aspect: enhanced
                };
            } catch (parseError) {
                console.error(`❌ JSON parse error: ${parseError.message}`);
                console.log('Raw text:', text.substring(0, 100));
                return null;
            }
        }
        return null;

    } catch (error) {
        console.error(`❌ Groq analysis error: ${error.message}`);
        return null;
    }
}

async function groqExplainLuckyNumber(number, userName, birthDate, todayEnergy, aiReason = null) {
    if (!groq) return null;

    try {
        console.log(`🔮 Groq explaining lucky number ${number}...`);
        
        const prompt = `Giải thích tại sao số ${number} may mắn cho ${userName} hôm nay. TRẢ LỜI BẰNG TIẾ6NG VIỆT.
Chỉ trả về JSON này:
{"explanation":"Giải thích ngắn bằng tiếng Việt","energy":"Loại năng lượng","advice":"Lời khuyên","bestTime":"Thời gian tốt"}`;
        
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "Bạn phải trả lời bằng tiếng Việt. Không được dùng tiếng Anh." },
                { role: "user", content: prompt }
            ],
            model: "llama-3.1-8b-instant",
            temperature: 0.3,
            max_tokens: 200,
        });

        let text = completion.choices[0]?.message?.content?.trim();
        if (!text) return null;

        // Find JSON in response
        const jsonMatch = text.match(/\{[^{}]*\}/);
        if (jsonMatch) {
            try {
                const data = JSON.parse(jsonMatch[0]);
                console.log(`✅ Groq explanation completed`);
                return {
                    explanation: data.explanation || `Số ${number} mang lại may mắn cho bạn`,
                    energy: data.energy || "Tài lộc",
                    advice: data.advice || "Sử dụng số này hôm nay",
                    bestTime: data.bestTime || "Buổi sáng"
                };
            } catch (parseError) {
                console.error(`❌ JSON parse error: ${parseError.message}`);
                return null;
            }
        }
        return null;

    } catch (error) {
        console.error(`❌ Groq explanation error: ${error.message}`);
        return null;
    }
}

module.exports = { groqGenerateLuckyNumbers, groqSuggestBabyNames, groqEnhanceAnalysis, groqExplainLuckyNumber };
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = process.env.GEMINI_API_KEY;

console.log('🔍 Testing Gemini API Key...\n');

if (!API_KEY) {
  console.log('❌ GEMINI_API_KEY not found in .env file');
  process.exit(1);
}

console.log(`✅ API Key found: ${API_KEY.substring(0, 10)}...${API_KEY.substring(API_KEY.length - 4)}\n`);

async function testAPI() {
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    // List available models trước
    console.log('📋 Listing available models...');
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
      const data = await response.json();
      
      if (data.models) {
        console.log('✅ Available models:');
        data.models.forEach(m => {
          console.log(`  - ${m.name} (${m.displayName})`);
        });
        console.log('');
        
        // Test với model đầu tiên
        const firstModel = data.models[0].name.split('/')[1];
        console.log(`📡 Testing with ${firstModel}...`);
        const model = genAI.getGenerativeModel({ model: firstModel });
        
        const result = await model.generateContent('Hello, respond with just "OK"');
        const resp = await result.response;
        const text = resp.text();
        
        console.log('✅ API Key is VALID!');
        console.log(`📝 Response: ${text}\n`);
      } else {
        console.log('❌ No models found');
        console.log('Response:', data);
      }
    } catch (listError) {
      console.log('❌ Cannot list models:', listError.message);
    }
    
  } catch (error) {
    console.log('❌ API Key test FAILED!');
    console.log(`Error: ${error.message}\n`);
    
    if (error.message.includes('404')) {
      console.log('💡 Suggestion: Model not found. Try these steps:');
      console.log('   1. Get new API key from: https://aistudio.google.com/app/apikey');
      console.log('   2. Make sure you selected the correct project');
      console.log('   3. Enable Generative Language API in Google Cloud Console');
    } else if (error.message.includes('403')) {
      console.log('💡 Suggestion: API key not authorized');
      console.log('   1. Check if API key is correct');
      console.log('   2. Enable Generative Language API');
    }
  }
}

testAPI();

// Simple test script to find working model
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // List of possible model names to try
    const modelsToTry = [
        'gemini-1.5-flash',
        'gemini-1.5-pro', 
        'gemini-pro',
        'gemini-1.0-pro',
        'models/gemini-1.5-flash',
        'models/gemini-1.5-pro',
        'models/gemini-pro',
        'models/gemini-1.0-pro'
    ];
    
    console.log('🔍 Testing different model names...\n');
    
    for (const modelName of modelsToTry) {
        try {
            console.log(`Testing: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent('Say hello');
            const response = await result.response;
            const text = response.text();
            
            console.log(`✅ SUCCESS! Model "${modelName}" works!`);
            console.log(`Response: ${text}\n`);
            return modelName; // Return the working model name
            
        } catch (error) {
            console.log(`❌ Failed: ${error.message.split('\n')[0]}\n`);
        }
    }
    
    console.log('❌ No working models found. Please check your API key.');
}

testModels();
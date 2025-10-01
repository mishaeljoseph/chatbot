// Test API key and list models
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testAPIKey() {
    try {
        console.log('🔑 Testing API Key...');
        console.log('API Key:', process.env.GEMINI_API_KEY ? `${process.env.GEMINI_API_KEY.substring(0, 10)}...` : 'NOT FOUND');
        
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        console.log('\n📋 Attempting to list available models...');
        
        // Try to list models
        const models = await genAI.listModels();
        
        console.log('✅ API Key is valid! Available models:');
        console.log('=====================================');
        
        let count = 0;
        for await (const model of models) {
            count++;
            console.log(`${count}. Name: ${model.name}`);
            console.log(`   Display Name: ${model.displayName}`);
            console.log(`   Supported Methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
            console.log(`   ---`);
        }
        
        if (count === 0) {
            console.log('⚠️  No models returned. This might indicate API permissions issue.');
        }
        
    } catch (error) {
        console.error('❌ Error testing API key:', error.message);
        
        if (error.message.includes('API_KEY_INVALID')) {
            console.log('\n🔧 Your API key appears to be invalid.');
            console.log('📝 Please check:');
            console.log('   1. Go to https://makersuite.google.com/app/apikey');
            console.log('   2. Create a new API key');
            console.log('   3. Make sure it\'s copied correctly to your .env file');
        } else if (error.message.includes('403') || error.message.includes('PERMISSION_DENIED')) {
            console.log('\n🔧 Permission denied. Your API key might not have the right permissions.');
            console.log('📝 Please check:');
            console.log('   1. The API key is from Google AI Studio (not Google Cloud)');
            console.log('   2. The Generative Language API is enabled');
        } else {
            console.log('\n🔧 Unexpected error. Full details:');
            console.log(error);
        }
    }
}

testAPIKey();
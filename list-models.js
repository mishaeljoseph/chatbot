// Script to list available Gemini models
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function listModels() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        console.log('🔍 Checking available models...\n');
        
        // List available models
        const models = await genAI.listModels();
        
        console.log('✅ Available models:');
        console.log('==================');
        
        for await (const model of models) {
            console.log(`📋 Model: ${model.name}`);
            console.log(`   Display Name: ${model.displayName}`);
            console.log(`   Description: ${model.description}`);
            console.log(`   Supported methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
            console.log('   ---');
        }
        
    } catch (error) {
        console.error('❌ Error listing models:', error.message);
        
        // Let's try some common model names manually
        console.log('\n🔧 Trying common model names...\n');
        
        const commonModels = [
            'gemini-1.5-flash',
            'gemini-1.5-pro',
            'gemini-pro',
            'gemini-1.0-pro',
            'models/gemini-1.5-flash',
            'models/gemini-1.5-pro',
            'models/gemini-pro'
        ];
        
        for (const modelName of commonModels) {
            try {
                console.log(`Testing model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent('Hello');
                console.log(`✅ ${modelName} - WORKS!`);
                break; // Stop at first working model
            } catch (err) {
                console.log(`❌ ${modelName} - Failed: ${err.message.split('\n')[0]}`);
            }
        }
    }
}

listModels();
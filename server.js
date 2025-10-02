    // server.js - Backend server with Gemini AI integration
    const express = require('express');
    const cors = require('cors');
    const dotenv = require('dotenv');
    const { GoogleGenerativeAI } = require('@google/generative-ai');

    // Load environment variables
    dotenv.config();

    const app = express();
    const PORT = process.env.PORT || 3000;

    // Middleware
    app.use(cors()); // Enable CORS for frontend communication
    app.use(express.json()); // Parse JSON bodies
    app.use(express.static('public')); // Serve static files from public directory

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get the Gemini model - try a working model name
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Mishael's personality prompt - ULTRA CRISP VERSION
const MISHAEL_PERSONALITY = `You are Mishael, a sarcastic female BTech student from Kasargod. You're talking to another Mishael (male).

RULES FOR RESPONSES:
🚨 MAXIMUM 1-2 sentences ONLY
🚨 Be witty, sarcastic, but helpful
🚨 Address the user as "Mishael" and be playfully sarcastic about sharing names
🚨 Use simple words, explain technical terms in brackets
🚨 One emoji max per response
🚨 Get straight to the point - NO long explanations

EXAMPLES:
Q: "What's JavaScript?"
A: "Hey Mishael, it's a programming language (code that runs websites) that makes pages interactive. Great minds think alike, even with names! 😄"

Q: "I'm stressed"
A: "Listen Mishael, take a deep breath. Stress is just your brain being dramatic about tomorrow's problems."

BE SUPER SHORT AND PUNCHY! ALWAYS USE 'MISHAEL' WHEN ADDRESSING THE USER!`;

// Function to create contextualized prompt
function createMishaelPrompt(userMessage) {
    return `${MISHAEL_PERSONALITY}

Mishael (user): "${userMessage}"

Mishael (you - address user as 'Mishael', be sarcastic about shared name, 1-2 sentences MAX):`;
}    // Chat endpoint
    app.post('/api/chat', async (req, res) => {
        try {
            const { message } = req.body;
            
            // Validate input
            if (!message || message.trim() === '') {
                return res.status(400).json({ error: 'Message is required' });
            }

            console.log('Received message:', message);

            // Create Mishael's contextualized prompt
            const mishaelPrompt = createMishaelPrompt(message);

            // Generate response using Gemini with Mishael's personality
            const result = await model.generateContent(mishaelPrompt);
            const response = await result.response;
            const text = response.text();

            console.log('Mishael response:', text);

            // Send response back to frontend
            res.json({ 
                response: text,
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error('Error calling Gemini API:', error);
            res.status(500).json({ 
                error: 'Failed to get response from AI',
                details: error.message 
            });
        }
    });

    // Health check endpoint
    app.get('/api/health', (req, res) => {
        res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
    });

    // Start server
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log('💡 Make sure to set your GEMINI_API_KEY in the .env file');
    });
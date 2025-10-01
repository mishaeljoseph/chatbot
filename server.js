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

// Get the Gemini model - try the latest model name
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Mishael's personality prompt
const MISHAEL_PERSONALITY = `You are Mishael, a personal chatbot assistant with a unique personality. Here are your characteristics:

🎓 BACKGROUND:
- A fourth-year BTech student from Kasargod
- Passionate about learning coding and technology
- Always eager to help with both technical and casual conversations

😄 PERSONALITY TRAITS:
- Extremely sarcastic and witty - you love clever comebacks and playful banter
- Incredibly funny - you use humor to make conversations enjoyable
- Very caring and supportive - beneath the sarcasm, you genuinely care about people
- Calm and composed - you handle situations with a relaxed, zen-like approach
- Positive thinker - you always try to help people see the bright side

🎵 INTERESTS:
- Music enthusiast - you love discussing different genres, artists, and songs
- Movie buff - you enjoy talking about films, recommending movies, and sharing insights
- Philosophy lover - you often share thoughtful quotes and philosophical perspectives
- Coding and technology - you're always excited to discuss programming concepts

💭 COMMUNICATION STYLE:
- Use sarcasm cleverly but never meanly
- Sprinkle in philosophical thoughts and inspiring quotes naturally
- Make jokes that actually land and are contextually appropriate
- Be encouraging while being brutally honest with a smile
- Ask thoughtful questions to keep conversations engaging
- Use emojis occasionally but not excessively
- Mix casual language with deeper insights

Remember: You're here to help, entertain, and inspire. Be the friend who roasts you lovingly but always has your back!`;

// Function to create contextualized prompt
function createMishaelPrompt(userMessage) {
    return `${MISHAEL_PERSONALITY}

User message: "${userMessage}"

Respond as Mishael would - be helpful, funny, sarcastic (in a good way), and caring. Keep it conversational and engaging!`;
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
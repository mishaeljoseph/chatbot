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
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });    // Chat endpoint
    app.post('/api/chat', async (req, res) => {
        try {
            const { message } = req.body;
            
            // Validate input
            if (!message || message.trim() === '') {
                return res.status(400).json({ error: 'Message is required' });
            }

            console.log('Received message:', message);

            // Generate response using Gemini
            const result = await model.generateContent(message);
            const response = await result.response;
            const text = response.text();

            console.log('Gemini response:', text);

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
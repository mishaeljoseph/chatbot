# Gemini Chatbot

A modern, responsive chatbot application with a beautiful frontend interface and Google's Gemini AI backend.

## Features

- 🤖 **AI-Powered**: Uses Google's Gemini AI for intelligent responses
- 💬 **Real-time Chat**: Instant messaging interface with typing indicators
- 🎨 **Modern UI**: Beautiful, responsive design with smooth animations
- 🚀 **Fast & Reliable**: Node.js backend with Express.js
- 📱 **Mobile Friendly**: Works perfectly on desktop and mobile devices

## Project Structure

```
chatbot-with-gemini/
├── public/                 # Frontend files (served statically)
│   ├── index.html         # Main HTML file with chat interface
│   ├── style.css          # CSS styling for the chatbot
│   └── script.js          # JavaScript for frontend functionality
├── server.js              # Node.js backend server
├── package.json           # Project dependencies and scripts
├── .env                   # Environment variables (API keys)
└── README.md             # This file
```

## How It Works

### Backend (server.js)
- **Express.js Server**: Handles HTTP requests and serves static files
- **Gemini Integration**: Uses Google's Generative AI SDK to communicate with Gemini
- **API Endpoint**: `/api/chat` receives messages and returns AI responses
- **Error Handling**: Proper error handling for API failures

### Frontend (public/)
- **HTML**: Structure of the chat interface with semantic elements
- **CSS**: Modern styling with gradients, animations, and responsive design
- **JavaScript**: Handles user interactions, API calls, and real-time updates

## Key Concepts Explained

### 1. API Integration
```javascript
// How we call Gemini API
const result = await model.generateContent(message);
const response = await result.response;
const text = response.text();
```

### 2. Frontend-Backend Communication
```javascript
// Frontend sends POST request to backend
const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
});
```

### 3. Real-time UI Updates
- Loading indicators while waiting for AI response
- Dynamic message rendering with timestamps
- Character counting and input validation

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Get Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key

### 3. Configure Environment
Edit the `.env` file and replace `your-gemini-api-key-here` with your actual API key:
```
GEMINI_API_KEY=your-actual-api-key-here
PORT=3000
```

### 4. Run the Application
```bash
# For development (auto-restart on changes)
npm run dev

# For production
npm start
```

### 5. Open in Browser
Navigate to `http://localhost:3000` in your web browser.

## Development Features

- **Nodemon**: Automatically restarts server when you make changes
- **CORS Enabled**: Allows frontend to communicate with backend
- **Environment Variables**: Secure API key storage
- **Error Handling**: Comprehensive error handling and user feedback

## Customization Ideas

1. **Add Message History**: Store conversation history in a database
2. **User Authentication**: Add login/signup functionality
3. **Multiple Models**: Allow users to choose different AI models
4. **File Upload**: Enable image/document sharing
5. **Themes**: Add dark/light mode toggle
6. **Voice Input**: Add speech-to-text functionality

## Troubleshooting

### Common Issues:

1. **"Cannot connect to server"**
   - Make sure the server is running (`npm start`)
   - Check if port 3000 is available

2. **"Failed to get response from AI"**
   - Verify your Gemini API key is correct
   - Check your internet connection
   - Ensure you have API quota remaining

3. **Messages not sending**
   - Check browser console for errors
   - Verify the frontend can reach the backend

## Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [Google AI Documentation](https://ai.google.dev/)
- [JavaScript Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [CSS Grid and Flexbox](https://css-tricks.com/snippets/css/complete-guide-flexbox/)

Enjoy building your chatbot! 🚀
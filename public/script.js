// script.js - Frontend JavaScript for chatbot functionality

class ChatBot {
    constructor() {
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.chatMessages = document.getElementById('chatMessages');
        this.loadingIndicator = document.getElementById('loadingIndicator');
        this.status = document.getElementById('status');
        this.charCount = document.getElementById('charCount');
        
        this.init();
    }

    init() {
        // Event listeners
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Character counter
        this.messageInput.addEventListener('input', () => {
            const length = this.messageInput.value.length;
            this.charCount.textContent = `${length}/1000`;
            
            if (length > 900) {
                this.charCount.style.color = '#ef4444';
            } else if (length > 800) {
                this.charCount.style.color = '#f59e0b';
            } else {
                this.charCount.style.color = '#6b7280';
            }
        });

        // Check server health on load
        this.checkServerHealth();
        
        console.log('ChatBot initialized successfully!');
    }

    async checkServerHealth() {
        try {
            const response = await fetch('/api/health');
            if (response.ok) {
                this.updateStatus('Ready to chat', 'online');
            } else {
                this.updateStatus('Server issues detected', 'error');
            }
        } catch (error) {
            console.error('Server health check failed:', error);
            this.updateStatus('Cannot connect to server', 'error');
        }
    }

    updateStatus(message, type = 'online') {
        this.status.textContent = message;
        this.status.className = `status ${type}`;
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        
        // Validate message
        if (!message) {
            this.showError('Please enter a message');
            return;
        }

        if (message.length > 1000) {
            this.showError('Message is too long (max 1000 characters)');
            return;
        }

        // Disable input while processing
        this.setInputState(false);
        this.updateStatus('Thinking...', 'processing');

        // Add user message to chat
        this.addMessage(message, 'user');
        
        // Clear input
        this.messageInput.value = '';
        this.charCount.textContent = '0/1000';
        this.charCount.style.color = '#6b7280';

        // Show loading indicator
        this.showLoading(true);

        try {
            // Send message to backend
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Server error: ${response.status}`);
            }

            const data = await response.json();
            
            // Add bot response to chat
            this.addMessage(data.response, 'bot');
            this.updateStatus('Ready to chat', 'online');

        } catch (error) {
            console.error('Error sending message:', error);
            this.addMessage(
                `Sorry, I encountered an error: ${error.message}. Please try again.`, 
                'bot', 
                true
            );
            this.updateStatus('Error occurred', 'error');
        } finally {
            // Re-enable input and hide loading
            this.setInputState(true);
            this.showLoading(false);
            this.messageInput.focus();
        }
    }

    addMessage(content, sender, isError = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = sender === 'user' ? '👤' : '🤖';
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content ${isError ? 'error-message' : ''}">
                <p>${this.formatMessage(content)}</p>
                <span class="message-time">${time}</span>
            </div>
        `;

        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    formatMessage(message) {
        // Basic text formatting - escape HTML and handle line breaks
        return message
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\n/g, '<br>');
    }

    setInputState(enabled) {
        this.messageInput.disabled = !enabled;
        this.sendButton.disabled = !enabled;
        
        if (enabled) {
            this.messageInput.focus();
        }
    }

    showLoading(show) {
        if (show) {
            this.loadingIndicator.classList.add('show');
        } else {
            this.loadingIndicator.classList.remove('show');
        }
        this.scrollToBottom();
    }

    showError(message) {
        // Create a temporary error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-toast';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(errorDiv);
        
        // Remove after 3 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    scrollToBottom() {
        // Smooth scroll to bottom with a small delay to ensure content is rendered
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }
}

// Initialize the chatbot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ChatBot();
});

// Add some additional CSS for error messages
const style = document.createElement('style');
style.textContent = `
    .error-message {
        background: #fee2e2 !important;
        border-left: 4px solid #ef4444;
        color: #dc2626 !important;
    }
    
    .status.online {
        color: #10b981;
    }
    
    .status.processing {
        color: #f59e0b;
    }
    
    .status.error {
        color: #ef4444;
    }
`;
document.head.appendChild(style);
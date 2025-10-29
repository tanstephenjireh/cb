// chatbot-widget.js

(function() {
  'use strict';

  // Configuration - Change this to your backend URL
  const API_BASE_URL = 'http://localhost:8000'; // Change to your production URL later
  
  // State management
  let isOpen = false;
  let messages = [];
  let isLoading = false;

  // Initialize the chatbot widget
  function initChatbot() {
    // Load CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'http://localhost:3000/embed/chatbot-widget.css'; // Change to your production URL later
    document.head.appendChild(link);

    // Create widget HTML
    const widgetHTML = `
      <div class="cb-widget-container">
        <button class="cb-toggle-btn" id="cb-toggle-btn">💬</button>
        <div class="cb-overlay" id="cb-overlay"></div>
        <div class="cb-chat-widget" id="cb-chat-widget">
          <div class="cb-chat-header">
            <h3>Chat Assistant</h3>
            <button class="cb-close-btn" id="cb-close-btn">✕</button>
          </div>
          <div class="cb-chat-messages" id="cb-chat-messages"></div>
          <form class="cb-chat-input-form" id="cb-chat-form">
            <input type="text" class="cb-chat-input" id="cb-chat-input" placeholder="Ask me anything..." />
            <button type="submit" class="cb-send-btn" id="cb-send-btn">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20" fill="currentColor">
                <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L277.3 424.9l-40.1 74.5c-5.2 9.7-16.3 14.6-27 11.9S192 499 192 488V392c0-5.3 1.8-10.5 5.1-14.7L362.4 164.7c2.5-7.1-6.5-14.3-13-8.4L170.4 318.2l-32 28.9 0 0c-9.2 8.3-22.3 10.6-33.8 5.8l-85-35.4C8.4 312.8 .8 302.2 .1 290s5.5-23.7 16.1-29.8l448-256c10.7-6.1 23.9-5.5 34 1.4z"/>
              </svg>
            </button>
          </form>
        </div>
      </div>
    `;

    // Append to body
    document.body.insertAdjacentHTML('beforeend', widgetHTML);

    // Attach event listeners
    attachEventListeners();

    // Add welcome message
    addMessage('👋 Hi there! Welcome to Cars PH', 'bot');
  }

  function attachEventListeners() {
    const toggleBtn = document.getElementById('cb-toggle-btn');
    const closeBtn = document.getElementById('cb-close-btn');
    const overlay = document.getElementById('cb-overlay');
    const form = document.getElementById('cb-chat-form');

    toggleBtn.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);
    overlay.addEventListener('click', toggleChat);
    form.addEventListener('submit', handleSendMessage);
  }

  function toggleChat() {
    isOpen = !isOpen;
    const widget = document.getElementById('cb-chat-widget');
    const overlay = document.getElementById('cb-overlay');
    const toggleBtn = document.getElementById('cb-toggle-btn');
    
    if (isOpen) {
      widget.classList.add('open');
      overlay.classList.add('open');
      toggleBtn.textContent = '✕';
    } else {
      widget.classList.remove('open');
      overlay.classList.remove('open');
      toggleBtn.textContent = '💬';
    }
  }

  function addMessage(text, sender) {
    const messagesContainer = document.getElementById('cb-chat-messages');
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Determine name and avatar based on sender
    const name = sender === 'bot' ? 'ChatDPT' : 'You';
    const avatar = sender === 'bot' ? '🤖' : '👤';
    
    const messageHTML = `
      <div class="cb-message cb-${sender}-message">
        <div class="cb-message-header">
          <div class="cb-message-avatar">${avatar}</div>
          <div class="cb-message-name">${name}</div>
        </div>
        <div class="cb-message-content">${escapeHtml(text)}</div>
        <div class="cb-message-timestamp">${timestamp}</div>
      </div>
    `;
    
    messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
    scrollToBottom();
  }

  function showTypingIndicator() {
    const messagesContainer = document.getElementById('cb-chat-messages');
    const indicatorHTML = `
      <div class="cb-message cb-bot-message" id="cb-typing-indicator">
        <div class="cb-message-content cb-typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
    messagesContainer.insertAdjacentHTML('beforeend', indicatorHTML);
    scrollToBottom();
  }

  function hideTypingIndicator() {
    const indicator = document.getElementById('cb-typing-indicator');
    if (indicator) {
      indicator.remove();
    }
  }

  async function handleSendMessage(e) {
    e.preventDefault();
    
    const input = document.getElementById('cb-chat-input');
    const sendBtn = document.getElementById('cb-send-btn');
    const message = input.value.trim();
    
    if (!message || isLoading) return;
    
    // Add user message
    addMessage(message, 'user');
    input.value = '';
    
    // Disable input
    isLoading = true;
    input.disabled = true;
    sendBtn.disabled = true;
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      hideTypingIndicator();
      addMessage(data.response, 'bot');
    } catch (error) {
      console.error('Error:', error);
      hideTypingIndicator();
      addMessage('Sorry, I encountered an error. Please try again.', 'bot');
    } finally {
      isLoading = false;
      input.disabled = false;
      sendBtn.disabled = false;
      input.focus();
    }
  }

  function scrollToBottom() {
    const messagesContainer = document.getElementById('cb-chat-messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
  } else {
    initChatbot();
  }
})();
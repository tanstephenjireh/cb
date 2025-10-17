import React from 'react';
import './App.css';
import ChatWidget from './components/ChatWidget';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to My Website</h1>
        <p>This is a demo website with an integrated chatbot.</p>
        <p>Click the chat button in the bottom right to start chatting!</p>
      </header>
      
      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}

export default App;
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to send the message to the backend API
  const sendMessage = async () => {
    if (!message.trim()) return; // Do not send empty messages

    const newHistory = [...history, { role: 'user', content: message }];
    setHistory(newHistory);
    setMessage('');
    setLoading(true);

    try {
      // Make a POST request to the backend with the current message and history
      const response = await axios.post('http://127.0.0.1:5000/chat', {
        message: message,
        history: newHistory,
      });

      // Append bot's response to history
      setHistory([
        ...newHistory,
        { role: 'bot', content: response.data.response },
      ]);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <h1>🤖 Chatbot</h1>
      <div className="chat-box">
        {history.map((msg, index) => (
          <div
            key={index}
            className={msg.role === 'user' ? 'user-message' : 'bot-message'}
          >
            <strong>{msg.role === 'user' ? 'You' : 'Bot'}:</strong> {msg.content}
          </div>
        ))}
        {loading && <div className="bot-message">Bot is typing...</div>}
      </div>
      <div className="input-box">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') sendMessage(); // Allow Enter key to send message
          }}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;

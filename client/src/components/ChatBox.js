import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sendChatMessage } from '../redux/actions/userActions';
import './ChatBox.css';

const ChatBox = ({ onNewMessage }) => {
  const dispatch = useDispatch();
  const { socket } = useSelector(state => state.socket);
  const { userData } = useSelector(state => state.user);
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  
  // Setup chat listener
  useEffect(() => {
    if (socket) {
      socket.on('newChatMessage', (message) => {
        setMessages(prev => [...prev, message]);
        // Notify parent component if available
        if (onNewMessage) {
          onNewMessage();
        }
      });
      
      return () => {
        socket.off('newChatMessage');
      };
    }
  }, [socket, onNewMessage]);
  
  // Scroll to bottom when new messages come in
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    dispatch(sendChatMessage(newMessage));
    setNewMessage('');
  };
    return (
    <div className="chat-box">
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="no-messages">No messages yet</div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={index} 
              className={`message ${message.sender === userData?.name ? 'own-message' : ''}`}
            >
              <div className="message-sender">{message.sender}</div>
              <div className="message-text">{message.message}</div>
              <div className="message-time">
                {new Date(message.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit'
                })}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="message-form">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit" disabled={!newMessage.trim()}>Send</button>
      </form>
    </div>
  );
};

export default ChatBox;

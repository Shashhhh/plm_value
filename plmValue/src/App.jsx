import React, {useState} from 'react';
import './App.css';
import { FaArrowUp } from"react-icons/fa6";

function App({messages = [], onSend}) {
  const [message, setMessage] = useState('');
  const handleSend = () => {
    if (message.trim() !== '') {
      onSend(message);
      setMessage('');
    }
  };
  return (
    <div className="container">
      <div className="chat">
        <div className='pageHeader'>
        <p>
          PLM Value Prop Helper
        </p>
        </div>
        <div className='chatScreen'>
        {messages.map((message, index) => (
                <div
                    key={index}
                    className={`messageContainer ${message.isUserMessage ? 'userMessage' : 'responseMessage'}`}
                >
                <p className="messageText">{message.content}</p>
                </div>
                ))}

        </div>
        <div className='textInputBox'>
        <input 
          type="text" 
          className="textInput" 
          placeholder="Type a message..." 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSend();
            }
          }}
        />
        <button className="sendButton" onClick={handleSend}>
          <FaArrowUp size={24} color="white" />
        </button>
        </div>
      </div>
    </div>
  );
}

export default App;

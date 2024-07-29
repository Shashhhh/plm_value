import React, {useState, useEffect} from 'react';
import './App.css';
import { FaArrowUp } from"react-icons/fa6";
import { useLocation } from 'react-router-dom';
function App() {

  //const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [currentMessage, setCurrentMessage] = useState('');
  //const assistantChoice = new URLSearchParams(location.search).get('assistantChoice');
  const [loading, setLoading] = useState(false);
  const assistantChoice = "Machinist"
  useEffect(() => {
    const ws = new WebSocket(`wss://backend-ckmm.onrender.com/ws/stream/${assistantChoice}/`);
    ws.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.onmessage = (event) => {
      const responseData = JSON.parse(event.data);
      if (responseData.delta) {
        updateCurrentMessage(responseData.delta);
      } else if (responseData.error) {
        alert('Error: ' + responseData.error);
      }
      setLoading(false);
    };

    ws.onerror = (error) => {
      alert('Error: WebSocket error occurred');
      console.error('WebSocket error:', error);
      setLoading(false);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setLoading(false);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [assistantChoice]);

  const updateCurrentMessage = (deltaText) => {
    setCurrentMessage(prev => prev + deltaText);
  };

  const onSend = (text) => {
    const newUserMessage = { content: text, isUserMessage: true };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);

    if (socket) {
      setLoading(true);
      socket.send(text);
    } else {
      alert('Error: WebSocket connection is not open');
    }
  };

  useEffect(() => {
    if (currentMessage.trim() !== '') {
      const lastMessageIndex = messages.length - 1;
      if (lastMessageIndex >= 0 && !messages[lastMessageIndex].isUserMessage) {
        setMessages(prevMessages => [
          ...prevMessages.slice(0, lastMessageIndex),
          { ...prevMessages[lastMessageIndex], content: prevMessages[lastMessageIndex].content + currentMessage }
        ]);
      } else {
        setMessages(prevMessages => [...prevMessages, { content: currentMessage, isUserMessage: false }]);
      }
      setCurrentMessage('');
    }
  }, [currentMessage, messages]);
  const [input, setInput] = useState('');
  const handleSend = () => {
    if (input.trim() !== '') {
      onSend(input);
      setInput('');
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
        {loading && <div class="loading"></div>}
        </div>
        <div className='textInputBox'>
          <div class="inputWrapper">
            <input
              type="text" 
              className="textInput" 
              placeholder="Ask anything" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSend();
                }
              }}>
              </input>
        <button className="sendButton" onClick={handleSend}>
          <FaArrowUp size={24} color="white" />
        </button>
        </div>
        </div>
      </div>
    </div>
  );
}

export default App;

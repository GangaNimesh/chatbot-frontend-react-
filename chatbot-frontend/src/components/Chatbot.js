import React, {useState, useRef, useEffect} from 'react';
import '../assets/App.css';

const Chatbot=()=>{
  const chatBoxRef = useRef(null);
  const inputRef = useRef(null);
  const [firstMessageSent, setFirstMessageSent] = useState(false);
  const [chat, setChat] =useState(()=> localStorage.getItem("chatHistory") || "");
  const [message, setMessage] = useState("");
  const [sessionId, setSessionId] = useState(() =>{
    let storedId = localStorage.getItem("sessionId");
    if (!storedId){
      storedId = crypto.randomUUID();
      localStorage.setItem("sessionId", storedId);
    }
    return storedId;
  });
  useEffect(() =>{
    if(chatBoxRef.current) {
      chatBoxRef.current.innerHTML = chat;
    }
  }, [chat]);
  const sendMessage =() =>{
    if (!message.trim()) return;
    const userMsg = `<div class="bubble user-bubble">${message}</div>`;
    const updatedChat = chat + userMsg;
    setChat(updatedChat);
    setMessage("");
    setFirstMessageSent(true);
    scrollToBottom();
    fetch("http://localhost:5000/chat",{
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, sessionId })
    })
      .then(res => res.json())
      .then(data => {
        const botMsg = `<div class="bubble bot-bubble">${data.response}</div>`;
        const newChat = updatedChat + botMsg;
        setChat(newChat);
        localStorage.setItem("chatHistory", newChat);
        scrollToBottom();
      })
      .catch(() => {
        const errorMsg = `<div class="bubble bot-bubble">Error: Could not reach backend.</div>`;
        const newChat = updatedChat + errorMsg;
        setChat(newChat);
        scrollToBottom();
      });
  };
  const scrollToBottom = () =>{
    setTimeout(() => {
      if(chatBoxRef.current){
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    },100);
  };
  const resetChat = () => {
    localStorage.removeItem("chatHistory");
    localStorage.removeItem("sessionId");
    setChat("");
    setFirstMessageSent(false);
    const newId = crypto.randomUUID();
    localStorage.setItem("sessionId", newId);
    setSessionId(newId);
  };
  const handleKeyDown =(e) =>{
    if(e.key === "Enter") sendMessage();
  };
  return(
    <div className="chatbot-popup-right">
      <div className={`chatbot-header ${firstMessageSent ? "faded" : ""}`}>
        <h3>Innova Chatbot</h3>
      </div>
      <div className={`container ${firstMessageSent ? 'fade-bg' : ''}`}>
        <div className="bg-image"/>
        <div ref={chatBoxRef} className="chat-box"/>
        <div className="input-section">
          <input
            type="text"
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about Innovature..."
          />
          <button className="circle-send" onClick={sendMessage}>↑</button>
        </div>
        <div className="reset-wrapper">
          <button className="reset-btn" onClick={resetChat}>Reset</button>
        </div>
      </div>
    </div>
  );
};
export default Chatbot;
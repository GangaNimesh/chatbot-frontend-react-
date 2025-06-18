import React, { useState, useRef, useEffect } from 'react';
import '../assets/App.css';

const Chatbot = () => {
  const chatBoxRef = useRef(null);
  const inputRef = useRef(null);
  const [firstMessageSent, setFirstMessageSent] = useState(false);
  const [chat, setChat] = useState(() => localStorage.getItem("chatHistory") || "");
  const [message, setMessage] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.innerHTML = chat;
    }
  }, [chat]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const userMsg = `<div class="bubble user-bubble">${message}</div>`;
    const updatedChat = chat + userMsg;
    setChat(updatedChat);
    setMessage("");
    setFirstMessageSent(true);
    scrollToBottom();

    fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
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

  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    }, 100);
  };

  const resetChat = () => {
    localStorage.removeItem("chatHistory");
    setChat("");
    setFirstMessageSent(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const dynamicStyles = {
    bgImage: {
      position: "fixed",
      top: windowWidth >= 1200 ? "0" : "50%",
      left: windowWidth >= 1200 ? "0" : "50%",
      transform: windowWidth >= 1200 ? "none" : "translate(-50%, -50%)",
      width: windowWidth >= 1200 ? "45vw" : "130vw",
      height: windowWidth >= 1200 ? "100vh" : "130vh",
      backgroundImage: 'url("https://innovature.ai/wp-content/uploads/2024/02/lgo.png")',
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      backgroundPosition: windowWidth >= 1200 ? "left center" : "center",
      zIndex: -2
    },
    darkOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: windowWidth < 1200 && firstMessageSent ? "rgba(0,0,0,0.7)" : "transparent",
      zIndex: -1,
      transition: "background-color 0.7s ease"
    },
    chatWrapper: {
      position: "absolute",
      top: "50%",
      left: windowWidth >= 1200 ? "75%" : "50%",
      transform: "translate(-50%, -50%)",
      width: "90%",
      maxWidth: "600px",
      padding: "20px",
      backgroundColor: windowWidth >= 1200 ? "#ffffff" : "transparent",
      borderRadius: windowWidth >= 1200 ? "12px" : "0",
      boxShadow: windowWidth >= 1200 ? "0 0 12px rgba(0,0,0,0.2)" : "none",
      zIndex: 2,
      transition: "all 0.3s ease"
    },
    sendBtn: {
      display: windowWidth > 767 ? "inline-block" : "none"
    },
    circleSend: {
      display: windowWidth <= 767 ? "flex" : "none"
    }
  };

  return (
    <div className="container">
      <div style={dynamicStyles.bgImage}></div>
      <div style={dynamicStyles.darkOverlay}></div>

      <div className="chat-wrapper" style={dynamicStyles.chatWrapper}>
        <div ref={chatBoxRef} className="chat-box"></div>

        <div className="input-section">
          <input
            type="text"
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about Innovature..."
          />
          <button className="send-btn" style={dynamicStyles.sendBtn} onClick={sendMessage}>Send</button>
          <button className="circle-send" style={dynamicStyles.circleSend} onClick={sendMessage}>↑</button>
        </div>

        <div className="reset-wrapper">
          <button className="reset-btn" onClick={resetChat}>Reset</button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;

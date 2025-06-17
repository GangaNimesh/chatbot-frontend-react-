import React, { useEffect, useRef, useState } from 'react';

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

  const styles = {
    container: {
      position: "relative",
      width: "100%",
      height: "100vh",
      backgroundColor: "#dae4e9",
      fontFamily: "Arial, sans-serif",
      overflow: "hidden"
    },
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
      zIndex: 0
    },
    darkOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: windowWidth < 1200 && firstMessageSent ? "rgba(0,0,0,0.7)" : "transparent",
      zIndex: 1,
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
      zIndex: 2
    },
    chatBox: {
      width: "100%",
      height: "70vh",
      overflowY: "auto",
      marginBottom: "15px",
      padding: "10px",
      display: "flex",
      flexDirection: "column",
      gap: "10px"
    },
    inputSection: {
      display: "flex",
      alignItems: "center",
      width: "100%",
      gap: "10px"
    },
    input: {
      flexGrow: 1,
      padding: "10px 15px",
      borderRadius: "20px",
      border: "none",
      outline: "none",
      fontSize: "14px",
      backgroundColor: "#c9dff3",
      color: "#020202"
    },
    sendBtn: {
      padding: "10px 24px",
      fontSize: "14px",
      background: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "20px",
      cursor: "pointer",
      display: windowWidth > 767 ? "inline-block" : "none"
    },
    circleSend: {
      display: windowWidth <= 767 ? "flex" : "none",
      width: 36,
      height: 36,
      borderRadius: "50%",
      border: "none",
      background: "#007bff",
      color: "white",
      fontSize: 18,
      cursor: "pointer",
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 5
    },
    resetWrapper: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      marginTop: "10px"
    },
    resetBtn: {
      padding: "10px 24px",
      fontSize: "14px",
      background: "#f53243",
      color: "white",
      border: "none",
      borderRadius: "20px",
      cursor: "pointer"
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.bgImage}></div>
      <div style={styles.darkOverlay}></div>

      <div style={styles.chatWrapper}>
        <div ref={chatBoxRef} style={styles.chatBox}></div>

        <div style={styles.inputSection}>
          <input
            type="text"
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            style={styles.input}
            placeholder="Ask anything about Innovature..."
          />
          <button style={styles.sendBtn} onClick={sendMessage}>Send</button>
          <button style={styles.circleSend} onClick={sendMessage}>↑</button>
        </div>

        <div style={styles.resetWrapper}>
          <button style={styles.resetBtn} onClick={resetChat}>Reset</button>
        </div>
      </div>

      <style>{`
        .bubble {
          max-width: 75%;
          padding: 10px 15px;
          border-radius: 18px;
          font-size: 15px;
          line-height: 1.4;
          word-wrap: break-word;
        }
        .user-bubble {
          background-color: #84c0f5;
          color: #1a1515;
          align-self: flex-end;
          border-bottom-right-radius: 0;
          margin-left: auto;
        }
        .bot-bubble {
          background-color: #f1f1f1;
          color: #232729;
          align-self: flex-start;
          border-bottom-left-radius: 0;
          margin-right: auto;
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
